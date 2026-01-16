/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCall} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const logger = require("firebase-functions/logger");

initializeApp();

// API 키는 환경 변수로 관리하는 것이 좋지만, 일단 코드에 포함합니다.
const genAI = new GoogleGenerativeAI("apiKey");

// 1. 아레나 (1:1) 레이팅 계산 함수 (시간 차 반영 로직 포함)
exports.updateArenaResult = onCall({cors: true}, async (request) => {
  if (!request.auth) throw new Error("Authentication required.");

  const userId = request.auth.uid;
  const {myResult, opponentResult, problemId, problemDifficulty} = request.data;
  // myResult: { isCorrect: boolean, time: number }
  // opponentResult: { isCorrect: boolean, time: number, rating: number }

  const db = getFirestore();
  const userRef = db.collection("users").doc(userId);

  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new Error("User profile not found.");

    const userData = userDoc.data();
    const myRating = userData.rating || 1000;
    let winStreak = userData.winStreak || 0;

    // 1. 승패 판정
    let resultText;
    if (myResult.isCorrect && opponentResult.isCorrect) {
      resultText = myResult.time < opponentResult.time ? "WIN" : "LOSE";
    } else if (myResult.isCorrect && !opponentResult.isCorrect) {
      resultText = "WIN";
    } else if (!myResult.isCorrect && opponentResult.isCorrect) {
      resultText = "LOSE";
    } else {
      resultText = "DRAW";
    }

    // 2. 게임 성과(Score) 계산 (시간 차 반영)
    let myGameOutcome;
    const oppTime = parseFloat(opponentResult.time.toFixed(1));
    const myTime = parseFloat(myResult.time.toFixed(1));

    if (resultText === "WIN") {
      // 둘 다 정답이면 시간차 계산, 상대 오답이면 1.1
      myGameOutcome = opponentResult.isCorrect ? (oppTime - myTime + 5) / 10 : 1.1;
    } else if (resultText === "LOSE") {
      // 둘 다 정답이면 시간차 계산(음수 나옴), 나만 오답이면 -0.1
      myGameOutcome = myResult.isCorrect ? (oppTime - myTime + 5) / 10 : -0.1;
    } else {
      myGameOutcome = 0.5;
    }

    // 점수 인플레이션 방지를 위해 성과도(Outcome)를 -0.5 ~ 1.5 사이로 제한
    myGameOutcome = Math.min(Math.max(myGameOutcome, -0.5), 1.5);

    // 3. 레이팅 변동 계산
    const K_FACTOR = 8;
    const RATING_SCALE = 400;
    let ratingChange = 0;

    if (resultText === "DRAW") {
      ratingChange = !myResult.isCorrect ? -2 : 0;
      winStreak = 0;
    } else {
      const expectedScore = 1 / (1 + Math.pow(10, (opponentResult.rating - myRating) / RATING_SCALE));
      ratingChange = Math.round(K_FACTOR * (myGameOutcome - expectedScore));

      if (resultText === "WIN") {
        winStreak++;
        if (winStreak >= 5) ratingChange += 5;
      } else {
        winStreak = 0;
      }
    }

    const newRating = myRating + ratingChange;

    await userRef.update({
      rating: newRating,
      mileage: FieldValue.increment(resultText === "WIN" ? 5 : 0),
      winStreak: winStreak,
    });

    // 4. 문제 난이도 업데이트 (옵션)
    if (problemId && problemDifficulty !== undefined && resultText !== "DRAW") {
      const K_FACTOR_PROBLEM = 2;
      const expectedScoreProb = 1 / (1 + Math.pow(10, (myRating - problemDifficulty) / RATING_SCALE));
      // 공식: K * (1 - outcome - expected)
      const diffChange = Math.round(K_FACTOR_PROBLEM * (1 - myGameOutcome - expectedScoreProb));

      if (diffChange !== 0) {
        await db.collection("problems").doc(problemId).update({
          difficulty: FieldValue.increment(diffChange),
        });
      }
    }

    return {success: true, newRating, ratingChange, resultText, winStreak};
  } catch (error) {
    logger.error("Arena Rating Error:", error);
    throw new Error("Rating update failed.");
  }
});

// 2. 문제 생성
exports.generateProblem = onCall({cors: true}, async (request) => {
  const originalProblem = request.data.latex;
  const difficulty = request.data.difficulty || "middle";

  const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

  const prompt = `
    다음 수학 문제와 동일한 풀이 논리를 가진 새로운 '객관식' 문제를 만들어줘.
    난이도: ${difficulty}
    원본 문제: ${originalProblem}

    조건:
    1. JSON 형식으로만 답해.
    2. 반드시 4개의 선택지를 포함해야 해.
    3. 선택지 중 하나는 정답이고, 나머지 3개는 매력적인 오답이어야 해.
    4. 포맷 예시: 
    {
      "question": "문제(LaTeX)", 
      "choices": ["1", "2", "3", "4"], 
      "answer": "정답", 
      "solution": "풀이"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {success: true, data: text};
  } catch (error) {
    logger.error("Gemini Error:", error);
    return {success: false, error: error.message};
  }
});

// 3. 그랜드 아레나 (1:4) 레이팅 계산 함수
exports.updateGrandArenaResult = onCall({cors: true}, async (request) => {
  if (!request.auth) throw new Error("인증되지 않은 사용자입니다.");

  const userId = request.auth.uid;
  const {myResult, opponents} = request.data;
  // myResult: { isCorrect: boolean, time: number }
  // opponents: [{ rating: number, isCorrect: boolean, timeTaken: number }, ...]

  const db = getFirestore();
  const userRef = db.collection("users").doc(userId);

  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new Error("유저 정보를 찾을 수 없습니다.");

    const userData = userDoc.data();
    const myRating = userData.rating || 1000;

    let totalChange = 0;
    const K = 12; // 1:4 모드 전용 K-Factor (1등 보상 강화: 약 24점)

    opponents.forEach((opp) => {
      let actualScore = 0.5;
      if (myResult.isCorrect && !opp.isCorrect) actualScore = 1;
      else if (!myResult.isCorrect && opp.isCorrect) actualScore = 0;
      else if (myResult.isCorrect && opp.isCorrect) actualScore = myResult.time < opp.timeTaken ? 1 : 0;
      else actualScore = 0.5;

      const expectedScore = 1 / (1 + Math.pow(10, (opp.rating - myRating) / 400));
      totalChange += K * (actualScore - expectedScore);
    });

    const ratingChange = Math.round(totalChange);
    const newRating = myRating + ratingChange;

    await userRef.update({
      rating: newRating,
      mileage: FieldValue.increment(ratingChange > 0 ? 5 : 0),
    });

    return {success: true, newRating, ratingChange};
  } catch (error) {
    logger.error("Grand Arena Rating Error:", error);
    throw new Error("레이팅 업데이트 실패");
  }
});

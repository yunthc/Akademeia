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

// 1. Elo 레이팅 계산
exports.updateArenaResult = onCall({cors: true}, async (request) => {
  if (!request.auth) {
    throw new Error("Authentication required.");
  }
  const userId = request.auth.uid;
  const {win, opponentRating} = request.data;

  const db = getFirestore();
  const userRef = db.collection("users").doc(userId);

  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new Error("User profile not found.");
    }

    const userData = userDoc.data();
    const myRating = userData.rating || 1000;

    const expectedScore = 1 / (1 + 10 ** ((opponentRating - myRating) / 400));
    const actualScore = win ? 1 : 0;

    let kFactor = 24;
    if (myRating < 1200) kFactor = 32;
    if (myRating > 2000) kFactor = 16;

    const ratingChange = Math.round(kFactor * (actualScore - expectedScore));
    const newRating = myRating + ratingChange;

    await userRef.update({
      rating: newRating,
      mileage: FieldValue.increment(win ? 5 : 0),
    });

    return {
      success: true,
      newRating: newRating,
      ratingChange: ratingChange,
    };
  } catch (error) {
    logger.error("Error updating rating:", error);
    throw new Error("Failed to update rating.");
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

// functions/index.js

const {onCall} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {GoogleGenerativeAI} = require("@google/generative-ai");

initializeApp();

// Elo 레이팅 계산 로직을 처리하는 메인 함수
exports.updateArenaResult = onCall(async (request) => {
  // 1. 사용자가 로그인했는지 확인
  if (!request.auth) {
    throw new Error("Authentication required.");
  }
  const userId = request.auth.uid;
  const { win, opponentRating } = request.data; // 프론트에서 보낸 데이터

  const db = getFirestore();
  const userRef = db.collection("users").doc(userId);

  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new Error("User profile not found.");
    }

    const userData = userDoc.get();
    const myRating = userData.rating;

    // 2. Elo 공식에 따라 예상 승률 계산
    const expectedScore = 1 / (1 + 10 ** ((opponentRating - myRating) / 400));
    
    // 3. 실제 결과 (S_A) 설정: 이기면 1, 지면 0
    const actualScore = win ? 1 : 0;
    
    // 4. K-Factor 설정 (유저 레이팅에 따라 가중치 조절)
    let kFactor = 24; // 기본값
    if (myRating < 1200) kFactor = 32; // 초보
    if (myRating > 2000) kFactor = 16; // 고수
    
    // 5. 새로운 레이팅 계산 및 레이팅 변동폭 계산
    const ratingChange = Math.round(kFactor * (actualScore - expectedScore));
    const newRating = myRating + ratingChange;

    // 6. Firestore 문서 업데이트
    await userRef.update({
      rating: newRating,
      mileage: FieldValue.increment(win ? 5 : 0), // 이기면 5, 지면 0 마일리지
    });

    // 7. 프론트엔드에 결과 반환
    return {
      success: true,
      newRating: newRating,
      ratingChange: ratingChange,
    };
  } catch (error) {
    console.error("Error updating rating:", error);
    throw new Error("Failed to update rating.");
  }
});

// functions/index.js




// 1. 제미나이 API 설정 (API 키는 환경변수나 여기에 직접 넣어도 서버라 안전함)
// 하지만 .env 설정을 추천합니다. 일단 여기선 설명 편의상 직접 넣는 예시입니다.

const genAI = new GoogleGenerativeAI("apiKey");

// 2. 외부(프론트엔드)에서 부를 수 있는 함수 이름: "generateProblem"
exports.generateProblem = onCall(async (request) => {
    // 클라이언트가 보낸 데이터 받기
    const originalProblem = request.data.latex;
    const difficulty = request.data.difficulty || "middle";

    // 3. 모델 선택
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. 프롬프트 작성
    const prompt = `
        다음 수학 문제와 동일한 풀이 논리를 가진 새로운 '객관식' 문제를 만들어줘.
        난이도: ${difficulty}
        원본 문제: ${originalProblem}
        
        조건:
        1. JSON 형식으로만 답해.
        2. 반드시 4개의 선택지를 포함해야 해.
        3. 선택지 중 하나는 정답이고, 나머지 3개는 매력적인 오답이어야 해.
        4. 포맷: {"question": "문제 지문 (LaTeX 사용 가능)", "choices": ["선택지1", "선택지2", "선택지3", "선택지4"], "answer": "정답 텍스트", "solution": "자세한 풀이"}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // 5. 결과만 리턴
        return { success: true, data: text };
    } catch (error) {
        console.error("Gemini Error:", error);
        return { success: false, error: error.message };
    }
});
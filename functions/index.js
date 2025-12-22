// functions/index.js

const { onCall } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

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
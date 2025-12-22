// src/pages/leaderboard.js
import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import '../auth.js'; // 공통 인증 로직 및 헤더 UI 업데이트

/**
 * Firestore에서 사용자 랭킹 데이터를 가져와 화면에 표시합니다.
 */
async function initializeLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard-list');
    if (!leaderboardContainer) return;

    try {
        // 'users' 컬렉션에서 'rating'을 기준으로 내림차순 정렬하여 상위 100명을 가져오는 쿼리
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("rating", "desc"), limit(100));

        const querySnapshot = await getDocs(q);

        // 로딩 메시지 제거 및 헤더 추가
        leaderboardContainer.innerHTML = `
            <div class="leaderboard-header">
                <div class="rank">#</div>
                <div class="nickname">닉네임</div>
                <div class="rating">레이팅</div>
                <div class="grade">학년</div>
            </div>
        `;

        if (querySnapshot.empty) {
            leaderboardContainer.innerHTML += '<p class="loader">아직 랭킹 데이터가 없습니다.</p>';
            return;
        }

        let rank = 1;
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userElement = document.createElement('div');
            userElement.className = 'leaderboard-item';

            userElement.innerHTML = `
                <div class="rank">${rank}</div>
                <div class="nickname">${userData.nickname || '이름없음'}</div>
                <div class="rating">${Math.round(userData.rating)}</div>
                <div class="grade">${userData.grade || '미설정'}</div>
            `;

            leaderboardContainer.appendChild(userElement);
            rank++;
        });

    } catch (error) {
        console.error("리더보드 로딩 중 오류 발생:", error);
        leaderboardContainer.innerHTML = '<p class="loader" style="color: red;">랭킹을 불러오는 중 오류가 발생했습니다.</p>';
        if (error.code === 'failed-precondition') {
            leaderboardContainer.innerHTML += `<p style="color: red; font-size: 0.8rem; text-align: center;">(오류: Firestore 색인(Index)이 필요합니다. 개발자 도구(F12) 콘솔을 확인하여, 생성 링크를 클릭해주세요.)</p>`;
        }
    }
}

// 사용자가 로그인 상태일 때 리더보드 초기화 함수를 호출합니다.
onAuthStateChanged(auth, (user) => {
    if (user) {
        initializeLeaderboard();
    }
    // 로그아웃 상태는 auth.js에서 처리하므로 별도 로직이 필요 없습니다.
});
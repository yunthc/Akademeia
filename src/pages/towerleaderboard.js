import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import '../auth.js';

async function initializeTowerLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard-list');
    if (!leaderboardContainer) return;

    try {
        // tower_results 컬렉션에서 finalFloor 기준 내림차순으로 상위 50개 가져오기
        const resultsRef = collection(db, "tower_results");
        const q = query(resultsRef, orderBy("finalFloor", "desc"), limit(50));

        const querySnapshot = await getDocs(q);

        leaderboardContainer.innerHTML = `
            <div class="leaderboard-header">
                <div class="rank">순위</div>
                <div class="nickname">닉네임</div>
                <div class="floor">도달 층</div>
                <div class="date">날짜</div>
            </div>
        `;

        if (querySnapshot.empty) {
            leaderboardContainer.innerHTML += '<p style="padding: 20px; text-align: center;">아직 등록된 기록이 없습니다. 첫 번째 도전자가 되어보세요!</p>';
            return;
        }

        let rank = 1;
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const item = document.createElement('div');
            item.className = 'leaderboard-item';

            const dateStr = data.createdAt ? data.createdAt.toDate().toLocaleDateString() : '-';

            item.innerHTML = `
                <div class="rank">${rank}</div>
                <div class="nickname">${data.nickname || '익명'}</div>
                <div class="floor">${data.finalFloor}층</div>
                <div class="date">${dateStr}</div>
            `;

            leaderboardContainer.appendChild(item);
            rank++;
        });

    } catch (error) {
        console.error("리더보드 로딩 오류:", error);
        leaderboardContainer.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">랭킹을 불러오는 중 오류가 발생했습니다.</p>';
        if (error.code === 'failed-precondition') {
            leaderboardContainer.innerHTML += `<p style="color: red; font-size: 0.8rem; text-align: center;">(오류: Firestore 색인(Index)이 필요합니다. 콘솔을 확인해주세요.)</p>`;
        }
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        initializeTowerLeaderboard();
    }
});
import { auth } from '../firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import '../auth.js'; // 공통 인증 로직 실행

document.addEventListener('DOMContentLoaded', () => {
    const startArenaBtn = document.getElementById('start-arena-btn');
    const startSprintBtn = document.getElementById('start-sprint-btn');
    const startTowerBtn = document.getElementById('start-tower-btn');
    const lobbyStatus = document.getElementById('lobby-status');

    // --- 페이지 초기화 ---
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setupHeaderUI(user); // 헤더 UI 설정은 여기서도 필요
            startArenaBtn.addEventListener('click', () => findMatchAndRedirect('arena'));
            startSprintBtn.addEventListener('click', () => findMatchAndRedirect('sprint'));
            startTowerBtn.addEventListener('click', () => findMatchAndRedirect('tower'));
        } else {
            window.location.href = '/index.html';
        }
    });

    async function findMatchAndRedirect(mode) {
        const buttons = document.querySelectorAll('.mode-select-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        lobbyStatus.textContent = 'Now Loading...';

        try {
            // 실제 백엔드 연동 시: Cloud Function 호출하여 고유 ID 받아오기
            // const newId = await createNewGameSession(mode);
            
            // 테스트용 Mock 로직: 2초 후 가짜 ID 생성
            const newId = await new Promise(resolve => {
                setTimeout(() => {
                    resolve(`mock_${mode}_${Date.now()}`);
                }, 150);
            });

            // 모드에 따라 적절한 페이지로 이동
            if (mode === 'arena') {
                window.location.href = `/pages/arena.html?matchId=${newId}`;
            } else if (mode === 'sprint') {
                window.location.href = `/pages/sprint.html?sessionId=${newId}`;
            } else if (mode === 'tower') {
                window.location.href = `/pages/tower.html?sessionId=${newId}`;
            }

        } catch (error) {
            console.error("매치메이킹 실패:", error);
            lobbyStatus.textContent = '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            buttons.forEach(btn => btn.disabled = false);
        }
    }

    // 헤더 UI 설정 함수 (공통 사용 가능)
    function setupHeaderUI(userData) {
        const userProfileDiv = document.getElementById('user-profile');
        if (!userProfileDiv) return;
        const profileImage = document.getElementById('header-profile-image');
        const nicknameLink = document.getElementById('header-nickname');
        const ratingSpan = document.getElementById('header-rating');
        const logoutBtn = document.getElementById('logout-btn');
        userProfileDiv.classList.remove('hidden');
        profileImage.src = userData.photoURL || `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34495e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 5.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>')}`;
        nicknameLink.textContent = userData.nickname || "User";
        ratingSpan.textContent = `(${userData.rating})`;
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        newLogoutBtn.addEventListener('click', () => signOut(auth));
    }
});
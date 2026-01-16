import { auth } from '../firebase.js';
import { requireAuth } from '../auth.js'; // 공통 인증 로직 실행

document.addEventListener('DOMContentLoaded', () => {
    const startArenaBtn = document.getElementById('start-arena-btn');
    const startSprintBtn = document.getElementById('start-sprint-btn');
    const startTowerBtn = document.getElementById('start-tower-btn');
    const startGrandArenaBtn = document.getElementById('start-grand-arena-btn');
    const lobbyStatus = document.getElementById('lobby-status');

    // --- 페이지 초기화 ---
    requireAuth((user, userData) => {
        startArenaBtn.addEventListener('click', () => findMatchAndRedirect('arena'));
        startSprintBtn.addEventListener('click', () => findMatchAndRedirect('sprint'));
        startTowerBtn.addEventListener('click', () => findMatchAndRedirect('tower'));
        startGrandArenaBtn.addEventListener('click', () => findMatchAndRedirect('grand-arena'));
    });

    async function findMatchAndRedirect(mode) {
        const buttons = document.querySelectorAll('.mode-select-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        lobbyStatus.textContent = '게임 준비 중...';

        try {
            // 고유 ID 생성 (UUID 사용, 지원하지 않는 브라우저는 타임스탬프 사용)
            const newId = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : `game_${Date.now()}`;
            
            // 짧은 대기 시간 (UX)
            await new Promise(resolve => setTimeout(resolve, 300));

            // 모드에 따라 적절한 페이지로 이동
            if (mode === 'arena') {
                window.location.href = `/pages/arena.html?matchId=${newId}`;
            } else if (mode === 'grand-arena') {
                window.location.href = `/pages/grand-arena.html?matchId=${newId}`;
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
});
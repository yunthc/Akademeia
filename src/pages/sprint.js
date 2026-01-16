import { auth, db } from '../firebase.js';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { multipleChoiceProblems } from '../problem-data.js';
import { requireAuth } from '../auth.js'; // 공통 인증 로직 실행을 위해 import

// BFCache(뒤로가기 캐시)로 인해 로그아웃 후 뒤로가기 시 이전 게임 화면이 복구되는 것을 방지
window.addEventListener('pageshow', (event) => {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        window.location.reload();
    }
});

function preventNavigation(event) {
    event.preventDefault();
    event.returnValue = '';
}

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 ---
    const challengeLobby = document.getElementById('challenge-lobby');
    const challengeScreen = document.getElementById('challenge-screen');
    const runResultScreen = document.getElementById('run-result-screen');
    const startChallengeBtn = document.getElementById('start-challenge-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    // ... 더 많은 DOM 요소들

    // --- 상태 변수 ---
    let currentUserProfile;
    let challengeSettings = { domain: null, level: null, grade: null };
    let currentRun = {};
    let masterTimerInterval;

    // --- 페이지 초기화 ---
    requireAuth((user, userData) => {
        currentUserProfile = userData;
        initializeLobby();
    });

    /**
     * 로비 화면을 초기화하고, 필터 버튼에 이벤트 리스너를 설정합니다.
     */
    function initializeLobby() {
        // 유저의 남은 도전 횟수, 최고 기록 등을 불러와서 표시하는 로직 (지금은 하드코딩)
        document.getElementById('attempts-left').textContent = '10/10';
        document.getElementById('personal-best').textContent = '--:--.--';
        
        // 리더보드 링크에 탭 파라미터 추가
        const leaderboardLink = document.getElementById('leaderboard-link');
        if (leaderboardLink) {
            leaderboardLink.href = '/pages/leaderboard.html?tab=sprint';
        }

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const { filterType, value } = btn.dataset;
                
                // 같은 그룹의 다른 버튼들의 'selected' 상태를 해제
                document.querySelectorAll(`.filter-btn[data-filter-type="${filterType}"]`).forEach(b => b.classList.remove('selected'));
                // 현재 클릭한 버튼에 'selected' 상태 추가
                btn.classList.add('selected');

                challengeSettings[filterType] = value;
                checkCanStart();
            });
        });

        startChallengeBtn.addEventListener('click', startChallenge);

        // 다시 도전하기 버튼 기능 연결
        const retryBtn = document.getElementById('retry-challenge-btn');
        if (retryBtn) {
            retryBtn.onclick = () => {
                runResultScreen.classList.add('hidden');
                challengeLobby.classList.remove('hidden');
            };
        }
    }
    
    /**
     * 모든 필터가 선택되었는지 확인하고, [도전 시작] 버튼을 활성화/비활성화합니다.
     */
    function checkCanStart() {
        const canStart = Object.values(challengeSettings).every(value => value !== null);
        startChallengeBtn.disabled = !canStart;
    }

    /**
     * 새로운 챌린지 세션을 시작합니다.
     */
    async function startChallenge() {
        window.addEventListener('beforeunload', preventNavigation);
        challengeLobby.classList.add('hidden');
        challengeScreen.classList.remove('hidden');

        // 1. 문제 10개를 비동기적으로 가져옵니다. (지금은 mock 데이터 사용)
        const problems = await fetchProblems(challengeSettings);

        // 2. 챌린지 상태를 초기화합니다.
        currentRun = {
            problems: problems,
            answers: [],
            startTime: Date.now(),
            currentProblemIndex: 0,
            lives: 3 // 라이프 3개로 시작
        };

        // 3. 마스터 타이머를 시작하고, 첫 문제를 표시합니다.
        updateLivesUI();
        setupProgressBar(); // 진행 바 초기화
        startMasterTimer();
        displayProblem();
    }

    function updateLivesUI() {
        const livesEl = document.getElementById('lives-counter');
        if (livesEl) {
            livesEl.textContent = '❤️'.repeat(Math.max(0, currentRun.lives));
        }
    }

    function setupProgressBar() {
        const container = document.getElementById('sprint-progress-bar');
        container.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const segment = document.createElement('div');
            segment.className = 'progress-segment';
            container.appendChild(segment);
        }
    }

    function updateProgressBar() {
        const segments = document.querySelectorAll('.progress-segment');
        segments.forEach((seg, idx) => {
            if (idx < currentRun.currentProblemIndex) {
                seg.classList.add('filled');
            } else {
                seg.classList.remove('filled');
            }
        });
    }
    
    /**
     * 현재 문제 인덱스에 맞는 문제를 화면에 표시합니다.
     */
    function displayProblem() {
        const problemIndex = currentRun.currentProblemIndex;
        const problem = currentRun.problems[problemIndex];

        document.getElementById('challenge-info').textContent = `${challengeSettings.domain} (${challengeSettings.level} ${challengeSettings.grade}학년)`;
        updateProgressBar(); // 진행 바 업데이트

        // 수식 렌더링을 위해 innerHTML로 설정
        document.getElementById('problem-text').innerHTML = problem.question;

        const choicesContainer = document.getElementById('choices-container');
        choicesContainer.innerHTML = '';
        problem.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = choice; // 수식 렌더링을 위해 textContent 대신 innerHTML 사용
            btn.onclick = () => handleAnswer(choice === problem.answer, btn);
            choicesContainer.appendChild(btn);
        });

        // 수식 렌더링 트리거
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    }

    /**
     * 유저의 답변을 처리합니다.
     * @param {boolean} isCorrect - 정답 여부
     * @param {HTMLElement} btn - 클릭된 버튼
     */
    function handleAnswer(isCorrect, btn) {
        // 정답/오답에 따른 처리
        if (isCorrect) {
            // 정답인 경우
            currentRun.answers.push({
                problemId: currentRun.problems[currentRun.currentProblemIndex].id,
                isCorrect: true
            });

            currentRun.currentProblemIndex++;
            if (currentRun.currentProblemIndex < 10) {
                displayProblem();
            } else {
                finishChallenge();
            }
        } else {
            // 오답인 경우
            currentRun.lives--;
            updateLivesUI();
            
            if (btn) btn.classList.add('incorrect-choice');

            if (currentRun.lives <= 0) {
                finishGameAsFailure();
            } else {
                // 5초 대기 페널티
                const penaltyFeedback = document.getElementById('penalty-feedback');
                penaltyFeedback.textContent = '오답입니다! 5초 후 재시도하세요.';
                lockChoices(true);
                
                setTimeout(() => {
                    lockChoices(false);
                    penaltyFeedback.textContent = '';
                    if (btn) btn.classList.remove('incorrect-choice');
                }, 5000);
            }
        }
    }

    /**
     * 챌린지를 종료하고 결과를 처리합니다.
     */
    async function finishChallenge() {
        window.removeEventListener('beforeunload', preventNavigation);
        clearInterval(masterTimerInterval);

        const endTime = Date.now();
        const rawTime = (endTime - currentRun.startTime) / 1000;
        const finalTime = rawTime; // 페널티 시간 삭제 (대기 시간으로 대체됨)
        const correctCount = 10; // 성공했으므로 무조건 10문제

        // 결과 DB에 저장
        if (currentUserProfile) {
            try {
                await addDoc(collection(db, "sprint_results"), {
                    uid: currentUserProfile.uid,
                    nickname: currentUserProfile.nickname,
                    photoURL: currentUserProfile.photoURL || null,
                    finalTime: finalTime,
                    correctCount: correctCount,
                    lives: currentRun.lives, // 남은 라이프 저장
                    createdAt: serverTimestamp()
                });
            } catch (error) {
                console.error("기록 저장 실패:", error);
            }
        }

        // 결과 화면 표시
        document.getElementById('result-title').textContent = "도전 완료!";
        document.getElementById('final-time').textContent = formatTime(finalTime);
        document.getElementById('correct-count').textContent = correctCount;
        document.getElementById('penalty-seconds').textContent = '0'; // 표시상 0으로 둠
        document.getElementById('penalty-row').classList.remove('hidden');

        const perfectBadge = document.getElementById('perfect-badge');
        if (currentRun.lives === 3) {
            perfectBadge.classList.remove('hidden');
        } else {
            perfectBadge.classList.add('hidden');
        }

        challengeScreen.classList.add('hidden');
        runResultScreen.classList.remove('hidden');
    }

    function finishGameAsFailure() {
        window.removeEventListener('beforeunload', preventNavigation);
        clearInterval(masterTimerInterval);
        
        const elapsedTime = (Date.now() - currentRun.startTime) / 1000;
        
        document.getElementById('result-title').textContent = "도전 실패";
        document.getElementById('perfect-badge').classList.add('hidden');
        document.getElementById('final-time').textContent = formatTime(elapsedTime);
        document.getElementById('correct-count').textContent = currentRun.currentProblemIndex;
        document.getElementById('penalty-seconds').textContent = '0';
        document.getElementById('penalty-row').classList.add('hidden'); // 실패 시 페널티 정보는 불필요하므로 숨김

        challengeScreen.classList.add('hidden');
        runResultScreen.classList.remove('hidden');
    }

    function lockChoices(isLocked) {
        const buttons = document.querySelectorAll('.choice-btn');
        buttons.forEach(btn => btn.disabled = isLocked);
        const container = document.getElementById('choices-container');
        if (isLocked) container.classList.add('choices-locked');
        else container.classList.remove('choices-locked');
    }

    /**
     * 마스터 타이머를 시작하고, 0.1초마다 화면을 업데이트합니다.
     */
    function startMasterTimer() {
        const timerEl = document.getElementById('master-timer');
        masterTimerInterval = setInterval(() => {
            const elapsedTime = (Date.now() - currentRun.startTime) / 1000;
            const displayTime = elapsedTime;
            timerEl.textContent = formatTime(displayTime);
        }, 100);
    }
    
    /**
     * 초(seconds)를 mm:ss.s 형식의 문자열로 변환합니다.
     */
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${secs.toFixed(1).padStart(4, '0')}`;
    }

    /**
     * 설정에 맞는 문제 10개를 가져오는 Mock 함수입니다.
     */
    async function fetchProblems(settings) {
        console.log(`${settings.domain}/${settings.level}/${settings.grade} 문제 가져오는 중...`);
        // 실제로는 Firestore에서 필터링된 쿼리로 문제를 가져옵니다.
        // 지금은 모든 문제 중에서 랜덤으로 10개를 뽑습니다.
        const shuffled = multipleChoiceProblems.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 10);
    }
});
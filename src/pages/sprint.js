import { auth, db } from '../firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { multipleChoiceProblems, ghostRecords } from '../problem-data.js';
import '../auth.js'; // 공통 인증 로직 실행을 위해 import

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
    onAuthStateChanged(auth, async (user) => {
        if (!user) { window.location.href = '/index.html'; return; }
        
        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        if (userDocSnap.exists()) {
            currentUserProfile = { uid: user.uid, ...userDocSnap.data() };
            initializeLobby();
        } else { window.location.href = '/profile.html'; }
    });

    /**
     * 로비 화면을 초기화하고, 필터 버튼에 이벤트 리스너를 설정합니다.
     */
    function initializeLobby() {
        // 유저의 남은 도전 횟수, 최고 기록 등을 불러와서 표시하는 로직 (지금은 하드코딩)
        document.getElementById('attempts-left').textContent = '10/10';
        document.getElementById('personal-best').textContent = '--:--.--';

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
        challengeLobby.classList.add('hidden');
        challengeScreen.classList.remove('hidden');

        // 1. 문제 10개를 비동기적으로 가져옵니다. (지금은 mock 데이터 사용)
        const problems = await fetchProblems(challengeSettings);

        // 2. 챌린지 상태를 초기화합니다.
        currentRun = {
            problems: problems,
            answers: [],
            startTime: Date.now(),
            totalPenalty: 0,
            currentProblemIndex: 0
        };

        // 3. 마스터 타이머를 시작하고, 첫 문제를 표시합니다.
        startMasterTimer();
        displayProblem();
    }
    
    /**
     * 현재 문제 인덱스에 맞는 문제를 화면에 표시합니다.
     */
    function displayProblem() {
        const problemIndex = currentRun.currentProblemIndex;
        const problem = currentRun.problems[problemIndex];

        document.getElementById('challenge-info').textContent = `${challengeSettings.domain} (${challengeSettings.level} ${challengeSettings.grade}학년)`;
        document.getElementById('problem-counter').textContent = `${problemIndex + 1} / 10`;

        // 수식 렌더링을 위해 innerHTML로 설정
        document.getElementById('problem-text').innerHTML = problem.question;

        const choicesContainer = document.getElementById('choices-container');
        choicesContainer.innerHTML = '';
        problem.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = choice; // 수식 렌더링을 위해 textContent 대신 innerHTML 사용
            btn.onclick = () => handleAnswer(choice === problem.answer);
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
     */
    function handleAnswer(isCorrect) {
        // 정답/오답에 따른 처리
        if (!isCorrect) {
            currentRun.totalPenalty += 10; // 10초 페널티 추가
            const penaltyFeedback = document.getElementById('penalty-feedback');
            penaltyFeedback.textContent = '+10초 페널티!';
            setTimeout(() => penaltyFeedback.textContent = '', 1000); // 1초 후 메시지 사라짐
        }

        // 답변 기록 저장 (아레나 고스트 데이터로 활용 가능)
        currentRun.answers.push({
            problemId: currentRun.problems[currentRun.currentProblemIndex].id,
            isCorrect: isCorrect,
            // ...기타 필요한 정보
        });

        // 다음 문제로 넘어가거나, 챌린지를 종료합니다.
        currentRun.currentProblemIndex++;
        if (currentRun.currentProblemIndex < 10) {
            displayProblem();
        } else {
            finishChallenge();
        }
    }

    /**
     * 챌린지를 종료하고 결과를 처리합니다.
     */
    function finishChallenge() {
        clearInterval(masterTimerInterval);

        const endTime = Date.now();
        const rawTime = (endTime - currentRun.startTime) / 1000;
        const finalTime = rawTime + currentRun.totalPenalty;
        const correctCount = currentRun.answers.filter(a => a.isCorrect).length;

        // 결과 DB에 저장하는 로직 (실제 구현 시 필요)
        // await saveChallengeResult({ finalTime, correctCount, ... });

        // 결과 화면 표시
        document.getElementById('final-time').textContent = formatTime(finalTime);
        document.getElementById('correct-count').textContent = correctCount;
        document.getElementById('penalty-seconds').textContent = currentRun.totalPenalty;

        challengeScreen.classList.add('hidden');
        runResultScreen.classList.remove('hidden');

        // '다시 도전하기' 버튼 활성화/비활성화 로직 (남은 횟수 체크)
        // const attemptsLeft = 9; // 예시
        // document.getElementById('retry-challenge-btn').disabled = attemptsLeft <= 0;
    }

    /**
     * 마스터 타이머를 시작하고, 0.1초마다 화면을 업데이트합니다.
     */
    function startMasterTimer() {
        const timerEl = document.getElementById('master-timer');
        masterTimerInterval = setInterval(() => {
            const elapsedTime = (Date.now() - currentRun.startTime) / 1000;
            const displayTime = elapsedTime + currentRun.totalPenalty;
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

    function setupHeaderUI(userData) {
        const userProfileDiv = document.getElementById('user-profile');
        if (!userProfileDiv) return;
        
        const profileImage = document.getElementById('header-profile-image');
        const nicknameLink = document.getElementById('header-nickname');
        const ratingSpan = document.getElementById('header-rating');
        const logoutBtn = document.getElementById('logout-btn');

        userProfileDiv.classList.remove('hidden');
        
        profileImage.src = userData.photoURL || `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>')}`;
        nicknameLink.textContent = userData.nickname || "User";
        ratingSpan.textContent = `(${userData.rating})`;
        
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        newLogoutBtn.addEventListener('click', () => signOut(auth));
    }
});
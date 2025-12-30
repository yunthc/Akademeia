import { auth, db } from '../firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { multipleChoiceProblems } from '../problem-data.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 ---
    const lobbyScreen = document.getElementById('tower-lobby');
    const blitzScreen = document.getElementById('blitz-screen');
    const towerScreen = document.getElementById('tower-screen');
    const resultScreen = document.getElementById('run-result-screen');
    const startChallengeBtn = document.getElementById('start-challenge-btn');
    const blitzToggleBtn = document.getElementById('blitz-toggle-btn');

    // --- 상태 변수 ---
    let currentUserProfile;
    let currentRun = {};
    let allTimers = [];
    let isBlitzModeOn = false; // 기본값 '꺼짐'
    const BLITZ_TIME_CAP = 30; // 블리츠 모드 최대 시간 (초)

    // --- 페이지 초기화 ---
    onAuthStateChanged(auth, async (user) => {
        if (!user) { window.location.href = '/index.html'; return; }
        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        if (userDocSnap.exists()) {
            currentUserProfile = { uid: user.uid, ...userDocSnap.data() };
            setupHeaderUI(currentUserProfile);
            initializeLobby();
        } else { window.location.href = '/profile.html'; }
    });

    // --- 함수 정의 ---
    function initializeLobby() {
        lobbyScreen.classList.remove('hidden');
        blitzScreen.classList.add('hidden');
        towerScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');

        document.getElementById('attempts-left').textContent = '10/10';
        document.getElementById('personal-best-floor').textContent = '0';
        
        startChallengeBtn.disabled = false; 
        startChallengeBtn.addEventListener('click', startChallenge);
        blitzToggleBtn.addEventListener('click', toggleBlitzMode);
        updateBlitzToggleUI();
    }
    
    function toggleBlitzMode() {
        isBlitzModeOn = !isBlitzModeOn;
        updateBlitzToggleUI();
    }

    function updateBlitzToggleUI() {
        blitzToggleBtn.dataset.state = isBlitzModeOn ? 'on' : 'off';
        blitzToggleBtn.textContent = isBlitzModeOn ? '블리츠 모드 켜짐' : '블리츠 모드 꺼짐';
    }

    function stopAllTimers() {
        allTimers.forEach(id => { clearInterval(id); clearTimeout(id); });
        allTimers = [];
    }
    
    async function startChallenge() {
        lobbyScreen.classList.add('hidden');
        if (isBlitzModeOn) {
            blitzScreen.classList.remove('hidden');
            await startBlitzPhase();
        } else {
            towerScreen.classList.remove('hidden');
            await startTowerPhase(0);
        }
    }
    
    async function startBlitzPhase() {
        const problems = await fetchProblems({ count: 100 });
        currentRun = {
            phase: 'blitz',
            problems,
            timer: BLITZ_TIME_CAP,
            problemsSolved: 0,
            currentProblemIndex: 0
        };

        updateBlitzUI();
        displayBlitzProblem();

        const blitzTimerId = setInterval(() => {
            currentRun.timer -= 0.1;
            updateBlitzUI();
            if (currentRun.timer <= 0) {
                endBlitzPhase();
            }
        }, 100);
        allTimers.push(blitzTimerId);
    }

    function displayBlitzProblem() {
        const problem = currentRun.problems[currentRun.currentProblemIndex];
        if (!problem) { endBlitzPhase(); return; }

        const problemTextEl = document.getElementById('blitz-problem-text');
        problemTextEl.textContent = problem.question;
        if(window.MathJax) MathJax.typesetPromise([problemTextEl]).catch(err => console.error(err));

        const choicesContainer = document.getElementById('blitz-choices-container');
        choicesContainer.innerHTML = '';
        problem.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice;
            btn.onclick = () => handleBlitzAnswer(choice === problem.answer);
            choicesContainer.appendChild(btn);
        });
    }

    function handleBlitzAnswer(isCorrect) {
        if (!isCorrect) {
            endBlitzPhase();
            return;
        }
        // 정답 시, '푼 문제 수'를 올리고 시간을 더한 후 다음 문제로
        currentRun.problemsSolved++;
        currentRun.timer = Math.min(BLITZ_TIME_CAP, currentRun.timer + 3);
        currentRun.currentProblemIndex++;
        updateBlitzUI();
        displayBlitzProblem();
    }

    function handleBlitzAnswer(isCorrect) {
        if (!isCorrect) {
            endBlitzPhase();
            return;
        }
        // 정답 시, '푼 문제 수'를 올리고 시간을 더한 후 다음 문제로
        currentRun.problemsSolved++;
        currentRun.timer = Math.min(BLITZ_TIME_CAP, currentRun.timer + 3);
        currentRun.currentProblemIndex++;
        updateBlitzUI();
        displayBlitzProblem();
    }
    
    function updateBlitzUI() {
        const timerBar = document.getElementById('blitz-timer-bar');
        const timerText = document.getElementById('blitz-timer-text');
        const solvedCounter = document.getElementById('blitz-solved-counter');
        
        if (timerBar && timerText && solvedCounter) {
            // 최대 시간(30초)을 기준으로 바의 너비 계산
            const remainingPercentage = (currentRun.timer / BLITZ_TIME_CAP) * 100;
            timerBar.style.width = `${Math.max(0, remainingPercentage)}%`;
            timerText.textContent = Math.max(0, currentRun.timer).toFixed(1);
            // 맞힌 개수 업데이트
            solvedCounter.textContent = currentRun.problemsSolved;
        }
    }

    function endBlitzPhase() {
        stopAllTimers();
        const startingFloor = currentRun.problemsSolved * 5;
        transitionToTowerPhase(startingFloor);
    }

    function transitionToTowerPhase(startingFloor) {
        blitzScreen.classList.add('hidden');
        towerScreen.classList.remove('hidden');
        startTowerPhase(startingFloor);
    }

    // ▼▼▼ 버그 수정된 함수 ▼▼▼
    async function startTowerPhase(startingFloor) {
        // 'startFloor'가 아닌 'startingFloor'를 사용하도록 수정
        const problems = await fetchProblems({ startFloor: startingFloor, count: 100 });
        currentRun = {
            phase: 'tower',
            problems,
            startFloor: startingFloor, // 변수명 일치
            currentFloor: startingFloor > 0 ? startingFloor + 1 : 1,
            lives: 3,
            timeBank: 300,
            timeBankCap: 900,
            passCount: 3,
            currentProblemIndex: 0
        };
        document.getElementById('pass-btn').onclick = handlePass;
        updateTowerUI();
        displayTowerProblem();
        const towerTimerId = setInterval(() => {
            currentRun.timeBank--;
            updateTowerUI();
            if (currentRun.timeBank < 0) {
                finishChallenge('timeout');
            }
        }, 1000);
        allTimers.push(towerTimerId);
    }

    function displayTowerProblem() {
        const problem = currentRun.problems[currentRun.currentProblemIndex];
        if (!problem) { finishChallenge('clear'); return; }
        const problemTextEl = document.getElementById('tower-problem-text');
        problemTextEl.textContent = problem.question;
        if(window.MathJax) MathJax.typesetPromise([problemTextEl]).catch(err => console.error(err));
        const choicesContainer = document.getElementById('tower-choices-container');
        choicesContainer.innerHTML = '';
        problem.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice;
            btn.onclick = () => handleTowerAnswer(choice === problem.answer);
            choicesContainer.appendChild(btn);
        });
    }

    function handleTowerAnswer(isCorrect) {
        if (!isCorrect) {
            currentRun.lives--;
        } else {
            currentRun.timeBank = Math.min(currentRun.timeBankCap, currentRun.timeBank + 30);
            currentRun.currentFloor++;
        }
        if (currentRun.lives <= 0) {
            finishChallenge('fail');
            return;
        }
        currentRun.currentProblemIndex++;
        updateTowerUI();
        displayTowerProblem();
    }

    function handlePass() {
        if (currentRun.passCount > 0) {
            currentRun.passCount--;
            currentRun.currentProblemIndex++;
            currentRun.currentFloor++;
            updateTowerUI();
            displayTowerProblem();
        }
    }

    function updateTowerUI() {
        document.getElementById('floor-counter').textContent = currentRun.currentFloor;
        document.getElementById('lives-counter').textContent = '❤️'.repeat(currentRun.lives);
        document.getElementById('time-bank-text').textContent = formatTime(currentRun.timeBank);
        document.getElementById('time-bank-fill').style.width = `${(currentRun.timeBank / currentRun.timeBankCap) * 100}%`;
        const passBtn = document.getElementById('pass-btn');
        passBtn.querySelector('span').textContent = currentRun.passCount;
        passBtn.disabled = currentRun.passCount <= 0;
        passBtn.className = `btn-${currentRun.passCount > 0 ? 'primary' : 'secondary'}`;
    }

    async function finishChallenge(reason) {
        stopAllTimers();
        const finalFloor = currentRun.currentFloor > 0 ? currentRun.currentFloor - 1 : 0;

        // ▼▼▼ 게임 결과 Firestore 저장 로직 추가 ▼▼▼
        if (currentUserProfile) {
            try {
                await addDoc(collection(db, "tower_results"), {
                    uid: currentUserProfile.uid,
                    nickname: currentUserProfile.nickname,
                    finalFloor: finalFloor,
                    createdAt: serverTimestamp()
                });
            } catch (error) {
                console.error("기록 저장 실패:", error);
            }
        }
        // ▲▲▲▲▲▲

        document.getElementById('final-floor').textContent = finalFloor;
        document.getElementById('final-time-bank').textContent = formatTime(currentRun.timeBank);
        towerScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        document.getElementById('retry-challenge-btn').onclick = initializeLobby;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.max(0, Math.floor(seconds % 60));
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    async function fetchProblems(settings) {
        const shuffled = multipleChoiceProblems.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, settings.count);
    }
    
    function setupHeaderUI(userData) {
        const userProfileDiv = document.getElementById('user-profile');
        if (!userProfileDiv) return;
        const profileImage = document.getElementById('header-profile-image');
        const nicknameLink = document.getElementById('header-nickname');
        const ratingSpan = document.getElementById('header-rating');
        const logoutBtn = document.getElementById('logout-btn');
        userProfileDiv.classList.remove('hidden');
        profileImage.src = userData.photoURL || `data:image/svg+xml,${encodeURIComponent('<svg/>')}`;
        nicknameLink.textContent = userData.nickname || "User";
        ratingSpan.textContent = `(${userData.rating})`;
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        newLogoutBtn.addEventListener('click', () => signOut(auth));
    }
});
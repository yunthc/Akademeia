import { auth, db } from '../firebase.js';
import { doc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { requireAuth } from '../auth.js';

// BFCache 방지
window.addEventListener('pageshow', (event) => {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        window.location.reload();
    }
});

function preventNavigation(event) {
    event.preventDefault();
    event.returnValue = '';
}

// 애니메이션 스타일 주입
const style = document.createElement('style');
style.textContent = `
@keyframes popRating {
    0% { transform: scale(1); }
    50% { transform: scale(1.5); color: #2ecc71; }
    100% { transform: scale(1); }
}
.pop-animation {
    display: inline-block;
    animation: popRating 0.5s ease-out;
}
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 ---
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    const cancelMatchBtn = document.getElementById('cancel-match-btn');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    
    const opponentsListEl = document.getElementById('opponents-list');
    const mainTimerDisplay = document.getElementById('main-timer-display');
    const problemTextEl = document.getElementById('problem-text');
    const choicesContainer = document.getElementById('choices-container');
    const statusMessageEl = document.getElementById('status-message');
    
    const playAgainBtn = document.getElementById('play-again-btn');
    const postQnaBtn = document.getElementById('post-qna-btn');
    const earlyExitBtn = document.getElementById('early-exit-btn');

    // --- 게임 상태 변수 ---
    let currentUserProfile;
    let currentProblem;
    let opponentRecords = []; // 4명의 고스트 기록
    let opponentStates = [];  // 4명의 현재 게임 상태
    // incorrectCount와 firstAttemptTime 추가
    let myState = { finished: false, isCorrect: false, time: 0, timedOut: false, incorrectCount: 0, firstAttemptTime: null };
    
    let startTime;
    let gameTimerInterval;
    let gameEnded = false;
    let matchTimer = null;
    let suddenDeathEndTime = null;
    const MAX_GAME_TIME = 60; // 최대 게임 시간 60초

    // --- 페이지 초기화 ---
    requireAuth((user, userData) => {
        currentUserProfile = userData;
        initializeGrandArena();
    });

    function initializeGrandArena() {
        playAgainBtn.addEventListener('click', createNewMatchAndRedirect);
        postQnaBtn.addEventListener('click', postQuestionToQnA);
        
        if (earlyExitBtn) {
            earlyExitBtn.addEventListener('click', () => finishGame(true));
        }
        
        if (cancelMatchBtn) {
            cancelMatchBtn.addEventListener('click', () => {
                if (matchTimer) clearTimeout(matchTimer);
                window.location.href = '/pages/matchmaking.html';
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('matchId')) {
            fetchMatchAndStartGame(urlParams.get('matchId'));
        } else {
            alert("잘못된 접근입니다.");
            window.location.href = '/pages/matchmaking.html';
        }
    }

    async function createNewMatchAndRedirect() {
        playAgainBtn.disabled = true;
        resultScreen.classList.add('hidden');
        loadingScreen.classList.remove('hidden');
        loadingText.textContent = "새로운 대전 상대들을 찾고 있습니다...";

        matchTimer = setTimeout(() => {
            const newMatchId = `grand_match_${Date.now()}`;
            window.location.href = `/pages/grand-arena.html?matchId=${newMatchId}`;
        }, 1500);
    }

    async function fetchMatchAndStartGame(matchId) {
        try {
            const matchData = await performMultiplayerMatchmaking();
            currentProblem = matchData.problem;
            opponentRecords = matchData.opponents;
            startGame();
        } catch (error) {
            console.error(error);
            alert("매칭 중 오류가 발생했습니다: " + error.message);
            window.location.href = '/pages/matchmaking.html';
        }
    }

    // --- 1:4 매치메이킹 로직 ---
    async function performMultiplayerMatchmaking() {
        const userRating = currentUserProfile.rating;
        const difficultyMargin = 150; // 1:1보다 범위를 조금 더 넓게 잡음

        // 1. 문제 가져오기
        const problemsRef = collection(db, "problems");
        const q = query(problemsRef, 
            where("difficulty", ">=", userRating - difficultyMargin),
            where("difficulty", "<=", userRating + difficultyMargin)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) throw new Error("적절한 문제를 찾을 수 없습니다.");

        const problems = [];
        querySnapshot.forEach(doc => problems.push({ id: doc.id, ...doc.data() }));
        const selectedProblem = problems[Math.floor(Math.random() * problems.length)];

        // 2. 고스트 4명 가져오기
        const ghostsRef = collection(db, "ghosts");
        const qGhost = query(ghostsRef, 
            where("problemId", "==", selectedProblem.id),
            where("nickname", "!=", currentUserProfile.nickname)
        );
        const ghostSnapshot = await getDocs(qGhost);
        
        const potentialGhosts = [];
        ghostSnapshot.forEach(doc => potentialGhosts.push(doc.data()));

        const selectedGhosts = [];
        const OPPONENT_COUNT = 4;

        for (let i = 0; i < OPPONENT_COUNT; i++) {
            if (potentialGhosts.length > 0) {
                const idx = Math.floor(Math.random() * potentialGhosts.length);
                selectedGhosts.push(potentialGhosts[idx]);
                potentialGhosts.splice(idx, 1); // 중복 방지
            } else {
                // 고스트 부족 시 봇 생성
                selectedGhosts.push(createBotGhost(selectedProblem.difficulty));
            }
        }

        return { problem: selectedProblem, opponents: selectedGhosts };
    }

    function createBotGhost(difficulty) {
        const isCorrect = Math.random() > 0.4; // 60% 확률로 정답
        const timeTaken = Math.random() * 20 + 10; // 10~30초
        const nickname = `Bot_${Math.floor(Math.random() * 9000) + 1000}`;
        return {
            nickname: nickname,
            rating: Math.round(difficulty + (Math.random() * 200 - 100)),
            timeTaken: timeTaken,
            isCorrect: isCorrect,
            firstAttemptTime: timeTaken, // 봇은 단순하게 처리
            firstAttemptIsCorrect: isCorrect,
            photoURL: null,
            uid: null // 봇임을 명시
        };
    }

    // --- 게임 진행 ---
    function startGame() {
        window.addEventListener('beforeunload', preventNavigation);
        loadingScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        earlyExitBtn.classList.add('hidden');

        // 상태 초기화
        gameEnded = false;
        suddenDeathEndTime = null;
        myState = { finished: false, isCorrect: false, time: 0, timedOut: false, incorrectCount: 0, firstAttemptTime: null };
        opponentStates = opponentRecords.map(() => ({
            finished: false,
            displayedStatus: '고민 중...',
            penaltyTriggered: false
        }));

        // UI 초기화
        renderPlayersList();
        problemTextEl.textContent = currentProblem.question;
        statusMessageEl.textContent = "문제를 풀고 순위를 결정하세요!";
        statusMessageEl.style.color = "";
        if (window.MathJax) MathJax.typesetPromise([problemTextEl]);

        // 선택지 렌더링
        const choices = [...currentProblem.choices].sort(() => Math.random() - 0.5);
        choicesContainer.innerHTML = '';
        choicesContainer.classList.remove('choices-locked');
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice;
            btn.onclick = () => handleAnswer(choice, btn);
            choicesContainer.appendChild(btn);
        });

        // 타이머 시작
        startTime = Date.now();
        gameTimerInterval = setInterval(updateGameLoop, 100);
    }

    function renderPlayersList() {
        opponentsListEl.innerHTML = '';
        
        // 1. 나 (최상단)
        const myItem = createPlayerItem(currentUserProfile, 'player-item-me', true);
        opponentsListEl.appendChild(myItem);

        // 2. 상대방들
        opponentRecords.forEach((opp, idx) => {
            const item = createPlayerItem(opp, `opp-item-${idx}`, false);
            // 초기 상태 텍스트 설정
            item.querySelector('.status').textContent = opponentStates[idx].displayedStatus;
            opponentsListEl.appendChild(item);
        });
    }

    function createPlayerItem(userData, elementId, isMe) {
        const div = document.createElement('div');
        div.className = `player-item ${isMe ? 'me' : ''}`;
        div.id = elementId;
        
        const defaultAvatar = '/default-avatar.svg'; // 기본 이미지 경로
        const photoURL = userData.photoURL || defaultAvatar;

        div.innerHTML = `
            <div class="player-info">
                <img src="${photoURL}" alt="Profile" class="player-avatar">
                <div class="player-details">
                    <span class="name">${userData.nickname}</span>
                    <span class="rating">(${userData.rating})</span>
                </div>
            </div>
            <span class="status">${isMe ? '진행 중...' : '고민 중...'}</span>
        `;
        return div;
    }

    function updateGameLoop() {
        if (gameEnded) return;
        const elapsedTime = (Date.now() - startTime) / 1000;
        mainTimerDisplay.textContent = elapsedTime.toFixed(1);

        // 1. 최대 시간(60초) 초과 체크
        if (elapsedTime >= MAX_GAME_TIME) {
            finishGame();
            return;
        }

        // 상대방 상태 업데이트 시뮬레이션
        opponentRecords.forEach((opp, idx) => {
            const state = opponentStates[idx];
            if (state.finished) return;

            // 1차 시도 오답 시 페널티 애니메이션 트리거
            if (!opp.firstAttemptIsCorrect && !state.penaltyTriggered && elapsedTime >= opp.firstAttemptTime) {
                state.penaltyTriggered = true;
                const el = document.getElementById(`opp-item-${idx}`);
                if (el) {
                    el.classList.add('penalty-active');
                    el.querySelector('.status').textContent = '오답! (페널티)';
                }
            }

            if (elapsedTime >= opp.timeTaken) {
                state.finished = true;
                state.isCorrect = opp.isCorrect;
                state.time = opp.timeTaken;
                
                // UI 업데이트
                const el = document.getElementById(`opp-item-${idx}`);
                if (el) {
                    el.classList.remove('penalty-active'); // 페널티 종료
                    el.classList.add('finished');
                    el.classList.add(opp.isCorrect ? 'correct' : 'incorrect');
                    el.querySelector('.status').textContent = opp.isCorrect ? '정답!' : '오답';
                }
                checkAllFinished();
            }
        });

        // 2. 3등까지 결정되었는지 확인 (정답자가 3명 이상일 때만 서든데스 발동)
        let correctCount = 0;
        if (myState.finished && myState.isCorrect) correctCount++;
        opponentStates.forEach(s => { if (s.finished && s.isCorrect) correctCount++; });

        if (correctCount >= 3 && suddenDeathEndTime === null) {
            suddenDeathEndTime = elapsedTime + 5;
            statusMessageEl.textContent = "3위가 결정되었습니다! 5초 후 종료됩니다.";
            statusMessageEl.style.color = "#e74c3c"; // 경고색(빨강)
        }

        // 3. 서든데스 시간 초과 체크
        if (suddenDeathEndTime !== null && elapsedTime >= suddenDeathEndTime) {
            finishGame();
        }
    }

    function handleAnswer(choice, btn) {
        if (myState.finished || gameEnded) return;
        if (choicesContainer.classList.contains('choices-locked')) return;

        const isCorrect = choice === currentProblem.answer;
        const attemptTime = (Date.now() - startTime) / 1000;

        // 첫 시도 시간 기록
        if (myState.incorrectCount === 0 && !myState.firstAttemptTime) {
            myState.firstAttemptTime = attemptTime;
        }

        const myItem = document.getElementById('player-item-me');

        if (isCorrect) {
            myState.finished = true;
            myState.isCorrect = true;
            myState.time = attemptTime;

            // UI 반영
            btn.classList.add('correct-choice');
            choicesContainer.classList.add('choices-locked');
            statusMessageEl.textContent = "정답입니다! 다른 플레이어를 기다리는 중...";

            if (myItem) {
                myItem.classList.add('finished', 'correct');
                myItem.querySelector('.status').textContent = '정답!';
            }

            checkAllFinished();

            // 정답을 맞힌 후 1초 뒤에 조기 종료 버튼 표시
            setTimeout(() => {
                if (!gameEnded) earlyExitBtn.classList.remove('hidden');
            }, 1000);
            
        } else {
            // 오답 처리
            myState.incorrectCount++;
            btn.classList.add('incorrect-choice');
            btn.disabled = true; // 틀린 버튼 비활성화

            if (myState.incorrectCount >= 2) {
                // 2회 오답 -> 종료
                myState.finished = true;
                myState.isCorrect = false;
                myState.time = attemptTime;

                choicesContainer.classList.add('choices-locked');
                statusMessageEl.textContent = "오답입니다. (기회 소진)";

                if (myItem) {
                    myItem.classList.add('finished', 'incorrect');
                    myItem.querySelector('.status').textContent = '오답';
                }

                checkAllFinished();

                // 탈락 후에도 결과 바로 보기 가능
                setTimeout(() => {
                    if (!gameEnded) earlyExitBtn.classList.remove('hidden');
                }, 1000);
            } else {
                // 1회 오답 -> 5초 페널티
                choicesContainer.classList.add('choices-locked');
                statusMessageEl.textContent = "오답입니다! 5초간 대기하세요.";

                if (myItem) {
                    myItem.classList.add('penalty-active');
                    myItem.querySelector('.status').textContent = '오답! (페널티)';
                }
                
                setTimeout(() => {
                    if (gameEnded || myState.finished) return;
                    choicesContainer.classList.remove('choices-locked');
                    statusMessageEl.textContent = "다시 정답을 선택하세요!";

                    if (myItem) {
                        myItem.classList.remove('penalty-active');
                        myItem.querySelector('.status').textContent = '진행 중...';
                    }
                }, 5000);
            }
        }
    }

    function checkAllFinished() {
        const allOpponentsDone = opponentStates.every(s => s.finished);
        if (myState.finished && allOpponentsDone) {
            finishGame();
        }
    }

    function finishGame(isEarlyExit = false) {
        if (gameEnded) return;
        gameEnded = true;
        clearInterval(gameTimerInterval);
        window.removeEventListener('beforeunload', preventNavigation);

        // 아직 안 끝난 상대들 강제 종료 처리
        const now = (Date.now() - startTime) / 1000;
        opponentStates.forEach((state, idx) => {
            if (!state.finished) {
                if (isEarlyExit) {
                    // 조기 종료 시: 고스트의 원래 기록을 결과로 반영 (시뮬레이션 스킵)
                    const record = opponentRecords[idx];
                    state.finished = true;
                    state.time = record.timeTaken;
                    state.isCorrect = record.isCorrect;
                    // 고스트 기록 자체가 제한 시간을 넘겼다면 타임아웃 처리
                    if (state.time > MAX_GAME_TIME) state.timedOut = true;
                } else {
                    // 시간 초과 종료 시: 남은 플레이어는 모두 타임아웃 처리
                    state.finished = true;
                    state.time = now;
                    state.isCorrect = false; 
                    state.timedOut = true;
                }
            }
        });

        // 내 상태 업데이트 (시간 초과 시)
        if (!myState.finished) {
            myState.finished = true;
            myState.time = now;
            myState.isCorrect = false;
            myState.timedOut = true;

            const myItem = document.getElementById('player-item-me');
            if (myItem) {
                myItem.classList.add('finished', 'incorrect');
                myItem.querySelector('.status').textContent = '시간 초과';
            }
        }

        // 고스트 기록 저장 (내가 푼 경우만)
        if (myState.finished && !myState.timedOut) {
            saveGhostRecord();
        }

        showResults();
    }

    async function saveGhostRecord() {
        try {
            await addDoc(collection(db, "ghosts"), {
                problemId: currentProblem.id,
                nickname: currentUserProfile.nickname,
                rating: currentUserProfile.rating,
                timeTaken: myState.time,
                isCorrect: myState.isCorrect,
                uid: currentUserProfile.uid, // uid 추가
                photoURL: currentUserProfile.photoURL || null, // 프로필 이미지 저장
                
                // 1차 시도 정보 저장 (아레나 데이터 호환)
                firstAttemptTime: myState.firstAttemptTime || myState.time,
                firstAttemptIsCorrect: (myState.incorrectCount === 0 && myState.isCorrect),
                
                createAt: serverTimestamp()
            });
        } catch (e) { console.error("Ghost save failed", e); }
    }

    // --- 결과 처리 ---
    async function showResults() {
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        // 1. 순위 산정
        const allPlayers = [
            { name: currentUserProfile.nickname, rating: currentUserProfile.rating, photoURL: currentUserProfile.photoURL, uid: currentUserProfile.uid, ...myState, isMe: true },
            ...opponentRecords.map((rec, idx) => ({
                name: rec.nickname, rating: rec.rating, photoURL: rec.photoURL, uid: rec.uid, ...opponentStates[idx], isMe: false
            }))
        ];

        // 정렬: 정답 우선 -> 시간 빠른 순
        allPlayers.sort((a, b) => {
            if (a.isCorrect !== b.isCorrect) return b.isCorrect ? 1 : -1;
            return a.time - b.time;
        });

        // 3. UI 렌더링
        const rankingsList = document.getElementById('final-rankings');
        rankingsList.innerHTML = '';
        
        let myRank = 0;
        allPlayers.forEach((p, idx) => {
            const rank = idx + 1;
            if (p.isMe) myRank = rank;

            const profileUrl = p.uid ? (p.isMe ? '/pages/mypage.html' : `/pages/user-profile.html?uid=${p.uid}`) : null;

            const div = document.createElement('div');
            div.className = `ranking-item ${p.isMe ? 'my-rank' : ''}`;
            div.innerHTML = `
                <div class="info-left">
                    <span class="rank-badge rank-${rank}">#${rank}</span>
                    ${profileUrl ? `<a href="${profileUrl}" style="display:flex"><img src="${p.photoURL || '/default-avatar.svg'}" class="ranking-avatar" alt="profile"></a>` : `<img src="${p.photoURL || '/default-avatar.svg'}" class="ranking-avatar" alt="profile">`}
                    <span class="name">
                        ${profileUrl 
                            ? `<a href="${profileUrl}" class="profile-link-text" style="color: inherit; text-decoration: none;">${p.name}</a>` 
                            : p.name}
                    </span>
                </div>
                <div>
                    <span class="status">${p.isCorrect ? '정답' : '오답'}</span>
                    <span class="time">(${p.time.toFixed(1)}s)</span>
                </div>
            `;
            rankingsList.appendChild(div);
        });

        document.getElementById('result-title').textContent = myRank === 1 ? "1위 달성!" : `${myRank}위`;
        
        // 2. 레이팅 계산 (Cloud Function 호출)
        const functions = getFunctions();
        const updateGrandArenaResult = httpsCallable(functions, 'updateGrandArenaResult');

        const payload = {
            myResult: { isCorrect: myState.isCorrect, time: myState.time },
            opponents: opponentRecords.map((opp, idx) => ({
                rating: opp.rating,
                isCorrect: opponentStates[idx].isCorrect,
                timeTaken: opponentStates[idx].time
            }))
        };

        // 계산 전 현재 레이팅 표시 및 로딩 상태 설정
        const finalRatingEl = document.getElementById('final-rating');
        const ratingChangeValueEl = document.getElementById('rating-change-value');
        
        finalRatingEl.textContent = currentUserProfile.rating;
        ratingChangeValueEl.textContent = "";

        try {
            const result = await updateGrandArenaResult(payload);
            const { newRating, ratingChange } = result.data;

            // 숫자 카운팅 애니메이션 및 팝핑 효과 적용
            animateValue(finalRatingEl, currentUserProfile.rating, newRating, 1000, () => {
                ratingChangeValueEl.textContent = `(${ratingChange >= 0 ? '+' : ''}${ratingChange})`;
                ratingChangeValueEl.style.color = ratingChange >= 0 ? 'green' : 'red';
                if (ratingChange >= 0) {
                    ratingChangeValueEl.classList.remove('pop-animation');
                    void ratingChangeValueEl.offsetWidth;
                    ratingChangeValueEl.classList.add('pop-animation');
                }
            });
            
            currentUserProfile.rating = newRating;
        } catch (e) { 
            console.error("Rating update failed", e); 
            ratingChangeValueEl.textContent = " (오류)";
        }
    }

    function animateValue(obj, start, end, duration, callback) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = end;
                // 애니메이션 재실행을 위해 클래스 제거 후 다시 추가
                if (end >= start) {
                    obj.classList.remove('pop-animation');
                    void obj.offsetWidth; // 리플로우 트리거
                    obj.classList.add('pop-animation');
                }
                if (callback) callback();
            }
        };
        window.requestAnimationFrame(step);
    }

    function postQuestionToQnA() {
        sessionStorage.setItem('qnaNewPostData', JSON.stringify(currentProblem));
        window.location.href = '/pages/generatequestion.html';
    }
});
import { auth, db } from '../firebase.js';
import { doc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { requireAuth } from '../auth.js';

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
    const lobbyScreen = document.getElementById('arena-lobby');
    const startMatchBtn = document.getElementById('start-match-btn');
    const lobbyStatus = document.getElementById('lobby-status');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    const cancelMatchBtn = document.getElementById('cancel-match-btn');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const playAgainBtn = document.getElementById('play-again-btn');
    const opponentInfoBar = document.getElementById('opponent-info-bar');
    const myInfoBar = document.getElementById('my-info-bar');
    const opponentNicknameSpan = document.getElementById('opponent-nickname');
    const opponentProfileImage = document.getElementById('opponent-profile-image');
    const myProfileImage = document.getElementById('my-profile-image');
    const opponentRatingSpan = document.getElementById('opponent-rating');
    const myNicknameSpan = document.getElementById('my-nickname');
    const myRatingSpan = document.getElementById('my-rating');
    const statusMessageEl = document.getElementById('status-message');
    const mainTimerDisplay = document.getElementById('main-timer-display');
    const countdownDisplay = document.getElementById('countdown-display');
    const problemTextEl = document.getElementById('problem-text');
    const choicesContainer = document.getElementById('choices-container');
    const postQnaBtn = document.getElementById('post-qna-btn');

    // --- 게임 상태 변수 ---
    let currentUserProfile;
    let currentProblem, opponentRecord;
    let allTimers = [];
    let startTime;
    let myFinalState = {};
    let opponentFinalState = {};
    let gameEnded = false;
    let opponentFirstAttemptHandled = false;
    let matchTimer = null;

    const K_FACTOR = 16; // 일반적인 K-팩터 값. 필요에 따라 조정 가능
    const RATING_SCALE = 400; // Elo 공식에 사용되는 스케일 (일반적으로 400)

    const K_FACTOR_PROBLEM = 2
    const RATING_SCALE_PROBLEM = 400

    // --- 페이지 초기화 ---
    requireAuth((user, userData) => {
        currentUserProfile = userData;
        initializeArena();
    });
    


    function initializeArena() {
        playAgainBtn.addEventListener('click', createNewMatchAndRedirect);
        postQnaBtn.addEventListener('click', postQuestionToQnA); // << 이벤트 리스너 연결
        
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
            showError("잘못된 접근입니다. 게임 로비에서 시작해주세요.");
        }
    }
    
    // ▼▼▼ 누락되었던 함수 ▼▼▼
    async function fetchMatchAndStartGame(matchId) {
        try {
            const matchData = await performMatchmaking(matchId);
            currentProblem = matchData.problem;
            opponentRecord = matchData.opponent;
            startGame();
        } catch (error) {
            showError(error.message);
        }
    }

    // ▼▼▼ 누락되었던 함수 ▼▼▼
    async function createNewMatchAndRedirect() {
        playAgainBtn.disabled = true;
        
        // 매칭 대기 상태 시각화: 결과 화면을 숨기고 로딩 화면을 표시
        resultScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        loadingScreen.classList.remove('hidden');
        loadingText.textContent = "새로운 대전 상대를 찾고 있습니다...";

        // 매칭 시뮬레이션 (1.5초 대기)
        matchTimer = setTimeout(() => {
            const newMatchId = `mock_match_${Date.now()}`;
            window.location.href = `/pages/arena.html?matchId=${newMatchId}`;
        }, 1500);
    }

    /**
    * Firestore에서 실제 데이터를 가져와 매치메이킹을 수행하는 함수
    * @param {string} matchId - (현재는 사용하지 않지만 향후 매치 기록을 위해 유지)
    * @returns {Promise<object>} - { problem, opponent } 객체를 포함하는 프로미스
    */

    async function performMatchmaking(matchId) {
        if (!currentUserProfile) throw new Error("유저 정보를 불러오지 못했습니다.");

        const userRating = currentUserProfile.rating;
        const difficultyMargin = 100; // 허용할 난이도 차이 범위

        // 1. Firestore의 'problems' 컬렉션에서 내 실력에 맞는 문제들을 쿼리합니다.
        const problemsRef = collection(db, "problems");
        const q = query(problemsRef, 
            where("difficulty", ">=", userRating - difficultyMargin),
            where("difficulty", "<=", userRating + difficultyMargin)
        );
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("내 실력에 맞는 문제를 찾을 수 없습니다.");
        }
        
        // 2. 가져온 문제들 중 하나를 무작위로 선택합니다.
        const suitableProblems = [];
        querySnapshot.forEach(doc => {
            suitableProblems.push({ id: doc.id, ...doc.data() });
        });
        const selectedProblem = suitableProblems[(Math.random() * suitableProblems.length) | 0];

        // 3. Firestore의 'ghosts' 컬렉션에서 선택된 문제를 푼 상대 기록을 쿼리합니다.
        const ghostsRef = collection(db, "ghosts");
        const qGhost = query(ghostsRef, 
            where("problemId", "==", selectedProblem.id),
            where("nickname", "!=", currentUserProfile.nickname) // 나 자신은 제외
        );

        const ghostQuerySnapshot = await getDocs(qGhost);
        let selectedGhost;

        if (ghostQuerySnapshot.empty) {
            // 4-A. 고스트가 없다면 (신규 문제), 가상의 고스트를 생성합니다.
            //console.log(`[매칭 정보] ${selectedProblem.id}번은 신규 문제입니다. 가상 고스트를 생성합니다.`);
            selectedGhost = {
                nickname: "Admin",
                rating: selectedProblem.difficulty,
                firstAttemptTime: Math.random() * 5 + 40,
                firstAttemptIsCorrect: false,
                timeTaken: Math.random() * 5 + 55,
                isCorrect: false
            };
        } else {
            // 4-B. 고스트가 존재하면, 그 중에서 한 명을 무작위로 선택합니다.
            const potentialOpponents = [];
            ghostQuerySnapshot.forEach(doc => {
                potentialOpponents.push(doc.data());
            });
            selectedGhost = potentialOpponents[(Math.random() * potentialOpponents.length) | 0];
        }
        
        // 5. 최종적으로 선택된 문제와 고스트를 반환합니다.
        return { problem: selectedProblem, opponent: selectedGhost };
    }



    // ▼▼▼ 누락되었던 함수 ▼▼▼
    function showError(message) {
        gameScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        loadingScreen.classList.remove('hidden');
        loadingText.textContent = message;
    }

    function stopAllTimers() {
        allTimers.forEach(timerId => {
            clearInterval(timerId);
            clearTimeout(timerId);
        });
        allTimers = [];
        myInfoBar.classList.remove('penalty-active');
        opponentInfoBar.classList.remove('penalty-active');
    }

    function resetGameForStart() {
        stopAllTimers();
        gameEnded = false;
        myFinalState = { turn_finished: false, incorrect_count: 0, is_correct: null, time: 0, timed_out: false };
        opponentFinalState = { turn_finished: false, is_correct: null, time: 0, timed_out: false };
        opponentFirstAttemptHandled = false;
        
        statusMessageEl.textContent = '문제를 보고 답을 선택하세요.';
        mainTimerDisplay.textContent = '0.0';
        mainTimerDisplay.classList.remove('hidden');
        countdownDisplay.classList.add('hidden');
        
        myInfoBar.className = 'player-info-bar';
        opponentInfoBar.className = 'player-info-bar';
        choicesContainer.className = 'choices-grid';
    }

    function startGame() { 
        window.addEventListener('beforeunload', preventNavigation);
        resetGameForStart();
        loadingScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        myNicknameSpan.textContent = currentUserProfile.nickname;
        myRatingSpan.textContent = `(${currentUserProfile.rating})`;
        myProfileImage.src = currentUserProfile.photoURL || '/default-avatar.svg';

        opponentNicknameSpan.textContent = opponentRecord.nickname;
        opponentRatingSpan.textContent = `(${opponentRecord.rating})`;
        opponentProfileImage.src = opponentRecord.photoURL || '/default-avatar.svg';

        problemTextEl.textContent = currentProblem.question;
        
        if (window.MathJax) {
            MathJax.typesetPromise([problemTextEl]).catch((err) => console.log('MathJax 렌더링 오류:', err));
        }
        // 1. 기존 선택지 배열을 섞기 전에, 원본이 바뀌지 않도록 복사합니다.
        const originalChoices = [...currentProblem.choices];
        
        // 2. 복사한 배열의 순서를 무작위로 섞습니다.
        const shuffledChoices = originalChoices.sort(() => Math.random() - 0.5);
        
        choicesContainer.innerHTML = '';
        shuffledChoices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.onclick = () => handleAnswer(choice, btn); 
            btn.textContent = choice;
            choicesContainer.appendChild(btn);
        });

        startTime = Date.now();
        const mainTimerId = setInterval(() => {
            if (gameEnded) return;
            const elapsedTime = (Date.now() - startTime) / 1000;
            mainTimerDisplay.textContent = elapsedTime.toFixed(1);

            if (!opponentFirstAttemptHandled && !opponentRecord.firstAttemptIsCorrect && elapsedTime >= opponentRecord.firstAttemptTime) {
                opponentFirstAttemptHandled = true;
                handleOpponentFirstMistake();
            }
            if (!opponentFinalState.turn_finished && elapsedTime >= opponentRecord.timeTaken) {
                handleOpponentFinalAction();
            }
        }, 100);
        allTimers.push(mainTimerId);
    }
    
    function handleOpponentFirstMistake() {
        if (gameEnded) return;
        opponentInfoBar.classList.add('penalty-bar', 'penalty-active');
        if (!myFinalState.turn_finished) statusMessageEl.textContent = "상대가 고민하고 있습니다...";
        
        const opponentPenaltyId = setTimeout(() => {
            opponentInfoBar.classList.remove('penalty-bar', 'penalty-active');
        }, 5000);
        allTimers.push(opponentPenaltyId);
    }

    function handleOpponentFinalAction() {
        if (gameEnded) return;
        opponentFinalState.turn_finished = true;
        opponentFinalState.is_correct = opponentRecord.isCorrect;
        opponentFinalState.time = opponentRecord.timeTaken;
        
        opponentInfoBar.className = 'player-info-bar';
        opponentInfoBar.classList.add(opponentFinalState.is_correct ? 'correct-bar' : 'incorrect-bar');

        if (myFinalState.turn_finished) {
            endGameAndShowResult();
        } else {
            const message = opponentFinalState.is_correct ? "상대가 정답을 맞혔습니다!" : "상대가 결국 틀렸습니다!";
            startEndgameCountdown(message);
        }
    }

    function handleAnswer(selectedChoice, clickedButton) {
        // 1차 오답 페널티 중이거나, 이미 턴이 끝났으면 아무것도 하지 않음
        if (gameEnded || myFinalState.turn_finished) return;

        // 서든데스 카운트다운 중의 선택은 즉시 게임 종료
        if (!document.getElementById('countdown-display').classList.contains('hidden')) {
            if(myFinalState.turn_finished) return;
            myFinalState.is_correct = (selectedChoice === currentProblem.answer);
            myFinalState.time = (Date.now() - startTime) / 1000;
            myFinalState.turn_finished = true;
            if (clickedButton) clickedButton.classList.add(myFinalState.is_correct ? 'correct-choice' : 'incorrect-choice');
            lockChoices(true);
            endGameAndShowResult();
            return;
        }

        const isCorrect = selectedChoice === currentProblem.answer;
        const attemptTime = (Date.now() - startTime) / 1000;

        if (myFinalState.incorrect_count === 0 && !myFinalState.firstAttemptTime) {
            myFinalState.firstAttemptTime = attemptTime;
        }
        
        if (isCorrect) {
            // --- 1. 정답을 맞혔을 때 ---
            myFinalState.is_correct = true;
            myFinalState.turn_finished = true; 
            if (clickedButton) clickedButton.classList.add('correct-choice');
            myInfoBar.className = 'player-info-bar correct-bar';
        } else {
            // --- 2. 오답을 선택했을 때 ---
            myFinalState.incorrect_count++;
            if (myFinalState.incorrect_count >= 2) {
                // 2-1. 두 번째 오답
                myFinalState.is_correct = false;
                myFinalState.turn_finished = true;
                if (clickedButton) clickedButton.classList.add('incorrect-choice');
                lockChoices(true, true); // 정답 표시와 함께 잠금
                myInfoBar.className = 'player-info-bar incorrect-bar';
            } else {
                // 2-2. 첫 번째 오답 (5초 페널티)
                myInfoBar.className = 'player-info-bar penalty-bar';
                if (clickedButton) {
                    clickedButton.classList.add('incorrect-choice');
                    clickedButton.dataset.permanentlyDisabled = 'true';
                }
                lockChoices(true);
                myInfoBar.classList.add('penalty-active');
                const penaltyId = setTimeout(() => {
                    lockChoices(false);
                    myInfoBar.classList.remove('penalty-active', 'penalty-bar');
                    if (clickedButton) clickedButton.classList.remove('incorrect-choice');
                }, 5000);
                allTimers.push(penaltyId);
                return; // 턴이 끝나지 않았으므로 여기서 함수 종료
            }
        }
        
        // ▼▼▼ 내가 최종 선택(정답 또는 2차 오답)을 마쳤을 때의 공통 로직 ▼▼▼
        myFinalState.time = (Date.now() - startTime) / 1000;
        lockChoices(true, myFinalState.is_correct === false); // 내가 최종 오답이면 정답도 표시

        if (opponentFinalState.turn_finished) {
            // 상대가 이미 끝나있으면 즉시 결과 판정
            endGameAndShowResult();
        } else {
            // 상대가 아직 끝나지 않았다면, 새로운 규칙 적용
            const opponentActionTime = opponentRecord.firstAttemptTime;
            
            if (myFinalState.time < opponentActionTime) {
                // Case 1-1, 2-1: 내가 상대의 첫 시도보다 먼저 끝낸 경우
                const delayInSeconds = opponentActionTime - myFinalState.time;
                startEndgameCountdown("상대의 선택을 기다립니다...");
                
                // i, ii 규칙 적용
                if (delayInSeconds < 5) {
                    // i. 차이가 5초 미만이면, 상대의 첫 시도 시간에 맞춰 게임 종료
                    const waitId = setTimeout(() => {
                        // 상대의 첫 시도를 최종 결과로 간주하고 게임 종료
                        opponentFinalState.is_correct = opponentRecord.firstAttemptIsCorrect;
                        opponentFinalState.time = opponentRecord.firstAttemptTime;
                        opponentFinalState.turn_finished = true;
                        endGameAndShowResult();
                    }, delayInSeconds * 1000);
                    allTimers.push(waitId);
                } else {
                    // ii. 차이가 5초 이상이면, 5초 카운트다운 시작하고 상대는 타임아웃 처리
                    startEndgameCountdown("상대의 선택을 기다립니다...");
                }
            } else {
                // 내가 끝냈는데, 상대가 이미 1차 시도는 한 경우 -> 5초 카운트다운 시작
                startEndgameCountdown("상대의 선택을 기다립니다...");
            }
        }
    }
    
    function startEndgameCountdown(message) {
        if (gameEnded) return;

        const mainTimerId = setInterval(() => { 
            if (gameEnded) return;
            mainTimerDisplay.textContent = ((Date.now() - startTime) / 1000).toFixed(1);
            if (!opponentFinalState.turn_finished && parseFloat(mainTimerDisplay.textContent) >= opponentRecord.timeTaken) {
                handleOpponentFinalAction();
            }
        }, 100);
        allTimers.push(mainTimerId);

        statusMessageEl.textContent = message;
        mainTimerDisplay.classList.add('hidden');
        countdownDisplay.classList.remove('hidden');

        let remaining = 5;
        countdownDisplay.textContent = remaining;
        const countdownId = setInterval(() => {
            if (gameEnded) return;
            remaining--;
            countdownDisplay.textContent = remaining;
            if (remaining < 1) {
                if (!myFinalState.turn_finished) myFinalState.timed_out = true;
                endGameAndShowResult();
            }
        }, 1000);
        allTimers.push(countdownId);
    }
    
    async function endGameAndShowResult() {
        if (gameEnded) return;
        window.removeEventListener('beforeunload', preventNavigation);
        gameEnded = true;
        stopAllTimers();

        const elapsedTime = (Date.now() - startTime) / 1000;

        // 나의 최종 상태 확정
        if (!myFinalState.turn_finished) {
            myFinalState.timed_out = true;
            myFinalState.time = elapsedTime;
            myFinalState.is_correct = false; // 타임아웃은 오답으로 간주
        }
        
        // 상대의 최종 상태 확정
        if (!opponentFinalState.turn_finished) {
            // [수정사항] 상대의 최종 시간이 현재 시간보다 늦었다면, 상대도 타임아웃 처리
            if (opponentRecord.timeTaken > elapsedTime) {
                opponentFinalState.timed_out = true;
            }
            opponentFinalState.time = opponentRecord.timeTaken;
            opponentFinalState.is_correct = opponentRecord.isCorrect;
        }

        // ▼▼▼ 고스트 기록 저장 로직 추가 ▼▼▼
        // 타임아웃이 아니고, 1차 또는 2차 시도를 완료한 경우에만 기록 저장
        if (!myFinalState.timed_out) {
            try {
                const ghostData = {
                    problemId: currentProblem.id,
                    nickname: currentUserProfile.nickname,
                    uid: currentUserProfile.uid, // uid 추가
                    rating: currentUserProfile.rating, // 대결 시작 시점의 레이팅
                    photoURL: currentUserProfile.photoURL || null, // 프로필 이미지 저장
                    
                    // 1차 시도에 성공했는지 여부
                    firstAttemptIsCorrect: ( myFinalState.time - (myFinalState.firstAttemptTime||myFinalState.time) <3) && myFinalState.is_correct,
                    

                    // 1차 시도 시간 (1차 오답 시에는 최종 시간과 다름)
                    // 이 부분은 더 정교한 로직을 위해 myFinalState에 firstAttemptTime을 기록해야 하지만,
                    // 지금은 최종 시간으로 통일하여 단순화합니다.
                    firstAttemptTime: myFinalState.firstAttemptTime || myFinalState.time, 
                    
                    timeTaken: myFinalState.time,
                    isCorrect: myFinalState.is_correct,
                    createAt: serverTimestamp()
                };
                
                // 'ghosts' 컬렉션에 새로운 문서 추가
                await addDoc(collection(db, "ghosts"), ghostData);
                //console.log("새로운 고스트 기록이 저장되었습니다:", ghostData);

            } catch (error) {
                console.error("고스트 기록 저장 중 오류 발생:", error);
            }
        }
        // ▲▲▲ 고스트 기록 저장 로직 끝 ▲▲▲



        const myResult = myFinalState.is_correct;
        // [수정사항] 상대가 타임아웃 되었는지 여부를 먼저 판단
        const opponentResult = opponentFinalState.timed_out ? false : opponentFinalState.is_correct;

        let resultText;
        if (myResult && opponentResult) {
            resultText = myFinalState.time < opponentFinalState.time ? '승리!' : '패배!';
        } else if (myResult && !opponentResult) {
            resultText = '승리!';
        } else if (!myResult && opponentResult) {
            resultText = '패배!';
        } else { // 둘 다 실패 (오답 또는 타임아웃)
            resultText = '무승부';
        }
        showResult(resultText);
    }

    async function showResult(resultText) {
        resultScreen.classList.remove('hidden');

        let myResultStatus, opponentResultStatus;
        let myDisplayTimeText, myStatusText;
        let opponentDisplayTimeText, opponentStatusText;

        // --- 결과 데이터 가공 ---
        if (opponentRecord.firstAttemptTime > myFinalState.time) {
            myResultStatus = myFinalState.timed_out ? 'timeout' : (myFinalState.is_correct ? 'win' : 'error');
            opponentResultStatus = opponentFinalState.timed_out ? 'timeout' : (opponentRecord.firstAttemptIsCorrect ? 'win' : 'error');
            
            myDisplayTimeText = myFinalState.timed_out ? '' : `(${myFinalState.time.toFixed(1)}초)`;
            myStatusText = myFinalState.timed_out ? '시간 초과' : (myFinalState.is_correct ? '정답' : '오답');
            
            opponentDisplayTimeText = opponentFinalState.timed_out ? '' : `(${opponentFinalState.time.toFixed(1)}초)`;
            opponentStatusText = opponentFinalState.timed_out ? '시간 초과' : (opponentRecord.firstAttemptIsCorrect ? '정답' : '오답');

        } else {
            myResultStatus = myFinalState.timed_out ? 'timeout' : (myFinalState.is_correct ? 'win' : 'error');
            opponentResultStatus = opponentFinalState.timed_out ? 'timeout' : (opponentRecord.isCorrect ? 'win' : 'error');
            
            myDisplayTimeText = myFinalState.timed_out ? '' : `(${myFinalState.time.toFixed(1)}초)`;
            myStatusText = myFinalState.timed_out ? '시간 초과' : (myFinalState.is_correct ? '정답' : '오답');
            
            opponentDisplayTimeText = opponentFinalState.timed_out ? '' : `(${opponentFinalState.time.toFixed(1)}초)`;
            opponentStatusText = opponentFinalState.timed_out ? '시간 초과' : (opponentRecord.isCorrect ? '정답' : '오답');

        }

        // --- DOM 요소에 데이터 채우기 ---
        const myNicknameEl = document.getElementById('my-nickname-result');
        const opponentNicknameEl = document.getElementById('opponent-nickname-result');
        const myProfileImageResult = document.getElementById('my-profile-image-result');
        const opponentProfileImageResult = document.getElementById('opponent-profile-image-result');

        myProfileImageResult.src = currentUserProfile.photoURL || '/default-avatar.svg';
        myNicknameEl.textContent = currentUserProfile.nickname;
        document.getElementById('my-rating-result').textContent = `(${currentUserProfile.rating})`;
        document.getElementById('my-final-status').textContent = `${myStatusText} ${myDisplayTimeText}`;
        
        opponentProfileImageResult.src = opponentRecord.photoURL || '/default-avatar.svg';
        opponentNicknameEl.textContent = opponentRecord.nickname;
        document.getElementById('opponent-rating-result').textContent = `(${opponentRecord.rating})`;
        document.getElementById('opponent-final-status').textContent = `${opponentStatusText} ${opponentDisplayTimeText}`;
        
        document.getElementById('result-title').textContent = resultText;
        
        // 닉네임 클릭 시 프로필 이동 이벤트 추가
        if (currentUserProfile.uid) {
            const myPageUrl = '/pages/mypage.html';
            myNicknameEl.style.cursor = 'pointer';
            myNicknameEl.onclick = () => window.location.href = myPageUrl;
            myProfileImageResult.style.cursor = 'pointer';
            myProfileImageResult.onclick = () => window.location.href = myPageUrl;
        }
        if (opponentRecord.uid) {
            const userProfileUrl = `/pages/user-profile.html?uid=${opponentRecord.uid}`;
            opponentNicknameEl.style.cursor = 'pointer';
            opponentNicknameEl.onclick = () => window.location.href = userProfileUrl;
            opponentProfileImageResult.style.cursor = 'pointer';
            opponentProfileImageResult.onclick = () => window.location.href = userProfileUrl;
        }

        // --- 닉네임 색상 변경 로직 ---
        myNicknameEl.className = 'result-nickname'; // 초기화
        opponentNicknameEl.className = 'result-nickname'; // 초기화

        if (resultText === '승리!') {
            myNicknameEl.classList.add('win');
            opponentNicknameEl.classList.add(opponentResultStatus === 'error' ? 'loss-error' : 'loss-timeout');
        } else if (resultText === '패배!') {
            opponentNicknameEl.classList.add('win');
            myNicknameEl.classList.add(myResultStatus === 'error' ? 'loss-error' : 'loss-timeout');
        } else { // 무승부
            myNicknameEl.classList.add('draw');
            opponentNicknameEl.classList.add('draw');
        }
        
        // ▼▼▼ Cloud Function 호출로 변경 ▼▼▼
        const functions = getFunctions();
        const updateArenaResult = httpsCallable(functions, 'updateArenaResult');

        const payload = {
            myResult: { isCorrect: myFinalState.is_correct, time: myFinalState.time },
            opponentResult: { 
                isCorrect: opponentRecord.isCorrect, // 고스트의 정답 여부
                time: opponentRecord.timeTaken,      // 고스트의 소요 시간
                rating: opponentRecord.rating        // 고스트의 레이팅
            },
            problemId: currentProblem.id,
            problemDifficulty: currentProblem.difficulty
        };

        // 계산 전 현재 레이팅 표시 및 로딩 상태 설정
        const finalRatingEl = document.getElementById('final-rating');
        const ratingChangeValueEl = document.getElementById('rating-change-value');
        
        finalRatingEl.textContent = currentUserProfile.rating;
        ratingChangeValueEl.textContent = "";

        try {
            const result = await updateArenaResult(payload);
            const { newRating, ratingChange, winStreak } = result.data;

            // 숫자 카운팅 애니메이션 및 팝핑 효과 적용
            animateValue(finalRatingEl, currentUserProfile.rating, newRating, 1000, () => {
                ratingChangeValueEl.textContent = `(${ratingChange >= 0 ? '+' : ''}${ratingChange})`;
                ratingChangeValueEl.style.color = ratingChange > 0 ? 'green' : (ratingChange < 0 ? 'red' : 'gray');
                if (ratingChange >= 0) {
                    ratingChangeValueEl.classList.remove('pop-animation');
                    void ratingChangeValueEl.offsetWidth;
                    ratingChangeValueEl.classList.add('pop-animation');
                }
            });

            // 5연승 이상일 때 메시지 표시
            if (winStreak >= 5) {
                const ratingBox = document.querySelector('.rating-change-box');
                const streakMsg = document.createElement('p');
                streakMsg.className = 'pop-animation';
                streakMsg.style.color = '#e67e22'; // 불꽃 색상
                streakMsg.style.fontWeight = 'bold';
                streakMsg.innerHTML = `🔥 ${winStreak}연승 달성! (+5점)`;
                ratingBox.appendChild(streakMsg);
            }

            // 현재 로드된 사용자 프로필도 업데이트하여 다음 게임에 반영되도록 합니다.
            currentUserProfile.rating = newRating;

        } catch (error) {
            console.error("Firebase Firestore 레이팅 업데이트 중 오류 발생:", error);
            ratingChangeValueEl.textContent = " (오류)";
        }
        // --- Firestore 업데이트 로직 끝 ---



        const postQnaBtn = document.getElementById('post-qna-btn');
        if (postQnaBtn) {
            // 먼저 기본 스타일(tertiary)로 리셋
            postQnaBtn.className = 'btn-tertiary';

            // 만약 결과가 '승리!'가 아니라면 (패배 또는 무승부),
            // 버튼을 눈에 띄는 primary 스타일로 변경
            if (resultText !== '승리!') {
                postQnaBtn.className = 'btn-green';
            }
        }
    
    }

    function postQuestionToQnA() {
        if (currentProblem) {
            // sessionStorage는 브라우저 탭이 닫히기 전까지 데이터를 임시 저장합니다.
            // 복잡한 객체는 JSON 문자열로 변환하여 저장합니다.
            sessionStorage.setItem('qnaNewPostData', JSON.stringify(currentProblem));
            
            // 질문 작성 페이지의 URL로 이동합니다. (URL은 실제 경로에 맞게 수정 필요)
            window.location.href = '/pages/generatequestion.html'; 
        } else {
            alert("질문할 문제 정보가 없습니다.");
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

    function lockChoices(isLocked, showCorrect = false) {
        document.querySelectorAll('.choice-btn').forEach(btn => {
            // '영구 비활성화' 표식이 없는 버튼만 다시 활성화
            if (!isLocked && btn.dataset.permanentlyDisabled !== 'true') {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
            // 2차 오답 시 정답 버튼에 correct-choice 클래스 추가
            if (showCorrect && btn.textContent === currentProblem.answer) {
                btn.classList.add('correct-choice');
            }
        });
        choicesContainer.classList.toggle('choices-locked', isLocked);
    }

});

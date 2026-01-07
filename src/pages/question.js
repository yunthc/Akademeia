import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, runTransaction, increment, deleteDoc, updateDoc, FieldValue } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import '../auth.js';

let currentUser = null;
let currentUserProfile = null;

/**
 * 텍스트 내의 @멘션을 스타일링된 HTML로 변환합니다.
 * @param {string} text - 처리할 원본 텍스트
 * @returns {string} - HTML이 적용된 텍스트
 */
function processMentions(text) {
    if (!text) return '';
    // @로 시작하고, 뒤에 영문, 숫자, 밑줄(_)이 오는 경우를 찾습니다.
    const mentionRegex = /@([\w_]+)/g;
    // 현재는 다른 유저의 프로필 페이지가 없으므로, 스타일만 적용합니다.
    return text.replace(mentionRegex, '<span class="mention">@$1</span>');
}

onAuthStateChanged(auth, async (user) => {
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('id');
    if (!questionId) {
        document.getElementById('loader').textContent = '오류: 질문 ID가 올바르지 않습니다.';
        return;
    }
    currentUser = user;
    if (user) {
        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        if (userDocSnap.exists()) {
            currentUserProfile = { uid: user.uid, ...userDocSnap.data() };
        }
    }
    initializeQuestionPage(questionId);
});

async function toggleLike(docRef, buttonEl) {
    if (!currentUser) {
        alert('좋아요를 누르려면 로그인이 필요합니다.');
        return;
    }
    if (buttonEl.disabled) return;
    buttonEl.disabled = true;

    const likeRef = doc(docRef, 'likes', currentUser.uid);

    try {
        await runTransaction(db, async (transaction) => {
            const likeDoc = await transaction.get(likeRef);
            if (likeDoc.exists()) {
                transaction.delete(likeRef);
                transaction.update(docRef, { likeCount: increment(-1) });
            } else {
                transaction.set(likeRef, { createdAt: serverTimestamp() });
                transaction.update(docRef, { likeCount: increment(1) });
            }
        });
        // 트랜잭션 성공 후 UI 즉시 업데이트
        const isLikedAfterToggle = buttonEl.classList.toggle('liked');
        const countEl = buttonEl.querySelector('.count');
        const iconEl = buttonEl.querySelector('.icon');
        const currentCount = parseInt(countEl.textContent, 10);

        if (isLikedAfterToggle) {
            countEl.textContent = currentCount + 1;
            if (iconEl) iconEl.textContent = '♥';
        } else {
            countEl.textContent = currentCount - 1;
            if (iconEl) iconEl.textContent = '♡';
        }
    } catch (error) {
        console.error("Like toggle error:", error);
        alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
        buttonEl.disabled = false;
    }
}

async function initializeQuestionPage(questionId) {
    const loader = document.getElementById('loader');
    const questionContentDiv = document.getElementById('question-content');
    try {
        const questionDocRef = doc(db, "questions", questionId);
        const questionDocSnap = await getDoc(questionDocRef);
        if (questionDocSnap.exists()) {
            const questionData = questionDocSnap.data();
            displayQuestionData(questionData);

            // 채택된 답변 또는 답글 표시 로직
            if (questionData.isSolved === true) {
                if (questionData.acceptedReplyId && questionData.acceptedAnswerId) {
                    displayAcceptedReply(questionId, questionData.acceptedAnswerId, questionData.acceptedReplyId);
                } else if (questionData.acceptedAnswerId) {
                    displayAcceptedAnswer(questionId, questionData.acceptedAnswerId);
                }
            }

            if (currentUser) {
                document.getElementById('answer-form').classList.remove('hidden');
                initializeAnswerFeature(questionId);
            }
            if (currentUser && currentUser.uid === questionData.authorId) {
                document.getElementById('author-controls').classList.remove('hidden');
                initializeAuthorControls(questionId, questionData);
            }

            // ▼▼▼ 추가: 질문 좋아요 버튼 설정 ▼▼▼
            const likeBtn = document.getElementById('question-like-btn');
            likeBtn.dataset.path = questionDocRef.path;
            likeBtn.querySelector('.count').textContent = questionData.likeCount || 0;
            if (currentUser) {
                const likeRef = doc(questionDocRef, 'likes', currentUser.uid);
                getDoc(likeRef).then(docSnap => {
                    if (docSnap.exists()) {
                        likeBtn.classList.add('liked');
                        likeBtn.querySelector('.icon').textContent = '♥';
                    }
                });
            }
            likeBtn.addEventListener('click', () => {
                toggleLike(questionDocRef, likeBtn);
            });
            // ▲▲▲▲▲▲

            initializeAnswerSection(questionId, questionData); // 답변 및 답글 기능 초기화
            loader.classList.add('hidden');
            questionContentDiv.classList.remove('hidden');
        } else {
            loader.textContent = '해당 질문을 찾을 수 없습니다.';
        }
    } catch (error) {
        console.error("질문 데이터를 불러오는 중 오류 발생:", error);
        loader.textContent = '질문을 불러오는 중 오류가 발생했습니다.';
    }
}

async function displayAcceptedAnswer(questionId, answerId) {
    const acceptedAnswerContainer = document.getElementById('accepted-answer-container');
    const answerDocRef = doc(db, "questions", questionId, "answers", answerId);
    const answerDocSnap = await getDoc(answerDocRef);

    if (answerDocSnap.exists()) {
        const answerData = answerDocSnap.data();
        const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34495e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 5.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>`)}`;
        acceptedAnswerContainer.innerHTML = `
            <div class="accepted-badge">채택된 답변</div>
            <div class="answer-item">
                <div class="answer-header">
                    <div class="answer-author-profile">
                        <img src="${answerData.authorPhotoUrl || defaultAvatar}" alt="${answerData.authorName}" class="answer-avatar">
                        <span class="name">${answerData.authorName}</span>
                        <span class="rating">(${answerData.authorRating})</span>
                        <span class="timestamp">${answerData.createdAt?.toDate().toLocaleString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) || '방금 전'}</span>
                    </div>
                    <div class="answer-actions">
                        <span class="static-like-display">♡ ${answerData.likeCount || 0}</span>
                    </div>
                </div>
                <p class="answer-content">${processMentions(answerData.content)}</p>
            </div>
        `;
        acceptedAnswerContainer.classList.remove('hidden');
    }
}

async function displayAcceptedReply(questionId, answerId, replyId) {
    const acceptedAnswerContainer = document.getElementById('accepted-answer-container');
    const replyDocRef = doc(db, "questions", questionId, "answers", answerId, "replies", replyId);
    const replyDocSnap = await getDoc(replyDocRef);

    if (replyDocSnap.exists()) {
        const replyData = replyDocSnap.data();
        const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34495e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 5.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>`)}`;
        // 답글을 채택된 답변과 동일한 스타일로 표시
        acceptedAnswerContainer.innerHTML = `
            <div class="accepted-badge">채택된 답변</div>
            <div class="answer-item" style="border-top: none; padding-top: 0;">
                <div class="answer-header">
                    <div class="answer-author-profile">
                        <img src="${replyData.authorPhotoUrl || defaultAvatar}" alt="${replyData.authorName}" class="answer-avatar">
                        <span class="name">${replyData.authorName}</span>
                        <span class="rating">(${replyData.authorRating || 'N/A'})</span>
                        <span class="timestamp">${replyData.createdAt?.toDate().toLocaleString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) || '방금 전'}</span>
                    </div>
                    <div class="answer-actions">
                        <span class="static-like-display">♡ ${replyData.likeCount || 0}</span>
                    </div>
                </div>
                <p class="answer-content">${processMentions(replyData.content)}</p>
            </div>
        `;
        acceptedAnswerContainer.classList.remove('hidden');
    }
}

// ▼▼▼ 수정: 질문 작성자 정보 표시 로직 변경 ▼▼▼
function displayQuestionData(questionData) {
    document.title = `Akademeia: ${questionData.title}`;
    document.getElementById('question-title').textContent = questionData.title;

    const authorProfileDiv = document.getElementById('question-author-profile');
    const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34495e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 5.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>`)}`;
    authorProfileDiv.innerHTML = `
        <img src="${questionData.authorPhotoUrl || defaultAvatar}" alt="${questionData.authorName}">
        <span class="name">${questionData.authorName}</span>
        <span class="rating">(${questionData.authorRating})</span>
        <span class="timestamp">· ${questionData.createdAt.toDate().toLocaleString('ko-KR', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
        })}</span>
    `;

    // 수식 렌더링을 위해 innerHTML 사용
    document.getElementById('question-text-content').innerHTML = processMentions(questionData.content);

    // 이미지 처리
    const imgElement = document.getElementById('question-image');
    if (questionData.imageUrl) {
        imgElement.src = questionData.imageUrl;
        imgElement.classList.remove('hidden');
    } else {
        imgElement.classList.add('hidden');
    }

    // MathJax 수식 렌더링
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}
// ▲▲▲▲▲▲

function initializeAnswerFeature(questionId) {
    const answerForm = document.getElementById('answer-form');
    const answerContentInput = document.getElementById('answer-content');
    answerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!currentUserProfile) {
            alert('답변을 등록하려면 사용자 정보가 필요합니다. 페이지를 새로고침 해주세요.');
            return;
        }
        const content = answerContentInput.value.trim();
        if (!content) return alert('답변 내용을 입력해주세요.');
        try {
            const answersColRef = collection(db, 'questions', questionId, 'answers');
            // ▼▼▼ 수정: 답변자 정보를 더 풍부하게 저장 ▼▼▼
            await addDoc(answersColRef, {
                content: content,
                authorId: currentUserProfile.uid,
                authorName: currentUserProfile.nickname,
                authorPhotoUrl: currentUserProfile.photoURL || null,
                authorRating: currentUserProfile.rating,
                createdAt: serverTimestamp(),
                likeCount: 0,
                isAccepted: false,
            });

            // 질문 문서의 answerCount 증가
            await updateDoc(doc(db, 'questions', questionId), {
                answerCount: increment(1)
            });
            // ▲▲▲▲▲▲
            answerForm.reset();
        } catch (error) {
            console.error('답변 등록 오류:', error);
            alert('답변 등록에 실패했습니다.');
        }
    });
}

/**
 * 답변 및 답글과 관련된 모든 UI 이벤트 리스너를 설정하고,
 * 실시간 데이터 수신을 시작합니다.
 * @param {string} questionId - 현재 질문의 ID
 * @param {object} questionData - 현재 질문의 데이터
 */
function initializeAnswerSection(questionId, questionData) {
    const answersListDiv = document.getElementById('answers-list');

    // 이벤트 위임을 사용하여 답변 목록 전체에 대한 이벤트 처리
    answersListDiv.addEventListener('click', (e) => {
        // ▼▼▼ 추가: 좋아요 버튼 클릭 처리 ▼▼▼
        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
            e.preventDefault();
            const path = likeBtn.dataset.path;
            if (path) {
                const docRef = doc(db, path);
                toggleLike(docRef, likeBtn);
            }
            return; // 다른 핸들러와 충돌 방지
        }
        // ▲▲▲▲▲▲

        // "답글" 버튼 클릭 시 폼 토글
        if (e.target.matches('.toggle-reply-form-btn')) {
            const answerId = e.target.dataset.answerId;
            const replyForm = document.getElementById(`reply-form-for-${answerId}`);
            if (replyForm) {
                replyForm.classList.toggle('hidden');
                if (!replyForm.classList.contains('hidden')) {
                    replyForm.querySelector('textarea').focus();
                }
            }
        }
        // 채택 버튼 클릭
        else if (e.target.matches('.accept-answer-btn')) {
            handleAcceptAnswer(questionId, e.target.dataset.answerId, e.target.dataset.answerAuthorId);
        }
        // 답글 채택 버튼 클릭
        else if (e.target.matches('.accept-reply-btn')) {
            const { questionId, answerId, replyId, replyAuthorId } = e.target.dataset;
            handleAcceptReply(questionId, answerId, replyId, replyAuthorId);
        }
        // 답변 삭제 버튼 클릭
        else if (e.target.matches('.delete-answer-btn')) {
            handleDeleteAnswer(questionId, e.target.dataset.answerId);
        }
        // 답글 삭제 버튼 클릭
        else if (e.target.matches('.delete-reply-btn')) {
            const { questionId, answerId, replyId } = e.target.dataset;
            handleDeleteReply(questionId, answerId, replyId);
        }
    });

    // 답글 폼 제출 이벤트 처리
    answersListDiv.addEventListener('submit', async (e) => {
        if (e.target.matches('.reply-form')) {
            e.preventDefault();
            if (!currentUserProfile) return alert('답글을 작성하려면 로그인이 필요합니다.');

            const answerId = e.target.dataset.answerId;
            const textarea = e.target.querySelector('textarea');
            const content = textarea.value.trim();
            if (!content) return alert('답글 내용을 입력해주세요.');

            const submitBtn = e.target.querySelector('button');
            submitBtn.disabled = true;

            try {
                const repliesColRef = collection(db, 'questions', questionId, 'answers', answerId, 'replies');
                await addDoc(repliesColRef, {
                    content: content,
                    authorId: currentUserProfile.uid,
                    authorName: currentUserProfile.nickname,
                    authorPhotoUrl: currentUserProfile.photoURL || null,
                    authorRating: currentUserProfile.rating,
                    likeCount: 0,
                    createdAt: serverTimestamp(),
                });
                await updateDoc(doc(db, 'questions', questionId), {
                    answerCount: increment(1)
                });
                textarea.value = '';
                e.target.classList.add('hidden'); // 등록 후 폼 숨기기
            } catch (error) {
                console.error('답글 등록 오류:', error);
                alert('답글 등록에 실패했습니다.');
            } finally {
                submitBtn.disabled = false;
            }
        }
    });

    // 답변 목록 실시간 수신 시작
    listenForAnswers(questionId, questionData);
}

/**
 * Firestore에서 답변 목록을 실시간으로 가져와 화면에 렌더링합니다.
 * @param {string} questionId - 현재 질문의 ID
 * @param {object} questionData - 현재 질문의 데이터
 */
function listenForAnswers(questionId, questionData) {
    const answersListDiv = document.getElementById('answers-list');
    const answerCountSpan = document.getElementById('answer-count');
    const answersColRef = collection(db, 'questions', questionId, 'answers');
    const q = query(answersColRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (snapshot) => {
        answersListDiv.innerHTML = ''; // 기존 목록 초기화
        answerCountSpan.textContent = snapshot.size;

        if (snapshot.empty) {
            answersListDiv.innerHTML = '<p>아직 등록된 답변이 없습니다.</p>';
            return;
        }

        snapshot.forEach(answerDoc => {
            const answerData = answerDoc.data();
            const answerId = answerDoc.id;
            const answerEl = document.createElement('div');
            answerEl.className = 'answer-item';

            const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34495e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 5.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>`)}`;
            const formattedDate = answerData.createdAt?.toDate().toLocaleString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) || '방금 전';

            const isQuestionAuthor = currentUser && currentUser.uid === questionData.authorId;
            const isMyAnswer = currentUser && currentUser.uid === answerData.authorId;
            const isSolved = questionData.isSolved === true;

            const acceptBtnHTML = (isQuestionAuthor && !isMyAnswer && !isSolved) ? `<button class="accept-answer-btn btn-small" data-answer-id="${answerId}" data-answer-author-id="${answerData.authorId}">채택</button>` : '';
            const deleteBtnHTML = (isMyAnswer && !answerData.isAccepted) ? `<button class="action-link-danger delete-answer-btn" data-answer-id="${answerId}">삭제</button>` : '';
            const replyBtnHTML = currentUser ? `<button class="toggle-reply-form-btn" data-answer-id="${answerId}">답글</button>` : '';
            const likeBtnHTML = `
                <button class="like-btn" data-path="questions/${questionId}/answers/${answerId}">
                    <span class="icon">♡</span>
                    <span class="count">${answerData.likeCount || 0}</span>
                </button>
            `;

            answerEl.innerHTML = `
                <div class="answer-content-wrapper ${answerData.isAccepted ? 'accepted' : ''}">
                    <div class="answer-header">
                        <div class="answer-author-profile">
                            <img src="${answerData.authorPhotoUrl || defaultAvatar}" alt="${answerData.authorName}" class="answer-avatar">
                            <span class="name">${answerData.authorName}</span>
                            <span class="rating">(${answerData.authorRating})</span>
                            <span class="timestamp">${formattedDate}</span>
                            ${deleteBtnHTML}
                        </div>
                        <div class="answer-actions">${acceptBtnHTML}${likeBtnHTML}</div>
                    </div>
                    <p class="answer-content">${processMentions(answerData.content)}</p>
                    <div class="answer-footer">${replyBtnHTML}</div>
                </div>
                <div class="replies-container" id="replies-for-${answerId}"></div>
                ${currentUser ? `
                <form class="reply-form hidden" id="reply-form-for-${answerId}" data-answer-id="${answerId}">
                    <textarea rows="1" placeholder="답글을 입력하세요..." required></textarea>
                    <button type="submit">등록</button>
                </form>` : ''}
            `;
            answersListDiv.appendChild(answerEl);

            if (currentUser) {
                const likeBtn = answerEl.querySelector('.like-btn');
                const answerRef = doc(db, 'questions', questionId, 'answers', answerId);
                const likeRef = doc(answerRef, 'likes', currentUser.uid);
                getDoc(likeRef).then(docSnap => {
                    if (docSnap.exists()) {
                        likeBtn.classList.add('liked');
                        likeBtn.querySelector('.icon').textContent = '♥';
                    }
                });
            }

            // 해당 답변의 답글 목록 실시간 수신 시작
            listenForReplies(questionId, answerId, questionData);
        });

        // 답변 목록이 렌더링된 후 MathJax를 실행하여 수식을 변환합니다.
        if (window.MathJax) {
            MathJax.typesetPromise([answersListDiv]).catch(err => console.error("MathJax typesetting error in answers:", err));
        }
    });
}

/**
 * 특정 답변에 대한 답글 목록을 실시간으로 가져와 렌더링합니다.
 * @param {string} questionId - 현재 질문의 ID
 * @param {string} answerId - 부모 답변의 ID
 */
function listenForReplies(questionId, answerId, questionData) {
    const repliesContainer = document.getElementById(`replies-for-${answerId}`);
    if (!repliesContainer) return;

    const repliesRef = collection(db, 'questions', questionId, 'answers', answerId, 'replies');
    const q = query(repliesRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (snapshot) => {
        repliesContainer.innerHTML = '';
        if (snapshot.empty) return;

        snapshot.forEach(replyDoc => {
            const replyData = replyDoc.data();
            const replyId = replyDoc.id;
            const replyEl = document.createElement('div');
            replyEl.className = `reply-item ${replyData.isAccepted ? 'accepted' : ''}`; // Add accepted class here

            const isQuestionAuthor = currentUser && currentUser.uid === questionData.authorId;
            const isSolved = questionData.isSolved === true;
            const isMyReply = currentUser && currentUser.uid === replyData.authorId;

            const acceptBtnHTML = (isQuestionAuthor && !isMyReply && !isSolved) ? `<button class="accept-reply-btn btn-small" data-question-id="${questionId}" data-answer-id="${answerId}" data-reply-id="${replyId}" data-reply-author-id="${replyData.authorId}">채택</button>` : '';
            const deleteBtnHTML = (isMyReply && !replyData.isAccepted) ? `<button class="action-link-danger delete-reply-btn" data-question-id="${questionId}" data-answer-id="${answerId}" data-reply-id="${replyId}">삭제</button>` : '';
            const likeBtnHTML = `
                <button class="like-btn" data-path="questions/${questionId}/answers/${answerId}/replies/${replyId}">
                    <span class="icon">♡</span>
                    <span class="count">${replyData.likeCount || 0}</span>
                </button>
            `;

            const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34495e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 5.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>`)}`;
            const formattedDate = replyData.createdAt?.toDate().toLocaleString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) || '방금 전';

            replyEl.innerHTML = `
                <img src="${replyData.authorPhotoUrl || defaultAvatar}" alt="${replyData.authorName}" class="reply-avatar">
                <div class="reply-body">
                    <div class="reply-header">
                        <div class="reply-author-info">
                            <span class="name">${replyData.authorName}</span>
                            <span class="rating">(${replyData.authorRating || 'N/A'})</span>
                            <span class="timestamp">${formattedDate}</span>
                            ${deleteBtnHTML}
                        </div>
                        <div class="reply-actions">
                            ${acceptBtnHTML}
                            ${likeBtnHTML}
                        </div>
                    </div>
                    <p class="reply-content">${processMentions(replyData.content)}</p>
                </div>
            `;
            repliesContainer.appendChild(replyEl);

            if (currentUser) {
                const likeBtn = replyEl.querySelector('.like-btn');
                const replyRef = doc(db, 'questions', questionId, 'answers', answerId, 'replies', replyId);
                const likeRef = doc(replyRef, 'likes', currentUser.uid);
                getDoc(likeRef).then(docSnap => {
                    if (docSnap.exists()) {
                        likeBtn.classList.add('liked');
                        likeBtn.querySelector('.icon').textContent = '♥';
                    }
                });
            }
        });

        // 답글 목록이 렌더링된 후 MathJax를 실행하여 수식을 변환합니다.
        if (window.MathJax) {
            MathJax.typesetPromise([repliesContainer]).catch(err => console.error("MathJax typesetting error in replies:", err));
        }
    });
}

function initializeAuthorControls(questionId, questionData) {
    const deleteBtn = document.getElementById('delete-question-btn');
    const editBtn = document.getElementById('edit-question-btn');
    editBtn.addEventListener('click', () => {
        window.location.href = `/pages/generatequestion.html?edit=${questionId}`;
    });
    deleteBtn.addEventListener('click', async () => {
        if (!confirm('정말로 이 질문을 삭제하시겠습니까?')) return;
        try {
            if (questionData.imageUrl) {
                const storage = getStorage();
                const imageRef = ref(storage, questionData.imageUrl);
                await deleteObject(imageRef);
            }
            await deleteDoc(doc(db, "questions", questionId));
            alert('질문이 삭제되었습니다.');
            window.location.href = '/pages/qna.html';
        } catch (error) { console.error('질문 삭제 오류:', error); alert('질문 삭제에 실패했습니다.'); }
    });
}

async function handleAcceptAnswer(questionId, answerId, answerAuthorId) {
    if (!confirm('이 답변을 채택하시겠습니까? 채택 후에는 변경할 수 없습니다.')) return;

    const questionRef = doc(db, 'questions', questionId);
    const answerRef = doc(db, 'questions', questionId, 'answers', answerId);
    const questionAuthorRef = doc(db, 'users', auth.currentUser.uid);
    const answerAuthorRef = doc(db, 'users', answerAuthorId);

    try {
        await runTransaction(db, async (transaction) => {
            const questionDoc = await transaction.get(questionRef);
            if (questionDoc.data().isSolved) throw new Error("이미 해결된 질문입니다.");

            const questionAuthorDoc = await transaction.get(questionAuthorRef);
            const answerAuthorDoc = await transaction.get(answerAuthorRef);
            if (!questionAuthorDoc.exists() || !answerAuthorDoc.exists()) {
                throw new Error("프로필이 존재하지 않는 사용자가 있어 마일리지를 지급할 수 없습니다.");
            }
            
            // ▼▼▼ 수정: 질문 문서에도 isSolved와 acceptedAnswerId를 확실히 기록 ▼▼▼
            transaction.update(questionRef, { isSolved: true, acceptedAnswerId: answerId });
            transaction.update(answerRef, { isAccepted: true });
            // [보안 문제 해결] 클라이언트에서 타인의 마일리지를 수정하면 권한 오류가 발생합니다.
            // 마일리지 지급은 Cloud Functions(서버)로 구현해야 합니다. 우선 주석 처리합니다.
            transaction.update(questionAuthorRef, { mileage: increment(5) });
            transaction.update(answerAuthorRef, { mileage: increment(10) });
        });
        alert('답변이 채택되었습니다!');
        window.location.reload(); // 페이지를 새로고침하여 채택 상태를 즉시 반영합니다.
    } catch (e) {
        console.error("채택 처리 중 오류:", e);
        alert(`오류가 발생했습니다: ${e.message}`);
    }
}

async function handleAcceptReply(questionId, answerId, replyId, replyAuthorId) {
    if (!confirm('이 답글을 채택하시겠습니까? 채택 후에는 변경할 수 없습니다.')) return;

    const questionRef = doc(db, 'questions', questionId);
    const replyRef = doc(db, 'questions', questionId, 'answers', answerId, 'replies', replyId);
    const questionAuthorRef = doc(db, 'users', auth.currentUser.uid);
    const replyAuthorRef = doc(db, 'users', replyAuthorId);

    try {
        await runTransaction(db, async (transaction) => {
            const questionDoc = await transaction.get(questionRef);
            if (questionDoc.data().isSolved) throw new Error("이미 해결된 질문입니다.");

            // 질문 문서 업데이트: isSolved, acceptedAnswerId(부모), acceptedReplyId(자신)
            transaction.update(questionRef, { 
                isSolved: true, 
                acceptedAnswerId: answerId,
                acceptedReplyId: replyId 
            });
            // 답글 문서 업데이트
            transaction.update(replyRef, { isAccepted: true });
            
            // 마일리지 지급 (서버에서 처리하는 것이 안전)
            // transaction.update(questionAuthorRef, { mileage: increment(5) });
            // transaction.update(replyAuthorRef, { mileage: increment(10) });
        });
        alert('답글이 채택되었습니다!');
        window.location.reload();
    } catch (e) { console.error("답글 채택 처리 중 오류:", e); alert(`오류가 발생했습니다: ${e.message}`); }
}

// src/pages/question.js 맨 아래에 추가

async function handleDeleteAnswer(questionId, answerId) {
    if (!confirm('정말로 이 답변을 삭제하시겠습니까?')) return;

    try {
        // 1. 답변 문서 삭제
        await deleteDoc(doc(db, 'questions', questionId, 'answers', answerId));

        // 2. 질문 문서의 answerCount 1 감소 (increment(-1) 사용)
        await updateDoc(doc(db, 'questions', questionId), {
            answerCount: increment(-1)
        });

        alert('답변이 삭제되었습니다.');
        // onSnapshot 덕분에 화면은 자동으로 갱신됩니다.
        
    } catch (error) {
        console.error("답변 삭제 오류:", error);
        alert("답변을 삭제하는 중 오류가 발생했습니다.");
    }
}

async function handleDeleteReply(questionId, answerId, replyId) {
    if (!confirm('정말로 이 답글을 삭제하시겠습니까?')) return;

    try {
        const replyRef = doc(db, 'questions', questionId, 'answers', answerId, 'replies', replyId);
        await deleteDoc(replyRef);
        await updateDoc(doc(db, 'questions', questionId), {
            answerCount: increment(-1)
        });
        // onSnapshot이 UI 업데이트를 처리합니다.
    } catch (error) {
        console.error("답글 삭제 오류:", error);
        alert("답글을 삭제하는 중 오류가 발생했습니다.");
    }
}
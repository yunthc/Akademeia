import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, runTransaction, increment, deleteDoc, updateDoc, FieldValue } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import '../auth.js';

let currentUser = null;
let currentUserProfile = null;



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
            currentUserProfile = userDocSnap.data();
        }
    }
    initializeQuestionPage(questionId);
});

async function initializeQuestionPage(questionId) {
    const loader = document.getElementById('loader');
    const questionContentDiv = document.getElementById('question-content');
    try {
        const questionDocRef = doc(db, "questions", questionId);
        const questionDocSnap = await getDoc(questionDocRef);
        if (questionDocSnap.exists()) {
            const questionData = questionDocSnap.data();
            displayQuestionData(questionData);

            // ▼▼▼ 수정: 채택된 답변이 있는지 확인하고 표시하는 함수 호출 ▼▼▼
            if (questionData.isSolved === true && questionData.acceptedAnswerId) {
                displayAcceptedAnswer(questionId, questionData.acceptedAnswerId);
            }

            if (currentUser) {
                document.getElementById('answer-form').classList.remove('hidden');
                initializeAnswerFeature(questionId);
            }
            initializeAnswerList(questionId, questionData);
            if (currentUser && currentUser.uid === questionData.authorId) {
                document.getElementById('author-controls').classList.remove('hidden');
                initializeAuthorControls(questionId, questionData);
            }
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
        acceptedAnswerContainer.innerHTML = `
            <div class="accepted-badge">채택된 답변</div>
            <div class="answer-item">
                <div class="answer-author-profile">
                    <img src="${answerData.authorPhotoUrl || defaultAvatar}" alt="${answerData.authorName}" class="answer-avatar">
                    <span class="name">${answerData.authorName}</span>
                    <span class="rating">(${answerData.authorRating})</span>            
                    <span class="timestamp"> ${answerData.createdAt?.toDate().toLocaleString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) || '방금 전'}</span></p>
                </div>
                <p class="answer-content">${answerData.content.replace(/\n/g, '<br>')}</p>
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
    document.getElementById('question-text-content').innerHTML = questionData.content;

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
                isAccepted: false,
            });
            // ▲▲▲▲▲▲
            answerForm.reset();
        } catch (error) {
            console.error('답변 등록 오류:', error);
            alert('답변 등록에 실패했습니다.');
        }
    });
}

// ▼▼▼ 수정: 답변 목록의 HTML 구조를 변경하는 함수 ▼▼▼
function initializeAnswerList(questionId, questionData) {
    const answersListDiv = document.getElementById('answers-list');
    const answerCountSpan = document.getElementById('answer-count');
    const answersColRef = collection(db, 'questions', questionId, 'answers');
    const q = query(answersColRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (snapshot) => {
        answersListDiv.innerHTML = '';
        answerCountSpan.textContent = snapshot.size;
        if (snapshot.empty) {
            answersListDiv.innerHTML = '<p>아직 등록된 답변이 없습니다.</p>';
            return;
        }

        snapshot.forEach(answerDoc => {
            const answerData = answerDoc.data();
            const answerEl = document.createElement('div');
            answerEl.className = 'answer-item';
            if (answerData.isAccepted) {
                answerEl.classList.add('accepted');
            }

            const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34495e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 5.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>`)}`;
            const formattedDate = answerData.createdAt?.toDate().toLocaleString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12 : false}) || '방금 전';

            const isQuestionAuthor = currentUser && currentUser.uid === questionData.authorId;
            const isMyAnswer = currentUser && currentUser.uid === answerData.authorId;
            const isSolved = questionData.isSolved === true;
            
            // 채택 버튼 HTML 코드를 조건부로 생성
            const acceptBtnHTML = (isQuestionAuthor && !isMyAnswer && !isSolved)
                ? `<button class="accept-answer-btn" data-answer-id="${answerDoc.id}" data-answer-author-id="${answerData.authorId}">채택하기</button>`
                : '';

            answerEl.innerHTML = `
                <div class="answer-header">
                    <div class="answer-author-profile">
                        <img src="${answerData.authorPhotoUrl || defaultAvatar}" alt="${answerData.authorName}" class="answer-avatar">
                        <span class="name">${answerData.authorName}</span>
                        <span class="rating">(${answerData.authorRating})</span>
                        <span class="timestamp">${formattedDate}</span>
                    </div>
                    ${acceptBtnHTML}
                </div>
                <p class="answer-content">${answerData.content.replace(/\n/g, '<br>')}</p>
            `;
            
            answersListDiv.appendChild(answerEl);
        });

        // 생성된 모든 채택하기 버튼에 이벤트 리스너를 한 번에 추가
        answersListDiv.querySelectorAll('.accept-answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const answerId = e.target.dataset.answerId;
                const answerAuthorId = e.target.dataset.answerAuthorId;
                handleAcceptAnswer(questionId, answerId, answerAuthorId);
            });
        });
    });
}
// ▲▲▲▲▲▲

function initializeAuthorControls(questionId, questionData) {
    const deleteBtn = document.getElementById('delete-question-btn');
    const editBtn = document.getElementById('edit-question-btn');
    editBtn.addEventListener('click', () => alert('수정 기능은 현재 준비 중입니다.'));
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
            transaction.update(questionAuthorRef, { mileage: increment(5) });
            transaction.update(answerAuthorRef, { mileage: increment(10) });
        });
        alert('답변이 채택되었습니다! 마일리지가 지급되었습니다.');
    } catch (e) {
        console.error("채택 처리 중 오류:", e);
        alert(`오류가 발생했습니다: ${e.message}`);
    }
}
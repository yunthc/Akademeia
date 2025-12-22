// src/pages/qna.js (최종 수정본)
import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, onSnapshot, orderBy, where } from "firebase/firestore";
import '../auth.js';

let currentFilter = 'all';
let unsubscribe = null;

function initializeQnAPage() {
    setupFilterButtons();
    loadQuestions();
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            loadQuestions();
        });
    });
}

function loadQuestions() {
    const questionsListDiv = document.getElementById('questions-list');
    if (unsubscribe) {
        unsubscribe();
    }

    let baseCollectionRef = collection(db, "questions");
    let q;
    
    // ▼▼▼ 수정: 필터 쿼리 조건을 isSolved 필드값과 정확히 비교하도록 변경 ▼▼▼
    if (currentFilter === 'in-progress') {
        // isSolved 필드가 false인 문서만 가져옴
        q = query(baseCollectionRef, where("isSolved", "==", false), orderBy("createdAt", "desc"));
    } else if (currentFilter === 'solved') {
        // isSolved 필드가 true인 문서만 가져옴
        q = query(baseCollectionRef, where("isSolved", "==", true), orderBy("createdAt", "desc"));
    } else { // 'all'
        // 모든 문서를 가져옴
        q = query(baseCollectionRef, orderBy("createdAt", "desc"));
    }
    // ▲▲▲▲▲▲

    questionsListDiv.innerHTML = '<p>로딩 중...</p>';

    unsubscribe = onSnapshot(q, (snapshot) => {
        questionsListDiv.innerHTML = '';
        if (snapshot.empty) {
            questionsListDiv.innerHTML = '<p>해당하는 질문이 없습니다.</p>';
            return;
        }
        snapshot.forEach((doc) => {
            const question = doc.data();
            const linkElement = document.createElement('a');
            linkElement.href = `/pages/question.html?id=${doc.id}`;
            linkElement.className = 'question-item-link';
            const questionElement = document.createElement('div');
            questionElement.className = 'question-item';

            if (question.isSolved === true) {
                questionElement.classList.add('solved');
            }

            questionElement.innerHTML = `<h3>${question.title}</h3><p class="question-meta"> ${question.authorName}(${question.authorRating})  ${question.createdAt.toDate().toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
})}</p>`;
            linkElement.appendChild(questionElement);
            questionsListDiv.appendChild(linkElement);
        });
    }, (error) => {
        console.error("질문 목록 로드 오류:", error);
        if (error.code === 'failed-precondition') {
            questionsListDiv.innerHTML = `<p style="color: red;">오류: Firestore 색인(Index)이 필요합니다. 개발자 도구(F12) 콘솔을 확인하여, 생성 링크를 클릭해주세요.</p>`;
        } else {
            questionsListDiv.innerHTML = `<p style="color: red;">질문을 불러오는 중 오류가 발생했습니다.</p>`;
        }
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        initializeQnAPage();
    }
});
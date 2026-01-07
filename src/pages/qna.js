// src/pages/qna.js (최종 수정본)
import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, getDocs, orderBy, where, limit, startAfter } from "firebase/firestore";
import '../auth.js';

let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 10; // 한 페이지에 10개씩 표시
const pagesPerGroup = 5; // 한 번에 표시할 페이지 번호 그룹 수
let loadLimit = 50; // 한 번에 불러올 최대 질문 수 (5페이지 분량)

let allQuestions = []; // 불러온 전체 질문 데이터를 저장
let lastVisible = null; // 마지막으로 로드된 문서 (커서)
let hasMore = true; // 더 불러올 데이터가 있는지 여부
let isPageInitialized = false; // 페이지가 이미 초기화되었는지 확인하는 플래그

function initializeQnAPage() {
    setupFilters();
    loadQuestions();
}

function setupFilters() {
    const filterDropdown = document.getElementById('qna-status-filter');

    filterDropdown.value = currentFilter;

    filterDropdown.addEventListener('change', () => {
        currentFilter = filterDropdown.value;
        
        // 필터 변경 시 페이지 초기화
        currentPage = 1;
        allQuestions = [];
        lastVisible = null;
        hasMore = true;
        loadQuestions();
    });
}

function renderPaginationControls() {
    const paginationContainer = document.getElementById('pagination-controls');
    paginationContainer.innerHTML = ''; // 기존 내용 초기화

    const totalPages = Math.ceil(allQuestions.length / itemsPerPage);

    // 데이터가 없으면 페이지네이션 숨김
    if (totalPages === 0) {
        return;
    }

    // 페이지 그룹 계산
    const currentGroup = Math.ceil(currentPage / pagesPerGroup);
    const lastPageInGroup = currentGroup * pagesPerGroup;
    const startPageInGroup = lastPageInGroup - pagesPerGroup + 1;

    // '<< 이전' 그룹 버튼 생성
    const prevGroupBtn = document.createElement('button');
    prevGroupBtn.textContent = '◀';
    prevGroupBtn.className = 'btn-secondary';
    prevGroupBtn.disabled = currentGroup === 1;
    prevGroupBtn.addEventListener('click', () => {
        currentPage = startPageInGroup - 1;
        renderPage(currentPage);
    });
    paginationContainer.appendChild(prevGroupBtn);

    // 페이지 번호 버튼들을 담을 컨테이너
    const pageNumbersContainer = document.createElement('div');
    pageNumbersContainer.className = 'page-numbers';

    for (let i = startPageInGroup; i <= lastPageInGroup; i++) {
        // 현재 로드된 데이터 기준으로 페이지 수를 초과하면 버튼 생성 중단
        if (i > totalPages) {
            break;
        }

        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = 'btn-secondary btn-page-number'; // 기본 버튼 스타일 + 페이지 번호용 클래스
        if (i === currentPage) {
            pageBtn.classList.add('active'); // 현재 페이지 활성화 스타일
        }

        pageBtn.addEventListener('click', () => {
            if (i !== currentPage) {
                currentPage = i;
                renderPage(currentPage);
            }
        });
        pageNumbersContainer.appendChild(pageBtn);
    }
    paginationContainer.appendChild(pageNumbersContainer);

    // '다음 >>' 그룹 버튼 생성
    const nextGroupBtn = document.createElement('button');
    nextGroupBtn.textContent = '▶';
    nextGroupBtn.className = 'btn-secondary';
    
    // 다음 그룹으로 갈 수 있는 조건:
    // 1. 현재 로드된 데이터 내에서 다음 페이지가 있는 경우
    // 2. 로드된 데이터는 끝났지만, 서버에 더 있을 수 있는 경우 (hasMore)
    const isLastGroupLoaded = lastPageInGroup >= totalPages;
    nextGroupBtn.disabled = isLastGroupLoaded && !hasMore;

    nextGroupBtn.addEventListener('click', async () => {
        const targetPage = lastPageInGroup + 1;
        
        // 만약 타겟 페이지가 현재 로드된 데이터 범위를 벗어나면 추가 로딩 시도
        if (targetPage > Math.ceil(allQuestions.length / itemsPerPage)) {
            nextGroupBtn.textContent = '로딩...'; // 로딩 중 표시
            await loadQuestions(true); // 추가 로드 (append 모드)
        }

        // 로드 후 다시 계산하여 페이지 이동 가능 여부 확인
        const newTotalPages = Math.ceil(allQuestions.length / itemsPerPage);
        if (targetPage <= newTotalPages) {
            currentPage = targetPage;
            renderPage(currentPage);
        } else {
            // 로드했는데도 데이터가 없으면 버튼 상태만 업데이트
            renderPaginationControls();
        }
    });
    paginationContainer.appendChild(nextGroupBtn);
}

async function loadQuestions(isAppend = false) {
    const questionsListDiv = document.getElementById('questions-list');
    
    if (!isAppend) {
        questionsListDiv.innerHTML = '<p>로딩 중...</p>';
        document.getElementById('pagination-controls').innerHTML = '';
    }

    let baseCollectionRef = collection(db, "questions");
    let constraints = [orderBy("createdAt", "desc")];

    if (currentFilter === 'in-progress') {
        constraints.push(where("isSolved", "==", false));
    } else if (currentFilter === 'solved') {
        constraints.push(where("isSolved", "==", true));
    }

    // 추가 로딩일 경우, 마지막으로 로드된 문서 다음부터 가져옴
    if (isAppend && lastVisible) {
        constraints.push(startAfter(lastVisible));
    }

    constraints.push(limit(loadLimit));

    try {
        const q = query(baseCollectionRef, ...constraints);
        const snapshot = await getDocs(q);

        if (!isAppend) {
            allQuestions = [];
        }

        if (snapshot.empty) {
            hasMore = false;
            if (!isAppend) {
                questionsListDiv.innerHTML = '<p>해당하는 질문이 없습니다.</p>';
            }
            // 페이지네이션 컨트롤도 업데이트
            renderPaginationControls();
            return;
        } else {
            snapshot.forEach((doc) => {
                allQuestions.push({ id: doc.id, ...doc.data() });
            });

            // 마지막 문서 저장 (다음 커서용)
            lastVisible = snapshot.docs[snapshot.docs.length - 1];

            // 가져온 개수가 요청한 개수(100개)보다 적으면 더 이상 데이터가 없는 것
            if (snapshot.docs.length < loadLimit) {
                hasMore = false;
            } else {
                hasMore = true;
            }

            if (!isAppend) {
                renderPage(1);
            }
        }
    } catch (error) {
        console.error("질문 목록 로드 오류:", error);
        if (error.code === 'failed-precondition') {
            questionsListDiv.innerHTML = `<p style="color: red;">오류: 데이터 조회를 위한 색인(Index)이 필요합니다. 개발자 도구(F12) 콘솔의 링크를 클릭하여 Firestore 색인을 생성해주세요.</p>`;
        } else {
            questionsListDiv.innerHTML = `<p style="color: red;">질문을 불러오는 중 오류가 발생했습니다.</p>`;
        }
    }
}

function renderPage(page) {
    const questionsListDiv = document.getElementById('questions-list');
    questionsListDiv.innerHTML = '';

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = allQuestions.slice(startIndex, endIndex);

    pageItems.forEach(question => {
        const linkElement = document.createElement('a');
        linkElement.href = `/pages/question.html?id=${question.id}`;
        linkElement.className = 'question-item-link';
        const questionElement = document.createElement('div');
        questionElement.className = 'question-item';

        if (question.isSolved === true) {
            questionElement.classList.add('solved');
        }

        questionElement.innerHTML = `
            <div class="question-info">
                <h3>${question.title}</h3>
                <p class="question-meta"> ${question.authorName}(${question.authorRating})  ${question.createdAt.toDate().toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })}</p>
            </div>
            <div class="question-stats">
                <span class="like-count">♡ ${question.likeCount || 0}</span>
                <span class="comment-count">💬 ${question.answerCount || 0}</span>
            </div>`;
        linkElement.appendChild(questionElement);
        questionsListDiv.appendChild(linkElement);
    });

    renderPaginationControls();
}

onAuthStateChanged(auth, (user) => {
    // 사용자가 로그인 상태이고, 페이지가 아직 초기화되지 않았을 때만 실행
    if (user && !isPageInitialized) {
        isPageInitialized = true; // 초기화 플래그를 true로 설정하여 중복 실행 방지
        initializeQnAPage();
    }
});
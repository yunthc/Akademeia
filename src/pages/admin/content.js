import { db, auth } from '../../firebase.js';
import { collection, getDocs, addDoc, serverTimestamp, doc, deleteDoc, getDoc, orderBy, query, where, limit, startAfter } from "firebase/firestore";
import { generateIsomorphicQuestion } from '../../utils/gemini.js';
import '../../auth.js'; // 공통 헤더 및 인증 리디렉션 로직

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 캐싱 ---
    const tabsContainer = document.getElementById('content-tabs');
    const geminiForm = document.getElementById('gemini-test-form');
    const originalProblemTextarea = document.getElementById('original-problem');
    const difficultySelect = document.getElementById('difficulty-select');
    const resultContainer = document.getElementById('result-container');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const generatedContentDiv = document.getElementById('generated-content');
    const generatedQuestionP = document.getElementById('generated-question');
    const generatedAnswerP = document.getElementById('generated-answer');
    const generatedSolutionP = document.getElementById('generated-solution');
    const saveProblemFormContainer = document.getElementById('save-problem-form-container');
    const saveProblemForm = document.getElementById('save-problem-form');
    const problemSearchForm = document.getElementById('problem-search-form');
    const searchInput = document.getElementById('search-input');
    const resetSearchBtn = document.getElementById('reset-search-btn');
    const problemListContainer = document.getElementById('problem-list-container');
    const paginationContainer = document.getElementById('pagination-container');
    const modal = document.getElementById('problem-detail-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // --- 상태 변수 ---
    let generatedProblemData = null; // Gemini로부터 받은 원본 데이터를 저장
    const ITEMS_PER_PAGE = 20;
    const LOAD_LIMIT = 100; // 한 번에 불러올 문항 수 (5페이지 분량)
    let currentSearchTerm = '';
    let currentPage = 1;
    let allProblems = []; // 불러온 전체 문항 데이터 저장
    let lastVisible = null; // 다음 페이지 커서
    let firstVisible = null; // 이전 페이지 커서
    let isLastPage = false;
    let hasMore = true; // 더 불러올 데이터가 있는지 여부
    let isFetching = false; // 데이터 로딩 중복 방지

    // --- 모달 닫기 로직 ---
    const closeModal = () => modal.classList.add('hidden');
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });


    // --- 탭 전환 로직 ---
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn')) {
                tabsContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

                e.target.classList.add('active');
                const targetId = e.target.dataset.target;
                document.getElementById(targetId).classList.add('active');
            }
        });
    }

    // --- Gemini 문항 생성 로직 ---
    if (geminiForm) {
        geminiForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalProblem = originalProblemTextarea.value.trim();
            const difficulty = difficultySelect.value;

            if (!originalProblem) {
                alert('원본 문항을 입력해주세요.');
                return;
            }

            // UI 초기화 및 로딩 상태 표시
            resultContainer.classList.remove('hidden');
            generatedContentDiv.classList.add('hidden');
            errorMessage.classList.add('hidden');
            saveProblemFormContainer.classList.add('hidden');
            loader.classList.remove('hidden');
            geminiForm.querySelector('button[type="submit"]').disabled = true;

            try {
                const result = await generateIsomorphicQuestion(originalProblem, difficulty);
                generatedProblemData = { ...result, difficulty }; // 난이도 포함하여 결과 저장

                // 결과 표시
                generatedQuestionP.textContent = result.question;
                generatedAnswerP.textContent = result.answer;
                generatedSolutionP.textContent = result.solution;

                // MathJax 렌더링
                if (window.MathJax) {
                    MathJax.typesetPromise([generatedQuestionP, generatedAnswerP, generatedSolutionP]).catch(console.error);
                }

                generatedContentDiv.classList.remove('hidden');
                saveProblemFormContainer.classList.remove('hidden');

            } catch (error) {
                console.error("Gemini 문항 생성 오류:", error);
                errorMessage.textContent = `문항 생성 중 오류가 발생했습니다: ${error.message}`;
                errorMessage.classList.remove('hidden');
            } finally {
                loader.classList.add('hidden');
                geminiForm.querySelector('button[type="submit"]').disabled = false;
            }
        });
    }

    // --- 생성된 문항 저장 로직 ---
    if (saveProblemForm) {
        saveProblemForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!generatedProblemData) {
                alert('저장할 문항 데이터가 없습니다. 먼저 문항을 생성해주세요.');
                return;
            }

            const grade = document.getElementById('problem-grade-input').value;
            const domain = document.getElementById('problem-domain-input').value;
            const tagsInput = document.getElementById('problem-tags-input').value;

            if (!grade || !domain) {
                alert('학년과 영역을 모두 입력해주세요.');
                return;
            }
            
            const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
            const difficultyMap = { 'easy': 1000, 'middle': 1200, 'hard': 1500 };

            const problemToSave = {
                question: generatedProblemData.question,
                choices: generatedProblemData.choices,
                answer: generatedProblemData.answer,
                solution: generatedProblemData.solution,
                difficulty: difficultyMap[generatedProblemData.difficulty] || 1200,
                grade,
                domain,
                tags,
                createdAt: serverTimestamp(),
                authorId: auth.currentUser ? auth.currentUser.uid : 'admin',
            };

            const saveButton = saveProblemForm.querySelector('button[type="submit"]');
            saveButton.disabled = true;
            saveButton.textContent = '저장 중...';

            try {
                const docRef = await addDoc(collection(db, "problems"), problemToSave);
                alert(`문항이 성공적으로 저장되었습니다. (ID: ${docRef.id})`);
                geminiForm.reset();
                saveProblemForm.reset();
                resultContainer.classList.add('hidden');
                generatedProblemData = null;
            } catch (error) {
                console.error("DB에 문항 저장 오류:", error);
                alert(`문항 저장에 실패했습니다: ${error.message}`);
            } finally {
                saveButton.disabled = false;
                saveButton.textContent = 'DB에 문항 저장';
            }
        });
    }

    // --- 문항 목록 관리 로직 ---
    if (problemSearchForm) {
        problemSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            currentSearchTerm = searchInput.value.trim();
            currentPage = 1;
            lastVisible = null;
            firstVisible = null;
            loadAndDisplayProblems('first');
        });

        resetSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentSearchTerm = '';
            currentPage = 1;
            lastVisible = null;
            firstVisible = null;
            loadAndDisplayProblems('first');
        });
    }

    async function loadAndDisplayProblems(direction) {
        problemListContainer.innerHTML = '<p>문항 목록을 불러오는 중...</p>';
        paginationContainer.innerHTML = '';

        try {
            let q;
            const problemsRef = collection(db, "problems");
            let constraints = [orderBy("createdAt", "desc")];

            if (currentSearchTerm) {
                constraints.push(where("tags", "array-contains", currentSearchTerm));
            }

            if (direction === 'next' && lastVisible) {
                constraints.push(startAfter(lastVisible));
            } else if (direction === 'prev' && firstVisible) {
                // 이전 페이지로 갈 때는 순서를 뒤집고, 마지막 N개를 가져온 뒤 다시 뒤집어야 함
                constraints = [orderBy("createdAt", "asc"), where("createdAt", ">", firstVisible.data().createdAt), limit(ITEMS_PER_PAGE)];
                if (currentSearchTerm) {
                    constraints.splice(1, 0, where("tags", "array-contains", currentSearchTerm));
                }
                // 이 방식은 복잡하므로, Prev 버튼은 단순하게 구현하거나 Next/Reset만 제공하는 것이 더 일반적입니다.
                // 여기서는 Next/Reset 기반으로 재구현합니다.
                constraints = [orderBy("createdAt", "desc")];
                if (currentSearchTerm) constraints.push(where("tags", "array-contains", currentSearchTerm));
                if (direction === 'next' && lastVisible) constraints.push(startAfter(lastVisible));
            }

            q = query(problemsRef, ...constraints, limit(ITEMS_PER_PAGE));

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                problemListContainer.innerHTML = `<p>${currentSearchTerm ? `'${currentSearchTerm}'에 대한` : ''} 저장된 문항이 없습니다.</p>`;
                renderPagination(0);
                return;
            }

            firstVisible = querySnapshot.docs[0];
            lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            isLastPage = querySnapshot.docs.length < ITEMS_PER_PAGE;

            let tableHTML = `<table class="admin-table"><thead><tr><th>문항</th><th>영역</th><th>학년</th><th>난이도(R)</th><th>생성일</th><th>작업</th></tr></thead><tbody>`;
            querySnapshot.forEach(doc => {
                const problem = doc.data();
                const createdDate = problem.createdAt?.toDate().toLocaleDateString('ko-KR') || '정보 없음';
                const truncatedQuestion = problem.question.length > 50 ? problem.question.substring(0, 50) + '...' : problem.question;
                tableHTML += `<tr data-id="${doc.id}"><td>${truncatedQuestion}</td><td>${problem.domain || '미지정'}</td><td>${problem.grade || '미지정'}</td><td>${Math.round(problem.difficulty) || 1200}</td><td>${createdDate}</td><td><button class="btn-danger btn-small delete-problem-btn" data-id="${doc.id}">삭제</button></td></tr>`;
            });
            tableHTML += '</tbody></table>';
            problemListContainer.innerHTML = tableHTML;

            renderPagination(querySnapshot.docs.length);

        } catch (error) {
            console.error("문항 목록 로드 오류:", error);
            problemListContainer.innerHTML = `<p style="color: red;">문항 목록을 불러오는 중 오류가 발생했습니다.</p>`;
        }
    }

    function renderPagination() {
        paginationContainer.innerHTML = '';

        const prevBtn = document.createElement('button');
        prevBtn.textContent = '이전';
        prevBtn.className = 'btn-secondary';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            // 이전 페이지 기능은 복잡하여 이 예제에서는 구현하지 않습니다.
            // 사용자가 검색을 다시 하도록 유도합니다.
            alert('첫 페이지입니다. 이전 페이지로 가려면 검색을 다시 실행해주세요.');
        });

        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `페이지 ${currentPage}`;

        const nextBtn = document.createElement('button');
        nextBtn.textContent = '다음';
        nextBtn.className = 'btn-secondary';
        nextBtn.disabled = isLastPage;
        nextBtn.addEventListener('click', () => {
            currentPage++;
            loadAndDisplayProblems('next');
        });

        paginationContainer.append(prevBtn, pageInfo, nextBtn);
    }

    // --- 문항 삭제 및 상세 보기 로직 (이벤트 위임) ---
    if (problemListContainer) {
        problemListContainer.addEventListener('click', async (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;

            const problemId = row.dataset.id;

            if (target.matches('.delete-problem-btn')) {
                e.stopPropagation(); // 행 클릭 이벤트 방지
                if (confirm(`정말로 이 문항(ID: ${problemId})을 삭제하시겠습니까?`)) {
                    try {
                        await deleteDoc(doc(db, "problems", problemId));
                        alert('문항이 삭제되었습니다.');
                        row.remove();
                    } catch (error) {
                        console.error("문항 삭제 오류:", error);
                        alert(`문항 삭제에 실패했습니다: ${error.message}`);
                    }
                }
            } else {
                // 행의 다른 부분을 클릭했을 때 모달 열기
                const docSnap = await getDoc(doc(db, "problems", problemId));
                if (docSnap.exists()) {
                    const problem = docSnap.data();
                    document.getElementById('modal-problem-id').textContent = problemId;
                    document.getElementById('modal-question').textContent = problem.question;
                    document.getElementById('modal-answer').textContent = problem.answer;
                    document.getElementById('modal-solution').textContent = problem.solution;
                    document.getElementById('modal-grade').textContent = problem.grade || '미지정';
                    document.getElementById('modal-domain').textContent = problem.domain || '미지정';
                    document.getElementById('modal-difficulty').textContent = Math.round(problem.difficulty) || '미지정';
                    document.getElementById('modal-tags').textContent = problem.tags?.join(', ') || '없음';
                    document.getElementById('modal-createdAt').textContent = problem.createdAt?.toDate().toLocaleString('ko-KR') || '정보 없음';

                    if (window.MathJax) {
                        MathJax.typesetPromise([
                            document.getElementById('modal-question'),
                            document.getElementById('modal-answer'),
                            document.getElementById('modal-solution')
                        ]).catch(console.error);
                    }
                    modal.classList.remove('hidden');
                }
            }
        });
    }
});
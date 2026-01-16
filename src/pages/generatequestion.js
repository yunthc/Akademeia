// src/pages/generatequestion.js
import { db } from '../firebase.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { requireAuth } from '../auth.js'; // 헤더 UI 업데이트 등 공통 로직 실행

let currentUserData = null;

requireAuth((user, userData) => {
    currentUserData = userData;
    initializeGenerateQuestionPage(currentUserData);
});

function initializeGenerateQuestionPage(user) {
    if (!user) return;
    
    // --- 수정 모드 감지 ---
    const urlParams = new URLSearchParams(window.location.search);
    const editQuestionId = urlParams.get('edit');

    const questionForm = document.getElementById('question-form');
    const questionTitleInput = document.getElementById('question-title');
    const questionContentInput = document.getElementById('question-content');
    
    // --- Image Upload Elements ---
    const imageUploadArea = document.getElementById('image-upload-area');
    const questionImageInput = document.getElementById('question-image-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const removeImageBtn = document.getElementById('remove-image-btn');

    let selectedFile = null;

    // --- Textarea 높이 자동 조절 ---
    function autoResizeTextarea() {
        // 높이를 일시적으로 1px로 만들어 스크롤 높이를 정확히 계산하도록 함
        this.style.height = '1px';
        // scrollHeight는 내용에 맞는 실제 높이
        const newHeight = this.scrollHeight;
        this.style.height = newHeight + 'px';
    }

    // 'input' 이벤트는 키보드 입력, 붙여넣기 등 내용이 변경될 때마다 발생합니다.
    questionContentInput.addEventListener('input', autoResizeTextarea);

    // 페이지 로딩 시, 아레나에서 받아온 내용으로도 높이를 조절하기 위해 한번 실행
    // (이 부분은 '아레나->Q&A' 연동 로직 바로 다음에 두면 좋습니다)
    if (questionContentInput.value) {
        autoResizeTextarea.call(questionContentInput);
    }

    // --- 수정 모드 또는 새 글 모드에 따라 페이지 초기화 ---
    if (editQuestionId) {
        loadQuestionForEditing(editQuestionId);
    } else {
        // --- 아레나에서 넘어온 문제 데이터 자동 채우기 (새 글 모드에서만) ---
        const storedProblem = sessionStorage.getItem('qnaNewPostData');
        if (storedProblem) {
            try {
                const problemData = JSON.parse(storedProblem);
                questionTitleInput.value = `[아레나] '${problemData.question.substring(0, 15)}...' 문제에 대해 질문합니다.`;
                const choicesText = problemData.choices.map((choice, index) => `> ${index + 1}. ${choice}`).join('\n');
                questionContentInput.value = 
    `(여기에 질문 내용을 작성하세요.)\n
    \n
    ---\n
    > ### ⚔️ 아레나 출제 문제
    >
    > **Q.** ${problemData.question.replace(/\n/g, '\n> ')}\n
    > \n
    > **선택지** \n
    ${choicesText}\n
    ---
    `;
                autoResizeTextarea.call(questionContentInput);
                sessionStorage.removeItem('qnaNewPostData');
            } catch (error) {
                console.error("문제 정보를 불러오는 데 실패했습니다:", error);
                sessionStorage.removeItem('qnaNewPostData');
            }
        }
    }

    async function loadQuestionForEditing(questionId) {
        document.querySelector('.page-title-bar h2').textContent = '질문 글 수정';
        const submitButton = questionForm.querySelector('button[type="submit"]');
        submitButton.textContent = '질문 수정';

        try {
            const questionDocRef = doc(db, "questions", questionId);
            const questionDocSnap = await getDoc(questionDocRef);

            if (questionDocSnap.exists()) {
                const questionData = questionDocSnap.data();

                if (questionData.authorId !== user.uid) {
                    alert('이 질문을 수정할 권한이 없습니다.');
                    window.location.href = `/pages/question.html?id=${questionId}`;
                    return;
                }

                questionTitleInput.value = questionData.title;
                questionContentInput.value = questionData.content;
                autoResizeTextarea.call(questionContentInput);

                if (questionData.imageUrl) {
                    imagePreview.src = questionData.imageUrl;
                    imagePreviewContainer.classList.remove('hidden');
                    uploadPlaceholder.classList.add('hidden');
                    questionForm.dataset.originalImageUrl = questionData.imageUrl;
                }
            } else {
                alert('수정할 질문을 찾을 수 없습니다.');
                window.location.href = '/pages/qna.html';
            }
        } catch (error) {
            console.error("수정할 질문 로딩 오류:", error);
            alert('질문 정보를 불러오는 중 오류가 발생했습니다.');
        }
    }

    // --- New Image Upload Logic ---
    function displayImagePreview(file) {
        if (file && file.type.startsWith('image/')) {
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreviewContainer.classList.remove('hidden');
                uploadPlaceholder.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            removeImage();
        }
    }

    function removeImage() {
        selectedFile = null;
        questionImageInput.value = ''; // Reset file input
        imagePreview.src = '#';
        imagePreviewContainer.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
        if (questionForm.dataset.originalImageUrl) {
            questionForm.dataset.originalImageUrl = '';
        }
    }

    // Event Listeners for Image Upload
    removeImageBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent label from opening file dialog
        e.stopPropagation(); // Stop bubbling
        removeImage();
    });

    questionImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        displayImagePreview(file);
    });

    // Drag and Drop Listeners
    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.classList.add('dragging');
    });

    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.classList.remove('dragging');
    });

    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('dragging');
        const file = e.dataTransfer.files[0];
        displayImagePreview(file);
    });


    questionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = questionTitleInput.value.trim();
        const content = questionContentInput.value;
        if (!title || !content) return alert('제목과 내용을 모두 입력해주세요.');

        const submitButton = questionForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = editQuestionId ? '수정 중...' : '등록 중...';

        try {
            if (editQuestionId) {
                // --- 질문 수정 로직 ---
                const questionRef = doc(db, "questions", editQuestionId);
                let finalImageUrl = questionForm.dataset.originalImageUrl;

                if (selectedFile) { // 새 파일이 업로드된 경우
                    const storage = getStorage();
                    const storageRef = ref(storage, `question_images/${user.uid}_${Date.now()}_${selectedFile.name}`);
                    const uploadResult = await uploadBytes(storageRef, selectedFile);
                    finalImageUrl = await getDownloadURL(uploadResult.ref);
                    // 참고: 이전 이미지는 삭제하지 않음 (Cloud Function으로 처리하는 것이 더 안전)
                }

                await updateDoc(questionRef, {
                    title: title,
                    content: content,
                    imageUrl: finalImageUrl === '' ? null : finalImageUrl,
                    updatedAt: new Date()
                });

                alert('질문이 성공적으로 수정되었습니다.');
                window.location.href = `/pages/question.html?id=${editQuestionId}`;
            } else {
                // --- 새 질문 등록 로직 ---
                let imageUrl = null;
                if (selectedFile) {
                    const storage = getStorage();
                    const storageRef = ref(storage, `question_images/${user.uid}_${Date.now()}_${selectedFile.name}`);
                    const uploadResult = await uploadBytes(storageRef, selectedFile);
                    imageUrl = await getDownloadURL(uploadResult.ref);
                }

                const newQuestionDocRef = await addDoc(collection(db, "questions"), {
                    title: title, content: content, imageUrl: imageUrl,
                    authorId: user.uid, authorName: user.nickname, authorPhotoUrl: user.photoURL || null,
                    authorRating: user.rating, createdAt: new Date(), answerCount: 0, isSolved: false, 
                    likeCount: 0,
                });

                alert('질문이 성공적으로 등록되었습니다. 작성하신 질문 페이지로 이동합니다.');
                window.location.href = `/pages/question.html?id=${newQuestionDocRef.id}`;
            }
        } catch (error) {
            console.error("처리 중 오류 발생:", error);
            alert('처리 중 오류가 발생했습니다.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = editQuestionId ? '질문 수정' : '질문 등록';
        }
    });
}
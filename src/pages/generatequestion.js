// src/pages/generatequestion.js
import { auth, db } from '../firebase.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import '../auth.js'; // 헤더 UI 업데이트 등 공통 로직 실행

let currentUserData = null;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        if (userDocSnap.exists()) {
            currentUserData = userDocSnap.data();
            initializeGenerateQuestionPage(currentUserData);
        }
    }
});

function initializeGenerateQuestionPage(user) {
    if (!user) return;
    
    const questionForm = document.getElementById('question-form');
    const questionTitleInput = document.getElementById('question-title');
    const questionContentInput = document.getElementById('question-content');
    const questionImageInput = document.getElementById('question-image-input');
    const fileNameDisplay = document.getElementById('file-name-display');
    let selectedFile = null;

    // ▼▼▼ 이 부분을 새로 추가해주세요 ▼▼▼
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
    // ▲▲▲ 여기까지 ▲▲▲


    // ▼▼▼ 이 로직 블록을 새로 추가해주세요 ▼▼▼
    // --- 아레나에서 넘어온 문제 데이터 자동 채우기 ---
    const storedProblem = sessionStorage.getItem('qnaNewPostData');
    if (storedProblem) {
        try {
            const problemData = JSON.parse(storedProblem);

            // 폼의 제목과 내용에 문제 정보 미리 채우기
            questionTitleInput.value = `[아레나] 문제 질문`;
            
            const choicesText = problemData.choices.map((choice, index) => `${index + 1}. ${choice}`).join('\n');
            questionContentInput.value = 
`(여기에 질문 내용을 작성하세요.)\n
\n
---\n
**문제:** ${problemData.question}\n
\n
**선택지:**\n
${choicesText}\n
---
`;
            // ▼▼▼ 이 한 줄을 추가해주세요 ▼▼▼
            // 내용을 채워준 직후, 높이 조절 함수를 '수동으로' 한 번 호출합니다.
            autoResizeTextarea.call(questionContentInput);
            // ▲▲▲ 여기까지 ▲▲▲

            // MathJax가 있다면, LaTex 수식을 렌더링하기 위해 contenteditable 대신 textarea를 사용해야 할 수 있습니다.
            // 만약 content가 풍부한 에디터(예: Toast UI Editor)를 사용한다면, .setValue() 또는 .setMarkdown() 같은 API를 사용해야 합니다.

            // 데이터를 한 번 사용한 후에는 반드시 지워서,
            // 나중에 다시 글쓰기 페이지에 들어왔을 때 내용이 남아있지 않도록 합니다.
            sessionStorage.removeItem('qnaNewPostData');

        } catch (error) {
            console.error("문제 정보를 불러오는 데 실패했습니다:", error);
            sessionStorage.removeItem('qnaNewPostData');
        }
    }
    // ▲▲▲ 여기까지 ▲▲▲

    questionImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            selectedFile = file;
            fileNameDisplay.textContent = file.name;
        } else {
            selectedFile = null;
            fileNameDisplay.textContent = '선택된 파일 없음';
        }
    });

    questionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = questionTitleInput.value.trim();
        const content = questionContentInput.value.trim();
        if (!title || !content) return alert('제목과 내용을 모두 입력해주세요.');

        const submitButton = questionForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = '등록 중...';

        try {
            let imageUrl = null;
            if (selectedFile) {
                const storage = getStorage();
                // 파일 경로 지정: question_images/유저ID_현재시간_파일명
                const storageRef = ref(storage, `question_images/${user.uid}_${Date.now()}_${selectedFile.name}`);
                
                const uploadResult = await uploadBytes(storageRef, selectedFile);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            // ▼▼▼ 수정: 작성자 정보를 더 풍부하게 저장 ▼▼▼
            await addDoc(collection(db, "questions"), {
                title: title,
                content: content,
                imageUrl: imageUrl, 
                authorId: user.uid,
                authorName: user.nickname,
                authorPhotoUrl: user.photoURL || null, // 프로필 사진 URL 추가
                authorRating: user.rating, // 당시 레이팅 추가
                createdAt: new Date(),
                answerCount: 0,
                isSolved: false,
            });
            // ▲▲▲▲▲▲

            alert('질문이 성공적으로 등록되었습니다.');
            window.location.href = '/qna.html';

        } catch (error) {
            console.error("질문 등록 중 오류 발생:", error);
            alert('질문 등록에 실패했습니다.');
            submitButton.disabled = false;
            submitButton.textContent = '질문 등록';
        }
    });
}
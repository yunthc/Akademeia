// /src/pages/add-problem.js

import { db, auth } from '../firebase.js';
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
        } else {
            window.location.href = '/pages/index.html';
        }
    });

    // --- 기존 단일 문제 등록 로직 ---
    const form = document.getElementById('problem-form');
    // ... (이전 답변의 폼 이벤트 리스너는 여기에 그대로 둡니다) ...


    // --- ▼▼▼ CSV 일괄 업로드 로직 추가 ▼▼▼ ---
    
    const csvFileInput = document.getElementById('csv-file-input');
    const csvFileNameEl = document.getElementById('csv-file-name');
    const uploadCsvBtn = document.getElementById('upload-csv-btn');

    // 파일 선택 시 파일 이름 표시
    csvFileInput.addEventListener('change', () => {
        if (csvFileInput.files.length > 0) {
            csvFileNameEl.textContent = csvFileInput.files[0].name;
        } else {
            csvFileNameEl.textContent = '선택된 파일 없음';
        }
    });

    // 업로드 버튼 클릭 시 CSV 파싱 및 Firestore 전송
    uploadCsvBtn.addEventListener('click', () => {
        const file = csvFileInput.files[0];
        if (!file) {
            alert("CSV 파일을 선택해주세요.");
            return;
        }
        
        uploadCsvBtn.disabled = true;
        uploadCsvBtn.textContent = '업로드 중...';

        // Papa Parse 라이브러리를 사용하여 CSV 파일 파싱
        Papa.parse(file, {
            header: true, // CSV의 첫 줄을 데이터의 키(key)로 사용
            skipEmptyLines: true, // 빈 줄은 건너뜀
            complete: async (results) => {
                try {
                    const problems = results.data;
                    if (problems.length === 0) throw new Error("CSV 파일에 데이터가 없습니다.");

                    // Firestore에 한 번에 여러 문서를 쓰기 위한 Batch 생성
                    const batch = writeBatch(db);

                    problems.forEach(problem => {
                        // CSV 데이터를 Firestore 형식에 맞게 변환
                        const newProblemData = {
                            question: problem.question,
                            choices: problem.choices.split(',').map(s => s.trim()),
                            answer: problem.answer.trim(),
                            grade: problem.grade.trim(),
                            domain: problem.domain.trim(),
                            tags: problem.tags.split(',').map(s => s.trim()),
                            difficulty: parseInt(problem.difficulty),
                            authorId: currentUser.uid,
                            createdAt: serverTimestamp()
                        };
                        
                        // 새로운 문서 참조를 만들고 batch에 쓰기 작업 추가
                        const newProblemRef = doc(collection(db, "problems"));
                        batch.set(newProblemRef, newProblemData);
                    });

                    // Batch 작업 한번에 실행
                    await batch.commit();

                    alert(`${problems.length}개의 문제가 성공적으로 업로드되었습니다.`);
                    csvFileInput.value = ''; // 파일 입력 초기화
                    csvFileNameEl.textContent = '선택된 파일 없음';

                } catch (error) {
                    console.error("일괄 업로드 오류:", error);
                    alert(`오류 발생: ${error.message}`);
                } finally {
                    uploadCsvBtn.disabled = false;
                    uploadCsvBtn.textContent = '업로드 시작';
                }
            },
            error: (error) => {
                alert("CSV 파일을 처리하는 중 오류가 발생했습니다.");
                console.error(error);
                uploadCsvBtn.disabled = false;
                uploadCsvBtn.textContent = '업로드 시작';
            }
        });
    });
});
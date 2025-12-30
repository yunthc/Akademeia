import { db } from '../../firebase.js';
import { collection, query, where, getDocs } from "firebase/firestore";
import '../../auth.js'; // 공통 헤더 및 인증 리디렉션 로직

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('user-search-form');
    const searchInput = document.getElementById('user-search-input');
    const resultsContainer = document.getElementById('user-results-container');

    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();

            if (!searchTerm) {
                resultsContainer.innerHTML = '<p>검색할 닉네임을 입력해주세요.</p>';
                return;
            }

            resultsContainer.innerHTML = '<p>사용자를 검색하는 중...</p>';

            try {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("nickname", "==", searchTerm));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    resultsContainer.innerHTML = '<p>해당 닉네임의 사용자를 찾을 수 없습니다.</p>';
                    return;
                }

                let tableHTML = `<table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>닉네임</th>
                                            <th>이메일</th>
                                            <th>레이팅</th>
                                            <th>가입일</th>
                                            <th>역할</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;

                querySnapshot.forEach(doc => {
                    const user = doc.data();
                    const joinDate = user.createdAt?.toDate().toLocaleDateString('ko-KR') || '정보 없음';
                    tableHTML += `<tr>
                                    <td>${user.nickname}</td>
                                    <td>${user.email}</td>
                                    <td>${user.rating}</td>
                                    <td>${joinDate}</td>
                                    <td>${user.role || 'user'}</td>
                                  </tr>`;
                });

                tableHTML += '</tbody></table>';
                resultsContainer.innerHTML = tableHTML;

            } catch (error) {
                console.error("사용자 검색 오류:", error);
                resultsContainer.innerHTML = `<p style="color: red;">사용자 검색 중 오류가 발생했습니다.</p>`;
            }
        });
    }
});
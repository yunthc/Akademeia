// src/auth.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// src/auth.js 의 setupHeaderUI 함수 전체를 교체해주세요.

function setupHeaderUI(userData) {
    const userProfileDiv = document.getElementById('user-profile');
    if (!userProfileDiv) return;

    // 새로운 HTML 구조에 맞는 요소들을 모두 가져옵니다.
    const profileImage = document.getElementById('header-profile-image');
    const nicknameSpan = document.getElementById('header-nickname');
    const ratingSpan = document.getElementById('header-rating');
    const logoutBtn = document.getElementById('logout-btn');
    
    userProfileDiv.classList.remove('hidden');

    // 기본 프로필 이미지 설정
    const defaultAvatarSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34495e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 5.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>`;
    const defaultAvatarDataUrl = `data:image/svg+xml,${encodeURIComponent(defaultAvatarSVG)}`;
    profileImage.src = userData.photoURL || defaultAvatarDataUrl;
    
    // 닉네임 설정
    nicknameSpan.textContent = userData.nickname || userData.googleDisplayName || "User";
    
    // 레이팅을 (괄호) 안에 표시
    ratingSpan.textContent = `(${userData.rating})`;

    // 로그아웃 버튼 이벤트 리스너
    const newLogoutBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
    newLogoutBtn.addEventListener('click', () => signOut(auth));
}

// ▼▼▼ 수정된 인증 상태 감지 로직 ▼▼▼
onAuthStateChanged(auth, async (user) => {
    const currentPath = window.location.pathname;
    
    // 로그인이 필요한 페이지들의 경로 목록
    const protectedPaths = ['/pages/dashboard.html', '/pages/mypage.html', '/pages/user-profile.html', '/pages/qna.html', '/pages/question.html', '/pages/generatequestion.html', '/pages/matchmaking.html', '/pages/arena.html','/pages/sprint.html','/pages/tower.html', '/pages/admin/', '/pages/leaderboard.html', '/pages/add-problem.html'];
    // 현재 페이지가 로그인이 필요한 페이지인지 확인
    const onProtectedPage = protectedPaths.some(path => currentPath.includes(path));

    if (user) {
        // --- 로그인된 상태 ---
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            // 프로필이 있는 기존 유저
            const userData = userDocSnap.data();
            setupHeaderUI(userData); // 헤더 UI 업데이트

            // --- 관리자 기능 UI 설정 ---
            if (currentPath.includes('/pages/mypage.html') && userData.role === 'admin') {
                const adminZone = document.getElementById('admin-zone');
                if (adminZone) {
                    adminZone.classList.remove('hidden');
                }
            }

            // --- 관리자 페이지 접근 제어 ---
            const onAdminPage = currentPath.startsWith('/pages/admin/');
            if (onAdminPage && userData.role !== 'admin') {
                alert('관리자만 접근할 수 있는 페이지입니다.');
                window.location.href = '/pages/dashboard.html';
                return; // 이후 로직 실행 중단
            }
            
            // 만약 로그인 페이지나 프로필 설정 페이지에 있다면, 대시보드로 보냄
            if (currentPath === '/' || currentPath.endsWith('/pages/index.html') || currentPath.includes('/pages/profile.html')) {
                window.location.href = '/pages/dashboard.html';
            }
        } else {
            // 프로필이 없는 신규 유저
            // 프로필 설정 페이지가 아니라면, 프로필 설정 페이지로 보냄
            if (!currentPath.includes('/pages/profile.html')) {
                window.location.href = '/pages/profile.html';
            }
        }
    } else {
        // --- 로그아웃된 상태 ---
        // 로그인이 필요한 페이지에 있다면, 로그인 페이지로 보냄
        if (onProtectedPage) {
            window.location.href = '/pages/index.html';
        }
    }
});

/**
 * 페이지별 초기화 로직을 위한 헬퍼 함수
 * 인증된 사용자와 프로필 데이터가 있을 때만 콜백을 실행합니다.
 * 리다이렉트는 위쪽의 전역 onAuthStateChanged에서 처리되므로 여기서는 신경 쓰지 않아도 됩니다.
 * @param {Function} callback - (user, userData) => void
 */
export function requireAuth(callback) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) return; // 리다이렉트는 전역 리스너가 처리함

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            callback(user, { uid: user.uid, ...userData });
        }
    });
}
// src/pages/user-profile.js
import { db } from '../firebase.js';
import { doc, getDoc } from "firebase/firestore";
import { requireAuth } from '../auth.js';

requireAuth(async (user) => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUid = urlParams.get('uid');

    if (!targetUid) {
        alert("잘못된 접근입니다.");
        window.location.href = '/pages/dashboard.html';
        return;
    }

    // 만약 내 uid라면 마이페이지로 리다이렉트 (선택 사항, UX상 좋음)
    if (targetUid === user.uid) {
        window.location.href = '/pages/mypage.html';
        return;
    }

    try {
        const targetUserDoc = await getDoc(doc(db, "users", targetUid));
        if (targetUserDoc.exists()) {
            displayUserProfile(targetUserDoc.data());
        } else {
            alert("존재하지 않는 사용자입니다.");
            window.location.href = '/pages/dashboard.html';
        }
    } catch (error) {
        console.error("프로필 조회 오류:", error);
        alert("프로필을 불러오는 중 오류가 발생했습니다.");
        window.location.href = '/pages/dashboard.html';
    }
});

function displayUserProfile(userData) {
    const defaultAvatarUrl = '/default-avatar.svg';
    
    document.getElementById('profile-image').src = userData.photoURL || defaultAvatarUrl;
    document.getElementById('display-nickname').textContent = userData.nickname;
    document.getElementById('display-grade').textContent = `학년: ${userData.grade}`;
    document.getElementById('display-rating').textContent = userData.rating;
    document.getElementById('display-mileage').textContent = userData.mileage;
    document.getElementById('display-level').textContent = userData.level;
    
    document.querySelector('.page-title-bar h2').textContent = `${userData.nickname}님의 프로필`;
}
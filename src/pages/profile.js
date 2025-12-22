// src/pages/profile.js
import { auth, db } from '../firebase.js';
import { doc, setDoc } from "firebase/firestore";
import '../auth.js'; // 공통 인증 로직 실행

const profileForm = document.getElementById('profile-form');

function getInitialRating(grade) {
    switch (grade) {
        case '초등': return 1000;
        case '중1': return 2000;
        case '중2': return 2300;
        case '중3': return 2700;
        case '고1': return 3000;
        case '고2': return 3500;
        case '고3': return 4000;
        case '일반': return 3000;
        default: return 1000; // 혹시 값이 없는 경우 기본값
    }
}

if (profileForm) {
    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            alert('로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.');
            window.location.href = '/index.html';
            return;
        }

        const nickname = document.getElementById('profile-nickname').value;
        const grade = document.getElementById('profile-grade').value;

        if (!grade) {
            alert('학년을 선택해주세요.');
            return;
        }

        // ▼▼▼ 수정된 부분 ▼▼▼
        // 1. 선택한 학년을 바탕으로 초기 레이팅 계산
        const initialRating = getInitialRating(grade);

        // 2. 저장할 프로필 객체에 고정값 1200 대신, 계산된 초기 레이팅을 저장
        const newUserProfile = {
            uid: user.uid,
            email: user.email,
            googleDisplayName: user.displayName,
            photoURL: user.photoURL,
            nickname: nickname,
            grade: grade,
            level: 1,
            mileage: 0,
            rating: initialRating, // 계산된 초기 레이팅으로 설정
            createdAt: new Date()
        };
        // ▲▲▲▲▲▲
        
        try {
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, newUserProfile);
            window.location.href = '/dashboard.html';
        } catch (error) {
            console.error("프로필 저장 오류:", error);
            alert('프로필 저장에 실패했습니다.');
        }
    });
}
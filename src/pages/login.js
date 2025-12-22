// src/pages/login.js
import { auth } from '../firebase.js';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import '../auth.js'; // 공통 인증 로직 실행을 위해 import

const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).catch(error => {
            console.error("로그인 중 오류 발생:", error);
            alert("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
        });
    });
}
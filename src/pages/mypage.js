import { auth, db, storage } from '../firebase.js'; // storage도 사용하므로 import
import { onAuthStateChanged, updateProfile, deleteUser } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import '../auth.js'; // 모든 페이지의 공통 인증 로직 실행

// --- 페이지의 모든 로직을 관장하는 메인 리스너 ---
onAuthStateChanged(auth, async (user) => {
    // 사용자가 로그인되어 있는지 확인
    if (user) {
        // Firestore에서 해당 사용자의 프로필 문서를 가져옴
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            // 프로필 문서가 존재하면, 해당 데이터를 기반으로 페이지 전체 기능을 초기화
            const userData = userDocSnap.data();
            initializeMyPage(user, userData);
        } else {
            // 프로필이 없는 사용자는 이 페이지에 올 수 없으므로 프로필 설정 페이지로 보냄
            // (이 로직은 auth.js가 처리하지만, 만약을 위한 방어 코드)
            alert("프로필 정보가 없습니다. 프로필 설정 페이지로 이동합니다.");
            window.location.href = '/profile.html';
        }
    }
    // 로그아웃 상태라면 auth.js가 로그인 페이지로 보내주므로 별도 처리 안 함
});


/**
 * '내 정보' 페이지의 모든 기능을 초기화하는 메인 함수
 * @param {object} user - Firebase Authentication의 user 객체
 * @param {object} userData - Firestore의 users 컬렉션에서 가져온 프로필 데이터
 */
function initializeMyPage(user, userData) {
    displayProfileData(userData);
    initializeEditFeatures(user, userData);
    initializeDeleteFeature(user, userData);
}


/**
 * Firestore에서 가져온 데이터를 화면의 각 요소에 채워넣는 함수
 * @param {object} userData - 사용자 프로필 데이터
 */
function displayProfileData(userData) {
    const profileImage = document.getElementById('profile-image');
    
    // ▼▼▼ 수정: 데이터 URL 대신 로컬 파일 경로를 사용합니다. ▼▼▼
    const defaultAvatarUrl = '/default-avatar.svg';
    profileImage.src = userData.photoURL || defaultAvatarUrl;
    // ▲▲▲▲▲▲

    document.getElementById('profile-image').src = userData.photoURL || defaultAvatarUrl;   
    document.getElementById('display-nickname').textContent = userData.nickname;
    document.getElementById('display-email').textContent = userData.email;
    document.getElementById('display-grade').textContent = `학년: ${userData.grade}`;
    document.getElementById('display-rating').textContent = userData.rating;
    document.getElementById('display-mileage').textContent = userData.mileage;
    document.getElementById('display-level').textContent = userData.level;
}


/**
 * 닉네임, 학년, 프로필 이미지 수정과 관련된 모든 이벤트 리스너를 설정하는 함수
 * @param {object} user - Firebase Authentication의 user 객체
 * @param {object} userData - Firestore의 users 컬렉션에서 가져온 프로필 데이터
 */
function initializeEditFeatures(user, userData) {
    // --- DOM 요소 가져오기 ---
    const imageUploadInput = document.getElementById('image-upload-input');
    const editImageBtn = document.getElementById('edit-image-btn');
    const displayNicknameWrapper = document.getElementById('display-nickname-wrapper');
    const editNicknameWrapper = document.getElementById('edit-nickname-wrapper');
    const editNicknameBtn = document.getElementById('edit-nickname-btn');
    const saveNicknameBtn = document.getElementById('save-nickname-btn');
    const cancelNicknameBtn = document.getElementById('cancel-nickname-btn');
    const editNicknameInput = document.getElementById('edit-nickname-input');
    const displayGradeWrapper = document.getElementById('display-grade-wrapper');
    const editGradeWrapper = document.getElementById('edit-grade-wrapper');
    const editGradeBtn = document.getElementById('edit-grade-btn');
    const saveGradeBtn = document.getElementById('save-grade-btn');
    const cancelGradeBtn = document.getElementById('cancel-grade-btn');
    const editGradeSelect = document.getElementById('edit-grade-select');

    // --- 프로필 이미지 수정 이벤트 리스너 ---
    editImageBtn.addEventListener('click', () => imageUploadInput.click());
    imageUploadInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const storageRef = ref(storage, `profile_images/${user.uid}`);
        
        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            await updateDoc(doc(db, "users", user.uid), { photoURL: downloadURL });
            await updateProfile(user, { photoURL: downloadURL }); // Auth 프로필도 업데이트
            document.getElementById('profile-image').src = downloadURL;
            alert('프로필 이미지가 변경되었습니다.');
        } catch (error) {
            console.error("이미지 업로드 오류:", error);
            alert('이미지 업로드에 실패했습니다.');
        }
    });

    // --- 닉네임 수정 UI 토글 및 저장 이벤트 리스너 ---
    editNicknameBtn.addEventListener('click', () => {
        displayNicknameWrapper.classList.add('hidden');
        editNicknameWrapper.classList.remove('hidden');
        editNicknameInput.value = userData.nickname;
        editNicknameInput.focus();
    });

    cancelNicknameBtn.addEventListener('click', () => {
        displayNicknameWrapper.classList.remove('hidden');
        editNicknameWrapper.classList.add('hidden');
    });

    saveNicknameBtn.addEventListener('click', async () => {
        const newNickname = editNicknameInput.value.trim();
        // TODO: 닉네임 중복 검사 로직 (추후 Cloud Function으로 구현)
        if (!newNickname || newNickname === userData.nickname) {
            cancelNicknameBtn.click();
            return;
        }

        try {
            await updateDoc(doc(db, "users", user.uid), { nickname: newNickname });
            userData.nickname = newNickname; // 화면 즉시 반영을 위해 로컬 데이터도 업데이트
            displayProfileData(userData); // 전체 프로필 다시 그리기
            alert('닉네임이 변경되었습니다.');
            cancelNicknameBtn.click(); // UI 원상복구
        } catch (error) {
            console.error("닉네임 변경 오류:", error);
            alert('닉네임 변경에 실패했습니다.');
        }
    });

    // --- 학년 수정 UI 토글 및 저장 이벤트 리스너 ---
    editGradeBtn.addEventListener('click', () => {
        displayGradeWrapper.classList.add('hidden');
        editGradeWrapper.classList.remove('hidden');
        editGradeSelect.value = userData.grade;
    });

    cancelGradeBtn.addEventListener('click', () => {
        displayGradeWrapper.classList.remove('hidden');
        editGradeWrapper.classList.add('hidden');
    });

    saveGradeBtn.addEventListener('click', async () => {
        const newGrade = editGradeSelect.value;
        if (!newGrade || newGrade === userData.grade) {
            cancelGradeBtn.click();
            return;
        }
        try {
            await updateDoc(doc(db, "users", user.uid), { grade: newGrade });
            userData.grade = newGrade;
            displayProfileData(userData);
            alert('학년 정보가 변경되었습니다.');
            cancelGradeBtn.click();
        } catch (error) {
            console.error("학년 변경 오류:", error);
            alert('학년 정보 변경에 실패했습니다.');
        }
    });
}


/**
 * 회원 탈퇴 버튼에 이벤트 리스너를 설정하는 함수
 * @param {object} user - Firebase Authentication의 user 객체
 * @param {object} userData - Firestore의 users 컬렉션에서 가져온 프로필 데이터
 */
function initializeDeleteFeature(user, userData) {
    const deleteBtn = document.getElementById('delete-account-btn');
    if (!deleteBtn) return;

    deleteBtn.addEventListener('click', async () => {
        const confirmation = prompt(`정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.\n확인하시려면 본인의 닉네임 '${userData.nickname}'을(를) 정확히 입력해주세요.`);
        if (confirmation !== userData.nickname) {
            alert('닉네임이 일치하지 않아 탈퇴가 취소되었습니다.');
            return;
        }

        try {
            // 1. Storage에서 프로필 이미지 삭제
            if (userData.photoURL && userData.photoURL.includes('firebasestorage')) {
                const storageRef = ref(storage, `profile_images/${user.uid}`);
                await deleteObject(storageRef).catch(err => console.error("Storage 이미지 삭제 오류(무시 가능):", err));
            }
            
            // 2. Firestore에서 프로필 문서 삭제
            await deleteDoc(doc(db, "users", user.uid));
            
            // TODO: 사용자가 작성한 모든 질문/답변을 삭제하는 로직은 Cloud Function으로 구현하는 것이 가장 좋습니다.

            // 3. Firebase Authentication에서 사용자 계정 삭제
            await deleteUser(user);
            
            alert('회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');
            window.location.href = '/index.html';

        } catch (error) {
            console.error("회원 탈퇴 처리 중 오류 발생:", error);
            if (error.code === 'auth/requires-recent-login') {
                alert('보안을 위해 다시 로그인한 후 회원 탈퇴를 시도해주세요.');
                signOut(auth);
            } else {
                alert(`회원 탈퇴에 실패했습니다: ${error.message}`);
            }
        }
    });
}
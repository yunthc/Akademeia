// src/pages/leaderboard.js
import { db } from '../firebase.js';
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { requireAuth } from '../auth.js'; // 공통 인증 로직 및 헤더 UI 업데이트

let currentUser = null;
let currentUserData = null;
let currentTab = 'arena';

requireAuth((user, userData) => {
    currentUser = user;
    currentUserData = userData;
    initializeLeaderboard();
});

function initializeLeaderboard() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // URL 파라미터에서 탭 정보 확인
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['arena', 'tower', 'sprint'].includes(tabParam)) {
        currentTab = tabParam;
    }

    tabButtons.forEach(btn => {
        // 초기 활성화 상태 설정
        if (btn.dataset.tab === currentTab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.tab;
            loadRanking(currentTab);
        });
    });

    // 초기 로드
    loadRanking(currentTab);
}

async function loadRanking(type) {
    const listContainer = document.getElementById('ranking-list');
    const myRecordSection = document.getElementById('my-record-section');
    
    listContainer.innerHTML = '<p class="loader" style="padding:20px; text-align:center;">랭킹을 불러오는 중...</p>';
    myRecordSection.innerHTML = '';
    myRecordSection.classList.add('hidden');

    try {
        let q, myQ;
        let renderRow;
        let headerHTML;

        if (type === 'arena') {
            q = query(collection(db, "users"), orderBy("rating", "desc"), limit(10));
            myQ = null; // 유저 프로필에 이미 rating이 있으므로 별도 쿼리 불필요
            
            headerHTML = `
                <div class="leaderboard-header">
                    <div class="rank">순위</div>
                    <div class="nickname">닉네임</div>
                    <div class="score">레이팅</div>
                    <div class="extra">학년</div>
                </div>`;
            
            renderRow = (data, rank) => `
                <div class="rank">${rank}</div>
                <div class="nickname">
                    <a href="/pages/user-profile.html?uid=${data.uid}" style="display:flex">
                        <img src="${data.photoURL || '/default-avatar.svg'}" alt="profile" class="leaderboard-avatar">
                    </a>
                    <a href="/pages/user-profile.html?uid=${data.uid}" class="profile-link-text">${data.nickname || '익명'}</a>
                </div>
                <div class="score">${Math.round(data.rating)}</div>
                <div class="extra">${data.grade || '-'}</div>
            `;

        } else if (type === 'tower') {
            q = query(collection(db, "tower_results"), orderBy("finalFloor", "desc"), orderBy("createdAt", "asc"), limit(10));
            myQ = query(collection(db, "tower_results"), where("uid", "==", currentUser.uid), orderBy("finalFloor", "desc"), limit(1));

            headerHTML = `
                <div class="leaderboard-header">
                    <div class="rank">순위</div>
                    <div class="nickname">닉네임</div>
                    <div class="score">최고 층수</div>
                    <div class="extra">날짜</div>
                </div>`;

            renderRow = (data, rank) => `
                <div class="rank">${rank}</div>
                <div class="nickname">
                    <a href="/pages/user-profile.html?uid=${data.uid}" style="display:flex">
                        <img src="${data.photoURL || '/default-avatar.svg'}" alt="profile" class="leaderboard-avatar">
                    </a>
                    <a href="/pages/user-profile.html?uid=${data.uid}" class="profile-link-text">${data.nickname || '익명'}</a>
                </div>
                <div class="score">${data.finalFloor}층</div>
                <div class="extra">${data.createdAt ? data.createdAt.toDate().toLocaleDateString() : '-'}</div>
            `;

        } else if (type === 'sprint') {
            // 정답 수 내림차순, 그 다음 시간 오름차순
            q = query(collection(db, "sprint_results"), orderBy("correctCount", "desc"), orderBy("finalTime", "asc"), limit(10));
            myQ = query(collection(db, "sprint_results"), where("uid", "==", currentUser.uid), orderBy("correctCount", "desc"), orderBy("finalTime", "asc"), limit(1));

            headerHTML = `
                <div class="leaderboard-header">
                    <div class="rank">순위</div>
                    <div class="nickname">닉네임</div>
                    <div class="score">기록 (남은 하트)</div>
                    <div class="extra">날짜</div>
                </div>`;

            renderRow = (data, rank) => {
                const mins = Math.floor(data.finalTime / 60);
                const secs = (data.finalTime % 60).toFixed(1);
                const timeStr = `${mins}:${secs.padStart(4, '0')}`;
                const livesStr = data.lives !== undefined ? ` (${'❤️'.repeat(Math.max(0, data.lives))})` : '';
                return `
                    <div class="rank">${rank}</div>
                    <div class="nickname">
                        <a href="/pages/user-profile.html?uid=${data.uid}" style="display:flex">
                            <img src="${data.photoURL || '/default-avatar.svg'}" alt="profile" class="leaderboard-avatar">
                        </a>
                        <a href="/pages/user-profile.html?uid=${data.uid}" class="profile-link-text">${data.nickname || '익명'}</a>
                    </div>
                    <div class="score">${timeStr}${livesStr}</div>
                    <div class="extra">${data.createdAt ? data.createdAt.toDate().toLocaleDateString() : '-'}</div>
                `;
            };
        }

        // 1. 랭킹 데이터 가져오기
        const querySnapshot = await getDocs(q);
        
        listContainer.innerHTML = headerHTML;
        
        if (querySnapshot.empty) {
            listContainer.innerHTML += '<p style="padding:20px; text-align:center;">데이터가 없습니다.</p>';
        } else {
            let rank = 1;
            querySnapshot.forEach(doc => {
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                item.innerHTML = renderRow(doc.data(), rank++);
                listContainer.appendChild(item);
            });
        }

        // 2. 내 최고 기록 가져오기
        if (type === 'arena') {
            displayMyRecord('내 레이팅', `${Math.round(currentUserData.rating)}점`);
        } else if (myQ) {
            const mySnapshot = await getDocs(myQ);
            if (!mySnapshot.empty) {
                const myData = mySnapshot.docs[0].data();
                let valueText = '';
                if (type === 'tower') valueText = `${myData.finalFloor}층`;
                if (type === 'sprint') {
                    const mins = Math.floor(myData.finalTime / 60);
                    const secs = (myData.finalTime % 60).toFixed(1);
                    const livesStr = myData.lives !== undefined ? ` (${'❤️'.repeat(Math.max(0, myData.lives))})` : '';
                    valueText = `${mins}:${secs.padStart(4, '0')}${livesStr}`;
                }
                displayMyRecord('내 최고 기록', valueText);
            } else {
                displayMyRecord('내 최고 기록', '기록 없음');
            }
        }

    } catch (error) {
        console.error("랭킹 로드 실패:", error);
        listContainer.innerHTML = '<p style="color:red; padding:20px; text-align:center;">랭킹을 불러오는 중 오류가 발생했습니다.</p>';
        if (error.code === 'failed-precondition') {
             listContainer.innerHTML += '<p style="color:red; font-size:0.8rem; text-align:center;">(인덱스 생성 필요: 콘솔 확인)</p>';
        }
    }
}

function displayMyRecord(title, value) {
    const section = document.getElementById('my-record-section');
    section.innerHTML = `
        <div class="my-record-card">
            <h3>${title}</h3>
            <div class="record-value">${value}</div>
        </div>
    `;
    section.classList.remove('hidden');
}
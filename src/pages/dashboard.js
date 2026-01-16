import { requireAuth } from '../auth.js'; // 헤더 렌더링 및 공통 인증 로직

const quotes = [
    {
        quote: "수학은 신이 만든 우주의 언어이다.",
        author: "갈릴레오 갈릴레이"
    },
    {
        quote: "수학의 본질은 그 자유로움에 있다.",
        author: "게오르크 칸토어"
    },
    {
        quote: "수학은 과학의 여왕이고, 정수론은 수학의 여왕이다.",
        author: "카를 프리드리히 가우스"
    },
    {
        quote: "나에게 하나의 지렛대와 그것을 놓을 자리를 달라. 그러면 나는 지구를 움직여 보이겠다.",
        author: "아르키메데스"
    },
    {
        quote: "나는 생각한다, 고로 존재한다.",
        author: "르네 데카르트"
    }
];

function displayRandomQuote() {
    const quoteContainer = document.getElementById('quote-display');
    if (quoteContainer) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteContainer.innerHTML = `&ldquo;${randomQuote.quote}&rdquo; <br><em>- ${randomQuote.author}</em>`;
    }
}

requireAuth((user, userData) => {
    const nicknameEl = document.getElementById('dashboard-nickname');
    if (nicknameEl) {
        nicknameEl.textContent = userData.nickname;
    }
});

displayRandomQuote();
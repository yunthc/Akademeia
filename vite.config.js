// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'pages/index.html'),
        dashboard: resolve(__dirname, 'pages/dashboard.html'),
        profile: resolve(__dirname, 'pages/profile.html'),
        qna: resolve(__dirname, 'pages/qna.html'),
        question: resolve(__dirname, 'pages/question.html'),
        mypage: resolve(__dirname, 'pages/mypage.html'),
        generatequestion: resolve(__dirname, 'pages/generatequestion.html'),
        // ▼▼▼ 수정 및 추가 ▼▼▼
        matchmaking: resolve(__dirname, 'pages/matchmaking.html'),
        
        leaderboard: resolve(__dirname, 'pages/leaderboard.html'), // <-- 추가
        arena: resolve(__dirname, 'pages/arena.html'), // <-- 추가
        'grand-arena': resolve(__dirname, 'pages/grand-arena.html'), // <-- 추가
        sprint: resolve(__dirname, 'pages/sprint.html'), // <-- 추가
        tower: resolve(__dirname, 'pages/tower.html'),
        'user-profile': resolve(__dirname, 'pages/user-profile.html'),
        'add-problem': resolve(__dirname, 'pages/add-problem.html'),
        'admin-dashboard': resolve(__dirname, 'pages/admin/dashboard.html'),
        'admin-users': resolve(__dirname, 'pages/admin/users.html'),
        'admin-content': resolve(__dirname, 'pages/admin/content.html'),
        'admin-setting': resolve(__dirname, 'pages/admin/setting.html'),
        },
    },
  },
  server: {
    open: '/pages/index.html',
    headers: { 'Cross-Origin-Opener-Policy': 'same-origin-allow-popups' },
  },
})
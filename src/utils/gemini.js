import { functions } from '../firebase.js'; // firebase 설정 파일 경로 확인!
import { httpsCallable } from 'firebase/functions';

// ▼▼▼ 여기에 'export'가 반드시 있어야 합니다! ▼▼▼
export async function generateIsomorphicQuestion(originalProblem, difficulty = 'middle') {
    try {
        // Cloud Functions의 함수 이름과 일치해야 함 (functions/index.js에 정의된 이름)
        const generateFn = httpsCallable(functions, 'generateProblem');

        console.log(`[Gemini] 서버에 요청 보냄 (난이도: ${difficulty})`);

        const result = await generateFn({ 
            latex: originalProblem, 
            difficulty: difficulty 
        });

        console.log("[Gemini] 서버 응답 도착:", result.data);

        // 서버에서 성공 여부를 { success: true, data: ... } 형태로 준다면:
        if (result.data && result.data.success) {
            // JSON 파싱 (혹시 문자열로 왔을 경우 대비)
            let parsedData = result.data.data;
            if (typeof parsedData === 'string') {
                // 가끔 AI가 마크다운 코드블럭(```json ... ```)을 붙여서 줄 때 제거용
                const cleanJson = parsedData.replace(/```json|```/g, '').trim();
                parsedData = JSON.parse(cleanJson);
            }
            return parsedData;
        } 
        // 만약 서버가 바로 데이터를 준다면 (구조에 따라 다름):
        else if (result.data) {
             let parsedData = result.data;
             if (typeof parsedData === 'string') {
                const cleanJson = parsedData.replace(/```json|```/g, '').trim();
                parsedData = JSON.parse(cleanJson);
            }
            return parsedData;
        }
        else {
            throw new Error("서버 응답 형식이 올바르지 않습니다.");
        }

    } catch (error) {
        console.error("[Gemini] 호출 실패:", error);
        throw error;
    }
}
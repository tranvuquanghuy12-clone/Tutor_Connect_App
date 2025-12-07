import { GoogleGenAI, Type } from "@google/genai";
import { Tutor } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * matchesTutors: Takes a user query and the list of tutors, 
 * returns a ranked list of tutor IDs based on relevance.
 */
export const matchTutors = async (userQuery: string, tutors: Tutor[]): Promise<string[]> => {
  if (!userQuery.trim()) return tutors.map(t => t.id);

  try {
    const tutorSummaries = tutors.map(t => ({
      id: t.id,
      info: `${t.name} (${t.school}). Môn: ${t.subjects.join(', ')}. Transcript: ${t.transcript.map(tr => tr.subject).join(', ')}. Bio: ${t.bio}.`
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        User query: "${userQuery}"
        
        Available Tutors:
        ${JSON.stringify(tutorSummaries)}
        
        Task: 
        1. Identify which tutors match the user's request, specifically focusing on the SUBJECTS they teach.
        2. If the user asks for a specific subject (e.g., "Math", "Triết", "IT"), ONLY return tutors who teach that subject or related subjects.
        3. Rank the matching tutors by relevance.
        4. Exclude tutors that are completely irrelevant to the query.
        
        Return ONLY a JSON object with a property "rankedIds" containing the array of tutor IDs strings.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rankedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result.rankedIds || [];

  } catch (error) {
    console.error("Gemini matching error:", error);
    // Fallback: Return nothing so local filter takes over, or return all
    return [];
  }
};

/**
 * chatWithAdvisor: A simple chat function to get advice on finding a tutor.
 */
export const chatWithAdvisor = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `Bạn là trợ lý ảo của ứng dụng TutorConnect. 
        Nhiệm vụ của bạn là tư vấn cho học sinh/phụ huynh tìm gia sư phù hợp.
        Hãy hỏi về môn học, trình độ, khu vực, và ngân sách nếu họ chưa cung cấp.
        Giữ câu trả lời ngắn gọn, thân thiện, dùng tiếng Việt.
        Không bịa ra thông tin gia sư cụ thể nếu không có trong context, chỉ đưa ra lời khuyên chung.`
      },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "Xin lỗi, hiện tại tôi đang gặp chút sự cố kết nối. Bạn hãy thử lại sau nhé!";
  }
};
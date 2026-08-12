/**
 * Gemini API Integration - Direct Implementation
 * استخدام Gemini API مباشرة بدون Manus
 */

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return key;
};

const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-flash-latest"];

export function getGeminiModelCandidates(preferredModel: string) {
  return [preferredModel, ...FALLBACK_MODELS].filter((model, index, models) => models.indexOf(model) === index);
}

export async function invokeGemini(messages: any[], model: string = 'gemini-3.5-flash') {
  const apiKey = getApiKey();
  
  // تحويل صيغة الرسائل من OpenAI إلى Gemini
  const contents = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

  // إضافة system prompt كـ أول رسالة
  const systemMessage = messages.find(msg => msg.role === 'system');
  const systemPrompt = systemMessage?.content || '';

  const payload = {
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.45,
      topP: 0.95,
      topK: 40,
      // سقف أعلى من الرد القصير المعتاد لمنع توقف الجملة عند حد الإخراج.
      // لا يعني ذلك أن النموذج سيكتب أو يستهلك هذا العدد ما لم يخرج نصاً أطول.
      maxOutputTokens: 480
    }
  };

  let lastError: Error | null = null;
  for (const candidateModel of getGeminiModelCandidates(model)) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidateModel}:generateContent?key=${apiKey}`;
    console.log('[Gemini] Using model:', candidateModel);
    console.log('[Gemini] Sending request...');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('[Gemini] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Gemini Error]', errorData);
      const error = new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
      if (response.status === 429 || response.status >= 500) {
        lastError = error;
        console.warn(`[Gemini] Retrying with a fallback after ${candidateModel} was unavailable.`);
        continue;
      }
      throw error;
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const reply = data.candidates[0].content.parts[0].text;
      console.log('[Gemini] Success - Got response');
      
      return {
        choices: [
          {
            message: {
              content: reply,
              role: 'assistant'
            }
          }
        ],
        model: candidateModel,
        finishReason: data.candidates[0]?.finishReason,
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
    } else {
      lastError = new Error('No content in Gemini response');
    }
  }

  console.error('[Gemini Error]', lastError);
  throw lastError || new Error('No Gemini model returned content');
}

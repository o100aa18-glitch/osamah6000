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

export async function invokeGemini(messages: any[], model: string = 'gemini-2.5-flash') {
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  console.log('[Gemini] Using model:', model);
  console.log('[Gemini] Sending request...');

  const payload = {
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024
    }
  };

  try {
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
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
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
        model: model,
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
    } else {
      throw new Error('No content in Gemini response');
    }
  } catch (error) {
    console.error('[Gemini Error]', error);
    throw error;
  }
}

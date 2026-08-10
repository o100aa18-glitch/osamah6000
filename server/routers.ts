import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeGemini } from "./_core/llm-gemini";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // AI Chat with Osama Al-Baawi
  chat: router({
    sendMessage: publicProcedure
      .input(z.object({
        message: z.string().min(1),
        conversationHistory: z.array(z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string()
        })).optional()
      }))
      .mutation(async ({ input }) => {
        // قاموس الخدمات مع الصور
        const servicesDatabase = {
          'فيش': { name: 'تركيب فيش', price: '40-70', image: '/manus-storage/electricity-01-bulb-candle_5641c379.png' },
          'مفتاح': { name: 'تركيب مفتاح', price: '30-60', image: '/manus-storage/electricity-02-switch_5641c379.png' },
          'لمبة': { name: 'تركيب لمبة', price: '20-40', image: '/manus-storage/electricity-03-bulb_5641c379.png' },
        };
        
        // فهم الخدمة من الرسالة
        const messageText = input.message.toLowerCase();
        let serviceResponse = '';
        for (const [keyword, service] of Object.entries(servicesDatabase)) {
          if (messageText.includes(keyword)) {
            serviceResponse = `\n![${service.name}](${service.image})\nهل تقصد: **${service.name}** (${service.price} ريال)؟`;
            break;
          }
        }
        
        // استخدام gemini-3.5-flash
        const selectedModel = 'gemini-3.5-flash';
        
        const systemPrompt = `أنت مساعد ذكي باسم مهندس أسامة البعوي (م/أسامة البعوي). تقدم استشارات هندسية متخصصة وخدمات متعلقة بـ:

1. **الكهرباء**: تركيب الأفياش، المفاتيح، النجف، الإضاءة، الصيانة الكهربائية
2. **السباكة والصرف الصحي**: تركيب الخلاطات، السخانات، تسليك المجاري، الصيانة
3. **التكييف**: غسيل المكيفات، تعبئة الفريون، الصيانة، إصلاح الأعطال
4. **الكاميرات والأنظمة**: تركيب الكاميرات، أنظمة المراقبة، الأقفال الذكية
5. **الديكور والتركيبات**: تركيب الشاشات، الستائر، الأثاث، الرفوف

**تعليمات مهمة جداً:**
- رد مباشر وموجز من معلومات الموقع فقط
- لا تخرج عن موضوع الخدمات
- استخدم العربية الفصحى فقط
- كن ودياً واحترافياً
- رد قصير (جملة أو جملتين فقط)
- إذا لم تعرف الإجابة، قل: عذراً، ليس لدي هذه المعلومة`;
        
        const messages = [
          { role: 'system' as const, content: systemPrompt },
          ...(input.conversationHistory || []),
          { role: 'user' as const, content: input.message }
        ];
        
        try {
          const response = await invokeGemini(messages as any, 'gemini-3.5-flash');
          
          const reply = response?.choices?.[0]?.message?.content || 'عذراً، حدث خطأ في الرد. يرجى المحاولة مجدداً.';
          const finalReply = serviceResponse ? reply + serviceResponse : reply;
          
          return {
            success: true,
            reply: finalReply,
            timestamp: new Date(),
            model: 'gemini-3.5-flash' as const
          };
        } catch (error: any) {
          console.error('[Chat Error]', error);
          console.error('[Model: gemini-3.5-flash]', error?.message || 'Unknown error');
          return {
            success: false,
            reply: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مجدداً لاحقاً.',
            timestamp: new Date(),
            model: 'gemini-1.5-flash' as const
          };
        }
      })
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;

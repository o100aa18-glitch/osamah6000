import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeGemini } from "./_core/llm-gemini";
import { buildChatSystemPrompt, CHAT_MODEL, normalizeConversationHistory, sanitizeClientReply } from "./chatAssistant";
import { buildCompositePricingReply } from "./compositeOrderPricing";
import { buildBookingReply } from "./bookingAssistant";

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
        const systemPrompt = buildChatSystemPrompt();
        const conversationHistory = normalizeConversationHistory(input.conversationHistory);
        const compositePricingReply = buildCompositePricingReply(conversationHistory, input.message);

        if (compositePricingReply) {
          return {
            success: true,
            reply: compositePricingReply,
            timestamp: new Date(),
            model: CHAT_MODEL,
          };
        }

        const bookingReply = buildBookingReply(conversationHistory, input.message);
        if (bookingReply) {
          return {
            success: true,
            reply: bookingReply,
            timestamp: new Date(),
            model: CHAT_MODEL,
          };
        }

        const messages = [
          { role: 'system' as const, content: systemPrompt },
          ...conversationHistory,
          { role: 'user' as const, content: input.message }
        ];
        
        try {
          const response = await invokeGemini(messages as any, CHAT_MODEL);
          
          const rawReply = response?.choices?.[0]?.message?.content || 'لم يصلني رد واضح هذه المرة. اكتب طلبك مرة أخرى بتفصيل بسيط وسأساعدك.';
          const reply = sanitizeClientReply(rawReply);
          
          return {
            success: true,
            reply: reply,
            timestamp: new Date(),
            model: CHAT_MODEL
          };
        } catch (error: any) {
          console.error('[Chat Error]', error);
          console.error(`[Model: ${CHAT_MODEL}]`, error?.message || 'Unknown error');
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

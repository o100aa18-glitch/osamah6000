import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeGemini } from "./_core/llm-gemini";
import { buildChatSystemPrompt, CHAT_MODEL, normalizeConversationHistory, sanitizeClientReply } from "./chatAssistant";
import { buildCompositePricingReply } from "./compositeOrderPricing";
import { buildBookingReply } from "./bookingAssistant";
import { extractCompletedBookingDetails } from "./bookingAssistant";
import { buildTechnicalGuidanceReply } from "./technicalGuidance";
import { createHash, randomUUID } from "crypto";
import { createOrGetBookingRequest, markBookingWhatsAppOpened } from "./db";

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
        const technicalGuidanceReply = buildTechnicalGuidanceReply(input.message);

        if (technicalGuidanceReply) {
          return {
            success: true,
            reply: technicalGuidanceReply,
            timestamp: new Date(),
            model: CHAT_MODEL,
          };
        }
        const compositePricingReply = buildCompositePricingReply(conversationHistory, input.message);

        if (compositePricingReply) {
          return {
            success: true,
            reply: compositePricingReply,
            timestamp: new Date(),
            model: CHAT_MODEL,
          };
        }

        const completedBooking = extractCompletedBookingDetails(conversationHistory, input.message);
        if (completedBooking) {
          try {
            const requestKey = createHash("sha256")
              .update(JSON.stringify(completedBooking))
              .digest("hex");
            const reference = `OS-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 5).toUpperCase()}`;
            const booking = await createOrGetBookingRequest({ ...completedBooking, requestKey, reference });
            return {
              success: true,
              reply: `تم إنشاء طلبك برقم ${booking.reference}. راجع الملخص ثم أرسله إلى واتساب لتصل التفاصيل إلى الفني.`,
              booking: {
                reference: booking.reference,
                serviceSummary: booking.serviceSummary,
                requestDescription: booking.requestDescription,
                area: booking.area,
                appointmentText: booking.appointmentText,
                customerName: booking.customerName,
                customerPhone: booking.customerPhone,
              },
              timestamp: new Date(),
              model: CHAT_MODEL,
            };
          } catch (error) {
            console.error("[Booking] Failed to save request", error);
            return {
              success: false,
              reply: "تعذر حفظ الطلب الآن. أرسل التفاصيل عبر واتساب أو حاول مرة أخرى بعد قليل.",
              timestamp: new Date(),
              model: CHAT_MODEL,
            };
          }
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
          
          const rawReply = response?.choices?.[0]?.message?.content || '';
          const reply = response?.finishReason === 'MAX_TOKENS'
            ? 'لم تكتمل التفاصيل لدي. اكتب طلبك مرة أخرى باختصار وسأجيبك بجملة واضحة.'
            : sanitizeClientReply(rawReply || 'لم يصلني رد واضح هذه المرة. اكتب طلبك مرة أخرى بتفصيل بسيط وسأساعدك.');
          
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

  booking: router({
    markWhatsAppOpened: publicProcedure
      .input(z.object({ reference: z.string().min(5).max(40) }))
      .mutation(async ({ input }) => {
        await markBookingWhatsAppOpened(input.reference);
        return { success: true };
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;

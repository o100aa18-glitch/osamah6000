import { beforeEach, describe, expect, it, vi } from "vitest";

const { createOrGetBookingRequestMock, markBookingWhatsAppOpenedMock } = vi.hoisted(() => ({
  createOrGetBookingRequestMock: vi.fn(),
  markBookingWhatsAppOpenedMock: vi.fn(),
}));

vi.mock("./db", () => ({
  createOrGetBookingRequest: createOrGetBookingRequestMock,
  markBookingWhatsAppOpened: markBookingWhatsAppOpenedMock,
}));

import { appRouter } from "./routers";

describe("real booking chat flow", () => {
  beforeEach(() => {
    createOrGetBookingRequestMock.mockReset();
    markBookingWhatsAppOpenedMock.mockReset();
  });

  it("creates an independent request only after all booking details are present", async () => {
    createOrGetBookingRequestMock.mockResolvedValue({
      reference: "OS-TEST-12345",
      serviceSummary: "تركيب خلاط مغسلة",
      requestDescription: "أبي أحجز تركيب خلاط مغسلة",
      area: "حي الصفا",
      appointmentText: "غداً مساء",
      customerName: "أسامة",
      customerPhone: "0550309736",
    });
    const caller = appRouter.createCaller({ req: {}, res: {}, user: null } as any);
    const result = await caller.chat.sendMessage({
      message: "0550309736",
      conversationHistory: [
        { role: "user", content: "أبي أحجز تركيب خلاط مغسلة" },
        { role: "assistant", content: "أي حي مناسب لك؟" },
        { role: "user", content: "حي الصفا غداً مساء" },
        { role: "assistant", content: "أرسل اسمك ورقمك للتأكيد." },
        { role: "user", content: "أسامة" },
      ],
    });

    expect(createOrGetBookingRequestMock).toHaveBeenCalledOnce();
    expect(result.success).toBe(true);
    expect("booking" in result && result.booking).toEqual({
      reference: "OS-TEST-12345",
      serviceSummary: "تركيب خلاط مغسلة",
      requestDescription: "أبي أحجز تركيب خلاط مغسلة",
      area: "حي الصفا",
      appointmentText: "غداً مساء",
      customerName: "أسامة",
      customerPhone: "0550309736",
    });
  });

  it("marks only the referenced request when the customer opens WhatsApp", async () => {
    markBookingWhatsAppOpenedMock.mockResolvedValue(undefined);
    const caller = appRouter.createCaller({ req: {}, res: {}, user: null } as any);

    await expect(caller.booking.markWhatsAppOpened({ reference: "OS-TEST-12345" }))
      .resolves.toEqual({ success: true });
    expect(markBookingWhatsAppOpenedMock).toHaveBeenCalledWith("OS-TEST-12345");
  });
});

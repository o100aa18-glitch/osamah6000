import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send, ExternalLink } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Streamdown } from 'streamdown';
import { ModelViewer } from './ModelViewer';

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    booking?: {
      reference: string;
      serviceSummary: string;
      requestDescription: string;
      area: string;
      appointmentText: string;
      customerName: string;
      customerPhone: string;
    };
  }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatMutation = trpc.chat.sendMessage.useMutation();
  const markWhatsAppOpenedMutation = trpc.booking.markWhatsAppOpened.useMutation();
  const WHATSAPP_NUMBER = '966575442802';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatMutation.mutateAsync({
        message: userMessage,
        conversationHistory: messages
      });

      if (response.success) {
        const booking = 'booking' in response ? response.booking : undefined;
        setMessages(prev => [...prev, { role: 'assistant', content: response.reply, booking }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '<span translate="no">عذراً، حدث خطأ في الاتصال. يرجى المحاولة مجدداً.</span>'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendBookingToWhatsApp = (booking: NonNullable<(typeof messages)[number]['booking']>) => {
    const text = [
      `طلب خدمة جديد | رقم ${booking.reference}`,
      `الخدمة: ${booking.serviceSummary}`,
      `وصف العميل: ${booking.requestDescription}`,
      `الحي: ${booking.area}`,
      `الموعد: ${booking.appointmentText}`,
      `العميل: ${booking.customerName}`,
      `الجوال: ${booking.customerPhone}`,
    ].join('\n');
    void markWhatsAppOpenedMutation.mutateAsync({ reference: booking.reference }).catch(() => undefined);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Interactive 3D Robot */}
      {!isOpen ? (
        <ModelViewer onClick={() => setIsOpen(true)} />
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="fixed bottom-6 left-6 z-[10000] w-10 h-10 rounded-full bg-slate-900/80 text-white shadow-lg flex items-center justify-center hover:bg-slate-800 transition-colors"
          title="إغلاق مساعد AI OSAMAH711X"
          aria-label="إغلاق مساعد AI OSAMAH711X"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-40 left-8 z-40 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" dir="rtl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <h3 className="font-bold text-lg" translate="no">AI OSAMAH711X</h3>
            <p className="text-sm text-blue-100" translate="no">استشارات هندسية متخصصة</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-2" translate="no">مرحباً! أنا مساعد م/أسامة البعوي الذكي</p>
                <p className="text-sm" translate="no">كيف يمكنني مساعدتك اليوم؟</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-100 text-gray-900'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <>
                      <Streamdown>{msg.content}</Streamdown>
                      {msg.booking && (
                        <div className="mt-3 rounded-xl border border-white/30 bg-white/15 p-3 text-right text-sm">
                          <p className="font-bold">ملخص الطلب: {msg.booking.reference}</p>
                          <p className="mt-1">{msg.booking.serviceSummary}</p>
                          <p className="text-white/85">{msg.booking.requestDescription}</p>
                          <p>{msg.booking.area} — {msg.booking.appointmentText}</p>
                          <button
                            type="button"
                            onClick={() => sendBookingToWhatsApp(msg.booking!)}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-3 py-2 font-bold text-white transition hover:bg-green-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span translate="no">إرسال طلبي إلى واتساب</span>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب رسالتك..." translate="no"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

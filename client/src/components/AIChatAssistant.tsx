import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Streamdown } from 'streamdown';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: any }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const generateWhatsAppMessage = () => {
    const itemsList = orderItems.map(item => 
      `${item.name}: ${item.price} ريال x ${item.quantity}`
    ).join('\n');
    
    const total = calculateTotal();
    return `طلب جديد من الموقع:\n\n${itemsList}\n\nالإجمالي: ${total} ريال`;
  };
  
  const sendToWhatsApp = () => {
    if (orderItems.length === 0) return;
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/966575442802?text=${encodedMessage}`, '_blank');
  };
  
  const chatMutation = trpc.chat.sendMessage.useMutation();

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
        setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
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

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-8 z-40 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
        title="مساعد م/أسامة البعوي الذكي" translate="no"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-40 left-8 z-40 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" dir="rtl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <h3 className="font-bold text-lg" translate="no">مساعد م/أسامة البعوي الذكي</h3>
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
                    <Streamdown>{msg.content}</Streamdown>
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

          {/* Order Summary */}
          {orderItems.length > 0 && (
            <div className="border-t border-gray-200 p-3 bg-blue-50">
              <p className="text-sm font-bold mb-2" translate="no">الطلب الحالي:</p>
              {orderItems.map((item, idx) => (
                <div key={idx} className="text-sm text-gray-700 flex justify-between mb-1">
                  <span>{item.name}</span>
                  <span>{item.price} ريال × {item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-gray-300 mt-2 pt-2 font-bold flex justify-between">
                <span>الإجمالي:</span>
                <span>{calculateTotal()} ريال</span>
              </div>
              <Button
                onClick={sendToWhatsApp}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                إرسال للفني عبر الواتساب
              </Button>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك هنا..." translate="no"
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

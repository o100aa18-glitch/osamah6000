import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  Zap, 
  Droplets, 
  Wind, 
  Camera, 
  Plus, 
  X, 
  ShoppingCart, 
  Trash2, 
  CheckCircle2,
  ChevronRight,
  Palette,
  Monitor
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Professional SVG Icons for Social Media
const SocialIcons = {
  facebook: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  tiktok: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.7a2.4 2.4 0 0 1-2.4 2.4 2.4 2.4 2.4 0 0 1 2.4-2.4 2.4 2.4 0 0 1 2.4-2.4c.34 0 .67.05.98.15V9.48a6.5 6.5 0 0 0-.98-.08 6.8 6.8 0 1 0 6.8 6.8v-3.33a4.49 4.49 0 0 0 3.77 1.98v-3.66z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.89.266-1.688.616-2.34 1.285-.656.656-1.015 1.45-1.287 2.34-.266.78-.47 1.713-.57 2.993C.04 8.333.025 8.74 0 12c0 3.26.015 3.667.072 4.947.06 1.277.261 2.148.528 2.927.266.79.604 1.45 1.272 2.097.661.662 1.325 1.004 2.344 1.272.78.267 1.85.47 3.127.528 1.28.06 1.688.072 4.947.072s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.927-.528.79-.268 1.45-.61 2.097-1.272.662-.662 1.015-1.325 1.287-2.344.267-.78.47-1.85.528-3.127.06-1.28.072-1.688.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.528-2.927-.268-.79-.604-1.45-1.272-2.097-.662-.661-1.325-1.004-2.344-1.272-.78-.267-1.85-.47-3.127-.528C15.667.04 15.26.025 12 0zm0 2.16c3.203 0 3.585.009 4.849.07 1.171.054 1.805.244 2.227.408.56.217.96.477 1.382.896.419.42.679.822.896 1.381.164.422.354 1.057.408 2.227.061 1.264.07 1.646.07 4.849 0 3.203-.009 3.585-.07 4.849-.054 1.171-.244 1.805-.408 2.227-.217.56-.477.96-.896 1.382-.42.419-.822.679-1.381.896-.422.164-1.057.354-2.227.408-1.264.061-1.646.07-4.849.07-3.203 0-3.585-.009-4.849-.07-1.171-.054-1.805-.244-2.227-.408-.56-.217-.96-.477-1.382-.896-.419-.42-.679-.822-.896-1.381-.164-.422-.354-1.057-.408-2.227-.061-1.264-.07-1.646-.07-4.849 0-3.203.009-3.585.07-4.849.054-1.171.244-1.805.408-2.227.217-.56.477-.96.896-1.382.42-.419.822-.679 1.381-.896.422-.164 1.057-.354 2.227-.408 1.264-.061 1.646-.07 4.849-.07z"/>
      <circle cx="12" cy="12" r="3.846"/>
      <circle cx="18.613" cy="5.387" r=".923"/>
    </svg>
  ),
  youtube: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  snapchat: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22.5C6.2 22.5 1.5 17.8 1.5 12S6.2 1.5 12 1.5 22.5 6.2 22.5 12 17.8 22.5 12 22.5zm4.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-9 0c.83 0 1.5-.67 1.5-1.5S8.33 9 7.5 9 6 9.67 6 10.5 6.67 12 7.5 12zm4.5 5.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
    </svg>
  ),
  x: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.627l-5.1-6.694-5.867 6.694h-3.306l7.73-8.835L.316 2.25h6.888l4.59 6.062L17.77 2.25h.474zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.81 0-9.728h3.554v1.375c.427-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.385 3.704 4.362v5.586zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.71 0-.956.77-1.71 1.954-1.71 1.184 0 1.915.754 1.94 1.71 0 .952-.756 1.71-1.979 1.71zm1.581 11.019H3.757V9.724h3.161v10.728zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
    </svg>
  ),
  whatsapp: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.171l-.346.205-3.576.656 1.235-3.116L4.9 3.71a9.847 9.847 0 1413.6 4.482c.51 0 1.01-.045 1.499-.135z"/>
    </svg>
  ),
};

interface ServiceItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface CartItem extends ServiceItem {
  quantity: number;
}

interface ServiceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  services: ServiceItem[];
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const WHATSAPP_NUMBER = "966575442802";

  const socialLinks: Array<{name: string; username: string; icon: string; url: string; color: string; image?: string}> = [
    { name: "فيسبوك", username: "osamah711x", icon: "facebook", url: "https://www.facebook.com/osamah711x", color: "from-blue-600 to-blue-400" },
    { name: "تيك توك", username: "osamah711x", icon: "tiktok", url: "https://www.tiktok.com/@osamah711x", color: "from-gray-900 to-gray-700" },
    { name: "إنستجرام", username: "osamah711x", icon: "instagram", url: "https://www.instagram.com/osamah711x", color: "from-pink-500 to-rose-400" },
    { name: "يوتيوب", username: "osamah711x", icon: "youtube", url: "https://www.youtube.com/@osamah711x", color: "from-red-600 to-red-500" },
    { name: "سناب شات", username: "osamah711xx", icon: "snapchat", url: "https://www.snapchat.com/add/osamah711xx", color: "from-yellow-400 to-yellow-300" },
    { name: "X", username: "osamah711x", icon: "x", url: "https://www.x.com/osamah711x", color: "from-gray-800 to-gray-600" },
    { name: "LinkedIn", username: "osamah711x", icon: "linkedin", url: "https://www.linkedin.com/in/osamah711x", color: "from-blue-700 to-blue-500" },
    { name: "واتس آب", username: "00966575442802", icon: "whatsapp", url: "https://wa.me/966575442802", color: "from-green-600 to-green-400" },
  ];

  const serviceCategories: ServiceCategory[] = [
    {
      id: "electricity",
      title: "خدمات الكهرباء",
      icon: <Zap className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-600",
      services: [
        { id: "e1", category: "الكهرباء", name: "تغيير لمبة شمعة / حباب", price: "5 - 10 ريال", image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=400&fit=crop" },
        { id: "e2", category: "الكهرباء", name: "تركيب غطاء فيش / حماية", price: "5 - 10 ريال", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=400&fit=crop" },
        { id: "e3", category: "الكهرباء", name: "تغيير فيش / مفتاح عادي", price: "15 - 20 ريال", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=400&fit=crop" },
        { id: "e4", category: "الكهرباء", name: "تركيب سبوت لايت", price: "10 - 15 ريال", image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=400&fit=crop" },
        { id: "e5", category: "الكهرباء", name: "كشف التماس وأعطال", price: "150 - 250 ريال", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=400&fit=crop" },
        { id: "e6", category: "الكهرباء", name: "تجميع طبلون كهرباء", price: "250 - 500 ريال", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=400&fit=crop" },
      ]
    },
    {
      id: "plumbing",
      title: "خدمات السباكة",
      icon: <Droplets className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-600",
      services: [
        { id: "p1", category: "السباكة", name: "تركيب خلاط دش / مغسلة", price: "50 - 80 ريال", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=400&fit=crop" },
        { id: "p2", category: "السباكة", name: "تغيير رأس دش / سماعة", price: "20 - 30 ريال", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=400&fit=crop" },
        { id: "p3", category: "السباكة", name: "تركيب سخان مياه", price: "80 - 130 ريال", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=400&fit=crop" },
        { id: "p4", category: "السباكة", name: "تركيب كرسي فرنجي", price: "120 - 180 ريال", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=400&fit=crop" },
        { id: "p5", category: "السباكة", name: "تركيب فلتر مياه 7 مراحل", price: "100 - 150 ريال", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=400&fit=crop" },
        { id: "p6", category: "السباكة", name: "تسليك انسداد مجاري", price: "100 - 250 ريال", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=400&fit=crop" },
      ]
    },
    {
      id: "ac",
      title: "خدمات التكييف",
      icon: <Wind className="w-8 h-8" />,
      color: "from-teal-400 to-blue-500",
      services: [
        { id: "ac1", category: "التكييف", name: "غسيل مكيف سبليت", price: "120 ريال", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop" },
        { id: "ac2", category: "التكييف", name: "تعبئة فريون كامل", price: "250 ريال", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop" },
        { id: "ac3", category: "التكييف", name: "تركيب مكيف سبليت", price: "350 ريال", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop" },
        { id: "ac4", category: "التكييف", name: "صيانة مكيف شباك", price: "80 ريال", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop" },
      ]
    },
    {
      id: "security",
      title: "كاميرات وأنظمة",
      icon: <Camera className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-600",
      services: [
        { id: "s1", category: "الكاميرات", name: "تركيب كاميرا مراقبة", price: "150 ريال", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=400&fit=crop" },
        { id: "s2", category: "الكاميرات", name: "برمجة وتشغيل الكاميرا", price: "50 ريال", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=400&fit=crop" },
        { id: "s3", category: "الكاميرات", name: "تركيب قفل باب ذكي", price: "300 ريال", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=400&fit=crop" },
        { id: "s4", category: "الكاميرات", name: "تركيب انتركوم منزلي", price: "250 ريال", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=400&fit=crop" },
      ]
    },
    {
      id: "decor",
      title: "ديكورات وتركيبات",
      icon: <Palette className="w-8 h-8" />,
      color: "from-pink-500 to-rose-600",
      services: [
        { id: "d1", category: "الديكور", name: "تركيب لوحات جدارية", price: "15 - 30 ريال", image: "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400&h=400&fit=crop" },
        { id: "d2", category: "الديكور", name: "تركيب أرفف خشبية", price: "30 - 60 ريال", image: "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400&h=400&fit=crop" },
        { id: "d3", category: "الديكور", name: "تركيب حامل شاشة", price: "50 - 100 ريال", image: "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400&h=400&fit=crop" },
        { id: "d4", category: "الديكور", name: "تركيب ستائر رول", price: "40 - 70 ريال", image: "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400&h=400&fit=crop" },
        { id: "d5", category: "الديكور", name: "تركيب مرايا جدارية", price: "40 - 80 ريال", image: "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400&h=400&fit=crop" },
      ]
    }
  ];

  const addToCart = (service: ServiceItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
    toast.success(`تم إضافة ${service.name} إلى السلة`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const sendOrderToWhatsApp = () => {
    if (cart.length === 0) return;

    let message = "السلام عليكم، أرغب في طلب الخدمات التالية:\n\n";
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   - القسم: ${item.category}\n`;
      message += `   - السعر: ${item.price}\n`;
      message += `   - العدد: ${item.quantity}\n\n`;
    });
    message += "يرجى التواصل معي لتأكيد الموعد.";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    setCart([]);
    setIsCartOpen(false);
    toast.success("تم توجيهك إلى واتساب لإرسال الطلب");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-right font-sans" dir="rtl">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Floating Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 left-8 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900">
            {cartCount}
          </span>
        )}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">عرض السلة</span>
      </button>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Profile Header */}
        <div className="flex flex-col items-center justify-center mb-12 md:mb-16">
          <div className="mb-8 md:mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-75 animate-pulse"></div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl border-4 border-white/20 overflow-hidden shadow-2xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <div className="text-6xl md:text-8xl font-bold text-white/50">أ</div>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-2 md:mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            أسامة مبارك البعوي
          </h1>
          <p className="text-lg md:text-2xl font-semibold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            مهندس كهربائي
          </p>
          <p className="text-sm md:text-lg text-center mb-8 md:mb-10 text-gray-300 px-4">
            مهندس متخصص في المشاريع الإنشائية والإشراف على المواقع
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-6 mb-10 md:mb-12 w-full sm:w-auto">
            <a
              href="mailto:osamah711x@gmail.com"
              className="flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-semibold">البريد الإلكتروني</span>
            </a>
            <a
              href="tel:+966575442802"
              className="flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-semibold">اتصل بي</span>
            </a>
          </div>
        </div>

        {/* Services Grid Section - NOON STYLE */}
        <div className="relative z-10 max-w-7xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            اطلب خدماتنا
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500`}></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex flex-col items-center gap-4 hover:bg-white/10 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2 h-full aspect-square justify-center">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg`}>
                    {category.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white text-center">{category.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="relative z-10 max-w-4xl mx-auto mb-16 md:mb-24 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-2xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">عني</h2>
          <p className="text-gray-200 text-lg md:text-xl leading-relaxed">مهندس كهربائي متخصص في المشاريع الإنشائية والإشراف على المواقع. أتمتع بخبرة واسعة في تنفيذ المشاريع الكبرى وضمان الالتزام بمعايير الهندسة والسلامة. أعمل على تقديم حلول فعالة وموثوقة لكل مشروع.</p>
        </div>

        {/* Social Media Section */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            تابعني على وسائل التواصل
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${social.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-1">
                  <div className={`bg-gradient-to-r ${social.color} text-white rounded-full p-4 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300`}>
                    {SocialIcons[social.icon as keyof typeof SocialIcons]}
                  </div>
                  <p className="text-sm md:text-base font-bold text-white mb-2">{social.name}</p>
                  <p className="text-xs text-gray-400 break-words">{social.username}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] p-8 md:p-16 text-center text-white mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 blur-xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">تواصل معي</h2>
            <p className="text-lg md:text-2xl mb-10 text-blue-100">تواصل معي عبر أي من قنوات التواصل الاجتماعية أو البريد الإلكتروني</p>
            <Button
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold px-12 py-4 text-lg md:text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                window.location.href = "mailto:osamah711x@gmail.com";
              }}
            >
              تواصل معي الآن
            </Button>
          </div>
        </div>
      </div>

      {/* Services Modal - NOON STYLE GRID */}
      <Dialog open={!!selectedCategory} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10 text-white rounded-[2.5rem] p-0 shadow-2xl" dir="rtl">
          <DialogHeader className="p-8 pb-4 sticky top-0 bg-slate-900/95 backdrop-blur-xl z-30 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedCategory?.color} text-white`}>
                  {selectedCategory?.icon}
                </div>
                <div>
                  <DialogTitle className="text-3xl font-bold text-white">
                    {selectedCategory?.title}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-lg">
                    اختر الخدمات التي ترغب بها وأضفها للسلة
                  </DialogDescription>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="p-3 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-8 h-8 text-gray-400" />
              </button>
            </div>
          </DialogHeader>
          
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCategory?.services.map((service) => (
              <div 
                key={service.id}
                className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-800">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {service.price}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow gap-4">
                  <h4 className="text-lg font-bold text-white line-clamp-2 min-h-[3.5rem]">
                    {service.name}
                  </h4>
                  <Button
                    onClick={() => addToCart(service)}
                    className="w-full bg-white/10 hover:bg-blue-600 text-white border-none rounded-xl py-6 text-base font-bold transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> إضافة للسلة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Shopping Cart Modal */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white rounded-[2.5rem] p-0" dir="rtl">
          <DialogHeader className="p-8 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-blue-500" />
                <DialogTitle className="text-2xl font-bold">سلة الخدمات المختارة</DialogTitle>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </DialogHeader>

          <div className="p-8 max-h-[60vh] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-20 h-20 text-gray-700 mx-auto mb-4 opacity-20" />
                <p className="text-gray-400 text-xl">السلة فارغة حالياً</p>
                <Button 
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8"
                >
                  تصفح الخدمات
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-sm text-blue-400 font-bold">{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-md">-</button>
                      <span className="font-bold min-w-[1rem] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-md">+</button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-8 pt-4 bg-slate-950/50 border-t border-white/10 rounded-b-[2.5rem]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400">إجمالي الخدمات المختارة:</span>
                <span className="text-2xl font-bold text-white">{cartCount} خدمة</span>
              </div>
              <Button
                onClick={sendOrderToWhatsApp}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-8 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-xl transition-all transform hover:scale-[1.02]"
              >
                {SocialIcons.whatsapp} إرسال الطلب للفني عبر واتساب
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10 text-white text-center py-12">
        <p className="text-gray-400 text-sm md:text-base mb-2">© 2024 osamah711x. جميع الحقوق محفوظة.</p>
        <p className="text-gray-500 text-xs">صمم باحترافية لتلبية احتياجاتكم</p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-pulse { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

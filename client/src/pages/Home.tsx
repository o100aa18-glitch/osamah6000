'use client';

import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  Zap, 
  Droplets, 
  Wind, 
  Camera, 
  ShoppingCart, 
  Trash2, 
  ChevronRight,
  Palette
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";

// Social Media Icons
const SocialIcons = {
  facebook: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.89.266-1.688.616-2.34 1.285-.656.656-1.015 1.45-1.287 2.34-.266.78-.47 1.713-.57 2.993C.04 8.333.025 8.74 0 12c0 3.26.015 3.667.072 4.947.06 1.277.261 2.148.528 2.927.266.79.604 1.45 1.272 2.097.661.662 1.325 1.004 2.344 1.272.78.267 1.85.47 3.127.528 1.28.06 1.688.072 4.947.072s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.927-.528.79-.268 1.45-.61 2.097-1.272.662-.662 1.015-1.325 1.287-2.344.267-.78.47-1.85.528-3.127.06-1.28.072-1.688.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.528-2.927-.268-.79-.604-1.45-1.272-2.097-.662-.661-1.325-1.004-2.344-1.272-.78-.267-1.85-.47-3.127-.528C15.667.04 15.26.025 12 0zm0 2.16c3.203 0 3.585.009 4.849.07 1.171.054 1.805.244 2.227.408.56.217.96.477 1.382.896.419.42.679.822.896 1.381.164.422.354 1.057.408 2.227.061 1.264.07 1.646.07 4.849 0 3.203-.009 3.585-.07 4.849-.054 1.171-.244 1.805-.408 2.227-.217.56-.477.96-.896 1.382-.42.419-.822.679-1.381.896-.422.164-1.057.354-2.227.408-1.264.061-1.646.07-4.849.07-3.203 0-3.585-.009-4.849-.07-1.171-.054-1.805-.244-2.227-.408-.56-.217-.96-.477-1.382-.896-.419-.42-.679-.822-.896-1.381-.164-.422-.354-1.057-.408-2.227-.061-1.264-.07-1.646-.07-4.849 0-3.203.009-3.585.07-4.849.054-1.171.244-1.805.408-2.227.217-.56.477-.96.896-1.382.42-.419.822-.679 1.381-.896.422-.164 1.057-.354 2.227-.408 1.264-.061 1.646-.07 4.849-.07z"/>
      <circle cx="12" cy="12" r="3.846"/>
      <circle cx="18.613" cy="5.387" r=".923"/>
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

// خدمات الكهرباء
const electricityServices: ServiceItem[] = [
  { id: "e1", name: "تغيير لمبة شمعة", price: "5 - 10 ريال", image: "/manus-storage/elec-01-bulb-candle_1161b738.png" },
  { id: "e2", name: "تركيب غطاء فيش", price: "5 - 10 ريال", image: "/manus-storage/elec-03-socket-cover_cc2632fa.png" },
  { id: "e3", name: "تغيير فيوز فيش", price: "10 - 20 ريال", image: "/manus-storage/elec-04-triple-socket_1f9ec5bb.png" },
  { id: "e4", name: "توصيل روزتة", price: "10 - 20 ريال", image: "/manus-storage/elec-05-light-switch_fd4c4bb4.png" },
  { id: "e5", name: "توصيل سلك شاشة", price: "15 - 25 ريال", image: "/manus-storage/elec-02-bulb-globe_989ebf55.png" },
];

// خدمات السباكة
const plumbingServices: ServiceItem[] = [
  { id: "p1", name: "وضع تفلون على الوصلات", price: "10 - 20 ريال", image: "/manus-storage/plumbing-01-teflon-tape_<placeholder>.png" },
  { id: "p2", name: "تغيير جلبة خلاط", price: "15 - 25 ريال", image: "/manus-storage/plumbing-02-faucet-gasket_<placeholder>.png" },
  { id: "p3", name: "تنظيف فلاتر المغاسل", price: "15 - 25 ريال", image: "/manus-storage/plumbing-03-filter-cleaning_<placeholder>.png" },
  { id: "p4", name: "تركيب صفاية ستانلس", price: "15 - 25 ريال", image: "/manus-storage/plumbing-04-sink-strainer_<placeholder>.png" },
  { id: "p5", name: "تغيير ليّ مغسلة", price: "20 - 35 ريال", image: "/manus-storage/plumbing-05-faucet-core_<placeholder>.png" },
];

// خدمات التكييف
const acServices: ServiceItem[] = [
  { id: "ac1", name: "غسيل مكيف سبليت", price: "100 - 150 ريال", image: "/manus-storage/ac-01-split-unit_<placeholder>.png" },
  { id: "ac2", name: "تعبئة فريون", price: "150 - 250 ريال", image: "/manus-storage/ac-04-refrigerant_<placeholder>.png" },
];

// خدمات الكاميرات
const cameraServices: ServiceItem[] = [
  { id: "c1", name: "تركيب كاميرا مراقبة", price: "150 ريال", image: "/manus-storage/camera-01-cctv_<placeholder>.png" },
  { id: "c2", name: "برمجة وتشغيل", price: "50 ريال", image: "/manus-storage/camera-05-dvr-system_<placeholder>.png" },
];

// خدمات الديكور
const decorServices: ServiceItem[] = [
  { id: "d1", name: "تركيب لوحة جدارية", price: "15 - 30 ريال", image: "/manus-storage/decor-01-wall-art_<placeholder>.png" },
  { id: "d2", name: "تركيب رف جداري", price: "30 - 60 ريال", image: "/manus-storage/decor-02-wall-shelf_<placeholder>.png" },
];

const SERVICES_DATA: ServiceCategory[] = [
  {
    id: "electricity",
    title: "خدمات الكهرباء",
    icon: <Zap className="w-8 h-8" />,
    color: "from-yellow-400 to-orange-500",
    services: electricityServices,
  },
  {
    id: "plumbing",
    title: "خدمات السباكة",
    icon: <Droplets className="w-8 h-8" />,
    color: "from-blue-400 to-cyan-500",
    services: plumbingServices,
  },
  {
    id: "ac",
    title: "خدمات التكييف",
    icon: <Wind className="w-8 h-8" />,
    color: "from-cyan-400 to-blue-500",
    services: acServices,
  },
  {
    id: "camera",
    title: "كاميرات المراقبة",
    icon: <Camera className="w-8 h-8" />,
    color: "from-purple-400 to-pink-500",
    services: cameraServices,
  },
  {
    id: "decor",
    title: "الديكور والتركيبات",
    icon: <Palette className="w-8 h-8" />,
    color: "from-pink-400 to-rose-500",
    services: decorServices,
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (service: ServiceItem) => {
    const existingItem = cart.find(item => item.id === service.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...service, quantity: 1 }]);
    }
    toast.success("تمت إضافة الخدمة للسلة");
  };

  const removeFromCart = (serviceId: string) => {
    setCart(cart.filter(item => item.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
    } else {
      setCart(cart.map(item =>
        item.id === serviceId ? { ...item, quantity } : item
      ));
    }
  };

  const sendToWhatsApp = () => {
    if (cart.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    const message = `مرحباً، أود طلب الخدمات التالية:\n\n${cart
      .map(item => `• ${item.name} (${item.quantity}x) - ${item.price}`)
      .join("\n")}\n\nشكراً`;

    const whatsappUrl = `https://wa.me/966575442802?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background Image */}
      <div 
        className="fixed inset-0 opacity-10 z-0"
        style={{
          backgroundImage: "url('/manus-storage/profile-bg_<hash>.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(!showCart)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <ShoppingCart className="w-8 h-8" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-75 animate-pulse"></div>
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl border-4 border-white/20 overflow-hidden shadow-2xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <div className="text-6xl md:text-8xl font-bold text-white/50">أ</div>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-2 md:mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              أسامة مبارك البعوي
            </h1>
            <p className="text-lg md:text-2xl font-semibold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              مهندس كهربائي
            </p>
            <p className="text-sm md:text-lg text-center mb-8 md:mb-10 text-gray-300 px-4">
              متخصص في المشاريع الإنشائية والإشراف على المواقع
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-6 mb-10 md:mb-12 w-full sm:w-auto justify-center">
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
        </div>

        {/* About Section */}
        <div className="relative z-10 max-w-4xl mx-auto mb-16 md:mb-24 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-2xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">عني</h2>
          <p className="text-gray-200 text-lg md:text-xl leading-relaxed">مهندس كهربائي متخصص في المشاريع الإنشائية والإشراف على المواقع. أتمتع بخبرة واسعة في تنفيذ المشاريع الكبرى وضمان الالتزام بمعايير الهندسة والسلامة. أعمل على تقديم حلول فعالة وموثوقة لكل مشروع.</p>
        </div>

        {/* Services Section - at the bottom */}
        <div className="relative z-10 max-w-7xl mx-auto mb-16 md:mb-24 w-full px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            اطلب خدماتنا
          </h2>

          {!selectedCategory ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {SERVICES_DATA.map((category) => (
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
          ) : (
            <div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="mb-8 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
                <span>العودة للفئات</span>
              </button>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {selectedCategory.services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="group relative"
                  >
                    <div className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 transform group-hover:scale-105 aspect-square flex flex-col">
                      <div className="relative w-full h-3/4 overflow-hidden bg-slate-800">
                        <img 
                          src={service.image} 
                          alt={service.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="h-1/4 p-2 flex items-center justify-center">
                        <p className="text-xs font-bold text-white text-center line-clamp-2">{service.name}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] p-8 md:p-16 text-center text-white mb-12 shadow-2xl relative overflow-hidden mx-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 blur-xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">تواصل معي</h2>
            <p className="text-lg md:text-2xl mb-10 text-blue-100">تواصل معي عبر أي من قنوات التواصل الاجتماعية أو البريد الإلكتروني</p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110">
                {SocialIcons.facebook}
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110">
                {SocialIcons.instagram}
              </a>
              <a href="https://wa.me/966575442802" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110">
                {SocialIcons.whatsapp}
              </a>
            </div>
          </div>
        </div>

        {/* Service Detail Dialog */}
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="bg-slate-900 border border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl">{selectedService?.name}</DialogTitle>
            </DialogHeader>

            <div className="p-8">
              <div className="relative w-full h-80 overflow-hidden rounded-2xl bg-slate-800 mb-6">
                <img 
                  src={selectedService?.image} 
                  alt={selectedService?.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.style.display = 'none';
                  }}
                />
              </div>

              <div className="mb-6">
                <p className="text-gray-300 text-lg mb-2">السعر:</p>
                <p className="text-2xl font-bold text-white">{selectedService?.price}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    if (selectedService) addToCart(selectedService);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:shadow-green-500/50 text-white font-bold py-3 rounded-lg"
                >
                  إضافة للسلة
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cart Drawer */}
        {showCart && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)}>
            <div
              className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">السلة</h2>

                {cart.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">السلة فارغة</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-white font-bold">{item.name}</h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{item.price}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white"
                            >
                              -
                            </button>
                            <span className="text-white flex-1 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={sendToWhatsApp}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:shadow-green-500/50 text-white font-bold py-3 rounded-lg"
                    >
                      إرسال الطلب للفني
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

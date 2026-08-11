import { useState, useMemo } from "react";
import { AIChatAssistant } from "@/components/AIChatAssistant";
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
  ChevronRight,
  Palette,
  Music,
  MessageCircle,
  Send
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// SVG Icons for Social Media
const SocialIcons = {
  facebook: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  tiktok: (
    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12.525.02C7.1.02 2.75 4.35 2.75 9.85c0 5.5 4.35 9.83 9.75 9.83 5.4 0 9.75-4.35 9.75-9.83 0-5.5-4.35-9.83-9.75-9.83zM9.96 17.325c-1.77 0-3.29-1.02-4.51-2.55.5 1.63 2.02 2.96 3.69 2.96 1.71 0 3.21-1.33 3.72-2.96-1.35 1.63-2.89 2.55-4.9 2.55zm.01-5.38c-1.77 0-3.29-1.23-3.29-2.74s1.52-2.74 3.29-2.74c1.77 0 3.29 1.23 3.29 2.74s-1.52 2.74-3.29 2.74zm5.38 5.38c-1.63 0-3.06-1.02-3.56-2.55.5 1.63 2.02 2.96 3.69 2.96 1.71 0 3.21-1.33 3.72-2.96-1.35 1.63-2.89 2.55-4.85 2.55zm.01-5.38c-1.77 0-3.29-1.23-3.29-2.74s1.52-2.74 3.29-2.74c1.77 0 3.29 1.23 3.29 2.74s-1.52 2.74-3.29 2.74z" fill="#000000"/>
      <path d="M12.525.02C7.1.02 2.75 4.35 2.75 9.85c0 5.5 4.35 9.83 9.75 9.83 5.4 0 9.75-4.35 9.75-9.83 0-5.5-4.35-9.83-9.75-9.83zM9.96 17.325c-1.77 0-3.29-1.02-4.51-2.55.5 1.63 2.02 2.96 3.69 2.96 1.71 0 3.21-1.33 3.72-2.96-1.35 1.63-2.89 2.55-4.9 2.55zm.01-5.38c-1.77 0-3.29-1.23-3.29-2.74s1.52-2.74 3.29-2.74c1.77 0 3.29 1.23 3.29 2.74s-1.52 2.74-3.29 2.74zm5.38 5.38c-1.63 0-3.06-1.02-3.56-2.55.5 1.63 2.02 2.96 3.69 2.96 1.71 0 3.21-1.33 3.72-2.96-1.35 1.63-2.89 2.55-4.85 2.55zm.01-5.38c-1.77 0-3.29-1.23-3.29-2.74s1.52-2.74 3.29-2.74c1.77 0 3.29 1.23 3.29 2.74s-1.52 2.74-3.29 2.74z" fill="#25F4EE" opacity="0.6"/>
    </svg>
  ),
  instagram: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.89.266-1.688.616-2.34 1.285-.656.656-1.015 1.45-1.287 2.34-.266.78-.47 1.713-.57 2.993C.04 8.333.025 8.74 0 12c0 3.26.015 3.667.072 4.947.06 1.277.261 2.148.528 2.927.266.79.604 1.45 1.272 2.097.661.662 1.325 1.004 2.344 1.272.78.267 1.85.47 3.127.528 1.28.06 1.688.072 4.947.072s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.927-.528.79-.268 1.45-.61 2.097-1.272.662-.662 1.015-1.325 1.287-2.344.267-.78.47-1.85.528-3.127.06-1.28.072-1.688.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.528-2.927-.268-.79-.604-1.45-1.272-2.097-.662-.661-1.325-1.004-2.344-1.272-.78-.267-1.85-.47-3.127-.528C15.667.04 15.26.025 12 0zm0 2.16c3.203 0 3.585.009 4.849.07 1.171.054 1.805.244 2.227.408.56.217.96.477 1.382.896.419.42.679.822.896 1.381.164.422.354 1.057.408 2.227.061 1.264.07 1.646.07 4.849 0 3.203-.009 3.585-.07 4.849-.054 1.171-.244 1.805-.408 2.227-.217.56-.477.96-.896 1.382-.42.419-.822.679-1.381.896-.422.164-1.057.354-2.227.408-1.264.061-1.646.07-4.849.07-3.203 0-3.585-.009-4.849-.07-1.171-.054-1.805-.244-2.227-.408-.56-.217-.96-.477-1.382-.896-.419-.42-.679-.822-.896-1.381-.164-.422-.354-1.057-.408-2.227-.061-1.264-.07-1.646-.07-4.849 0-3.203.009-3.585.07-4.849.054-1.171.244-1.805.408-2.227.217-.56.477-.96.896-1.382.42-.419.822-.679 1.381-.896.422-.164 1.057-.354 2.227-.408 1.264-.061 1.646-.07 4.849-.07z"/>
      <circle cx="12" cy="12" r="3.846"/>
      <circle cx="18.613" cy="5.387" r=".923"/>
    </svg>
  ),
  youtube: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  snapchat: (
    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#FFFC00"/>
      <circle cx="8.5" cy="10" r="1.2" fill="#000000"/>
      <circle cx="15.5" cy="10" r="1.2" fill="#000000"/>
      <path d="M12 14c1.2 0 2 0.8 2.5 1.5" stroke="#000000" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  x: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.627l-5.1-6.694-5.867 6.694h-3.306l7.73-8.835L.316 2.25h6.888l4.59 6.062L17.77 2.25h.474zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.81 0-9.728h3.554v1.375c.427-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.385 3.704 4.362v5.586zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.71 0-.956.77-1.71 1.954-1.71 1.184 0 1.915.754 1.94 1.71 0 .952-.756 1.71-1.979 1.71zm1.581 11.019H3.757V9.724h3.161v10.728zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
    </svg>
  ),
  whatsapp: (
    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
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

// جميع خدمات الكهرباء - 42 خدمة
const electricityServices: ServiceItem[] = [
  // الأعمال الصغرى
  { id: "e1", category: "الكهرباء", name: "تغيير لمبة شمعة أو حباب داخل ثريا أو أبليك", price: "5 - 10 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-01-bulb-candle_5641c379.png" },
  { id: "e2", category: "الكهرباء", name: "تركيب غطاء فيش أو جلبة حماية للأطفال", price: "5 - 10 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-02-socket-cover_134a02d8.png" },
  { id: "e3", category: "الكهرباء", name: "تغيير فيوز فيش جداري أو وصلة", price: "10 - 20 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-03-fuse_f2492cc1.png" },
  { id: "e4", category: "الكهرباء", name: "توصيل أو تغيير روزتة أو كلبس تجميع", price: "10 - 20 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-04-connector_00f58910.png" },
  { id: "e5", category: "الكهرباء", name: "توصيل سلك شاشة أو دش بالفيش", price: "15 - 25 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-05-coaxial-cable_ecb987b2.png" },
  { id: "e6", category: "الكهرباء", name: "تثبيت حوامل سلكية أو كلبسات جدارية", price: "20 - 40 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-06-cable-clips_115fde83.png" },
  { id: "e7", category: "الكهرباء", name: "تركيب جلبة تمديد بلاستيك أو ألمنيوم للمتر", price: "10 - 15 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-07-casing-tube_725f5940.png" },
  { id: "e8", category: "الكهرباء", name: "تركيب محول ترانس لإضاءة الليد", price: "20 - 35 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-08-transformer_7397c29c.png" },
  { id: "e9", category: "الكهرباء", name: "تركيب وتثبيت حساس ضوئي لإضاءة السور", price: "40 - 70 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-09-photocell_920cb34c.png" },
  // الصيانة والأعطال
  { id: "e10", category: "الكهرباء", name: "كشف الالتماس وتتبع الأعطال مع الأجهزة", price: "150 - 250 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-10-circuit-breaker_0471d7da.png" },
  { id: "e11", category: "الكهرباء", name: "إصلاح شورت الكهرباء وهبوط الفولت", price: "120 - 200 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-10-circuit-breaker_0471d7da.png" },
  { id: "e12", category: "الكهرباء", name: "تغيير قاطع فرعي", price: "30 - 50 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-10-circuit-breaker_0471d7da.png" },
  { id: "e13", category: "الكهرباء", name: "تغيير قاطع رئيسي مجمع", price: "100 - 150 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-30-main-breaker-box_2669240e.png" },
  { id: "e14", category: "الكهرباء", name: "إصلاح خط تكييف محروق أو مفصول", price: "100 - 180 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-36-split-ac-wiring_022ef2ab.png" },
  { id: "e15", category: "الكهرباء", name: "ترتيب وتوزيع أحمال الطبلون", price: "150 - 300 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-27-panel-assembly_d4e603b3.png" },
  { id: "e16", category: "الكهرباء", name: "إعادة تأريض وإصلاح الأرضي", price: "150 - 250 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-29-grounding-rod_075b5323.png" },
  // الإضاءة والديكورات
  { id: "e17", category: "الكهرباء", name: "تركيب سبوت لايت أو داون لايت بفتحة جاهزة", price: "10 - 15 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-11-spotlight_3201677d.png" },
  { id: "e18", category: "الكهرباء", name: "قص فتحة جص وتركيب سبوت لايت", price: "20 - 30 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-11-spotlight_3201677d.png" },
  { id: "e19", category: "الكهرباء", name: "تركيب شريط إضاءة مخفية ليد للمتر", price: "10 - 15 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-12-led-strip_9c7b75cb.png" },
  { id: "e20", category: "الكهرباء", name: "تركيب ليد بروفايل بالمتر", price: "25 - 45 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-13-led-profile_e2235f81.png" },
  { id: "e21", category: "الكهرباء", name: "تركيب أبليك جداري داخلي أو خارجي", price: "25 - 40 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-14-wall-lamp_03e17256.png" },
  { id: "e22", category: "الكهرباء", name: "تركيب نجفة صغيرة أو معلقة", price: "50 - 80 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-15-pendant-light_06f8db28.png" },
  { id: "e23", category: "الكهرباء", name: "تركيب ثريا كبيرة متعددة الأدوار", price: "150 - 350 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-16-chandelier_8464e54d.png" },
  { id: "e24", category: "الكهرباء", name: "تركيب مرايا مضيئة", price: "50 - 90 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-17-mirror-light_1bc165c9.png" },
  { id: "e25", category: "الكهرباء", name: "تركيب إضاءة حدائق وكشافات", price: "30 - 60 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-18-garden-lights_795a4ccc.png" },
  // المفاتيح والأنظمة الذكية
  { id: "e26", category: "الكهرباء", name: "تركيب مفتاح أو فيش عادي", price: "15 - 20 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-19-smart-switch_6b6c201a.png" },
  { id: "e27", category: "الكهرباء", name: "تركيب مفتاح ذكي أو ديمر تعتيم", price: "25 - 50 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-19-smart-switch_6b6c201a.png" },
  { id: "e28", category: "الكهرباء", name: "تركيب مفتاح دركسون ثلاثي الاتجاهات", price: "30 - 50 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-20-3way-switch_ad7ed7f1.png" },
  { id: "e29", category: "الكهرباء", name: "تركيب تايمر ميكانيكي أو إلكتروني", price: "80 - 150 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-21-timer_bba43663.png" },
  // التأسيس والأجهزة المساندة
  { id: "e30", category: "الكهرباء", name: "تركيب جرس عادي أو جرس كاميرا ذكي", price: "40 - 100 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-22-doorbell_b0b7561e.png" },
  { id: "e31", category: "الكهرباء", name: "تركيب مروحة شفط جدارية أو سقفية", price: "40 - 80 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-23-exhaust-fan_af0ee6cc.png" },
  { id: "e32", category: "الكهرباء", name: "تركيب مروحة سقف", price: "60 - 100 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-24-ceiling-fan_45ce3cd9.png" },
  { id: "e33", category: "الكهرباء", name: "تأسيس نقطة كهرباء علبة ومواسير وسحب سلك", price: "35 - 50 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-25-electrical-box_b4f78bbc.png" },
  { id: "e34", category: "الكهرباء", name: "سحب كابل رئيسي من الطبلون للغرفة", price: "80 - 200 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-26-cable-run_1f421a45.png" },
  { id: "e35", category: "الكهرباء", name: "تجميع وترتيب طبلون كهرباء جديد", price: "250 - 500 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-27-panel-assembly_d4e603b3.png" },
  { id: "e36", category: "الكهرباء", name: "تأسيس وتمديد خطوط السبليت كهرباء", price: "100 - 180 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-36-split-ac-wiring_022ef2ab.png" },
  { id: "e37", category: "الكهرباء", name: "تمديد الخطوط الرئيسية", price: "150 - 300 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/electricity-37-main-cable_e960955e.png" },
];

// جميع خدمات السباكة - 42 خدمة
const plumbingServices: ServiceItem[] = [
  // الأعمال الصغرى
  { id: "p1", category: "السباكة", name: "وضع تفلون ومعجون على الوصلات وتثبيتها", price: "10 - 20 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-01-teflon-tape_cce54b57.png" },
  { id: "p2", category: "السباكة", name: "تغيير جلبة أو وجه خلاط", price: "15 - 25 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-02-faucet-gasket_783035d3.png" },
  { id: "p3", category: "السباكة", name: "تنظيف وإزالة الكلس من فلاتر المغاسل", price: "15 - 25 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-03-filter-cleaning_457f92da.png" },
  { id: "p4", category: "السباكة", name: "تركيب غطاء صفاية ستانلس أو سدادة ريحة", price: "15 - 25 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-04-sink-strainer_120a5459.png" },
  { id: "p5", category: "السباكة", name: "تغيير ليات مغسلة أو كرسي أو تسخين", price: "20 - 35 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-05-faucet-core_47a730db.png" },
  { id: "p6", category: "السباكة", name: "تركيب أو تغيير قلب الشطاف", price: "20 - 30 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-06-shower-head_2be1a728.png" },
  { id: "p7", category: "السباكة", name: "تغيير رأس الدش سماعة الدش", price: "20 - 30 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-07-drain-gasket_6c945994.png" },
  { id: "p8", category: "السباكة", name: "تغيير جلبة الصرف التلسكوبية الجرجوري", price: "25 - 40 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-08-odor-trap_be307083.png" },
  { id: "p9", category: "السباكة", name: "تركيب رداد منع الرائحة أو الرجوع", price: "30 - 50 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-09-angle-valve_31bea105.png" },
  { id: "p10", category: "السباكة", name: "تثبيت حلقة سيليكون لمنع تسريب الكرسي", price: "40 - 60 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-10-kitchen-faucet_fb8cb372.png" },
  // الصيانة والتسريبات
  { id: "p11", category: "السباكة", name: "كشف تسربات بالمعاينة والفحص", price: "100 - 150 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-29-leak-detection_9be68d5a.png" },
  { id: "p12", category: "السباكة", name: "تغيير قلب حنفية أو خلاط أو سيفون", price: "40 - 70 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-02-faucet-gasket_783035d3.png" },
  { id: "p13", category: "السباكة", name: "إصلاح تسريب تحت الحوض أو المغسلة", price: "80 - 120 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-34-faucet-leak_0520196b.png" },
  { id: "p14", category: "السباكة", name: "إصلاح ماكينة سيفون دفن أو عادي", price: "80 - 150 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-32-siphon-repair_e8e902d6.png" },
  { id: "p15", category: "السباكة", name: "معالجة تسريب كرسي عربي أو فرنجي", price: "100 - 180 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-33-toilet-repair_b41dbaa9.png" },
  { id: "p16", category: "السباكة", name: "تسليك انسداد مجاري داخلي صفاية أو حوض", price: "100 - 250 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-30-drain-cleaning_b5e0b99a.png" },
  { id: "p17", category: "السباكة", name: "تسليك خط مجاري رئيسي بالسستة", price: "200 - 400 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-31-main-drain_ec2ab22b.png" },
  // الأدوات الصحية والتشطيبات
  { id: "p18", category: "السباكة", name: "تركيب شطاف أو محبس زاوية", price: "20 - 40 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-09-angle-valve_31bea105.png" },
  { id: "p19", category: "السباكة", name: "تركيب خلاط دش أو مغسلة أو مجلى", price: "50 - 80 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-06-shower-head_2be1a728.png" },
  { id: "p20", category: "السباكة", name: "تركيب خلاط مخفي دفن", price: "120 - 220 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-11-hidden-faucet_9482af29.png" },
  { id: "p21", category: "السباكة", name: "تركيب كرسي فرنجي عادي", price: "120 - 180 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-12-toilet-seat_171488b0.png" },
  { id: "p22", category: "السباكة", name: "تركيب مغسلة ديكور رخام أو معلقة", price: "120 - 250 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-13-marble-sink_743182e8.png" },
  { id: "p23", category: "السباكة", name: "تركيب كرسي فرنجي معلق مع الصندوق", price: "250 - 450 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-14-hanging-toilet_c4f8acaf.png" },
  { id: "p24", category: "السباكة", name: "تركيب شاور بكس أو كابينة دش", price: "200 - 400 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-15-shower-cabin_34704fb2.png" },
  { id: "p25", category: "السباكة", name: "تركيب جاكوزي أو بانيو عادي", price: "250 - 500 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-16-jacuzzi_377bf56c.png" },
  // السخانات والأجهزة المنزلية
  { id: "p26", category: "السباكة", name: "توصيل غسالة ملابس أو صحون", price: "60 - 100 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-17-washing-machine_576a99de.png" },
  { id: "p27", category: "السباكة", name: "تغيير شمعة سخان أو هيتر", price: "70 - 120 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-18-heater-element_77e8a84c.png" },
  { id: "p28", category: "السباكة", name: "تركيب سخان مياه عادي من 40 إلى 80 ليتر", price: "80 - 130 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-19-water-heater_30e37769.png" },
  { id: "p29", category: "السباكة", name: "تركيب سخان مخفي أو أفقي أو مركزي صغير", price: "150 - 280 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-20-hidden-heater_21d37192.png" },
  // المضخات والخزانات والتأسيس
  { id: "p30", category: "السباكة", name: "تغيير طقم مراحل فلتر المياه", price: "50 - 80 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-21-filter-cartridge_8b55050a.png" },
  { id: "p31", category: "السباكة", name: "تركيب فلتر مياه منزلي من 5 إلى 7 مراحل", price: "100 - 150 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-22-water-filter_c1f6e5cd.png" },
  { id: "p32", category: "السباكة", name: "تركيب جهاز فلوماك أو أوتوماتيك مضخة", price: "80 - 120 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-23-flowmeter_9e170b15.png" },
  { id: "p33", category: "السباكة", name: "تركيب مضخة مياه دينامو مع الأوتوماتيك", price: "150 - 250 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-24-water-pump_353790f3.png" },
  { id: "p34", category: "السباكة", name: "تركيب فلتر مركزي جامبو للخزان", price: "150 - 250 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-25-central-filter_b1997fd6.png" },
  { id: "p35", category: "السباكة", name: "تركيب أو تحديث شبكة خزان علوي", price: "300 - 600 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-26-tank-setup_81b9e26d.png" },
  { id: "p36", category: "السباكة", name: "تأسيس مطبخ كامل تغذية وصرف", price: "500 - 900 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-27-kitchen-installation_18dc8752.png" },
  { id: "p37", category: "السباكة", name: "تأسيس حمام كامل تغذية وصرف", price: "800 - 1500 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/plumbing-28-bathroom-installation_001d5bef.png" },
];

// خدمات التكييف
const acServices: ServiceItem[] = [
  { id: "ac1", category: "التكييف", name: "غسيل مكيف سبليت", price: "120 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/ac-03-ac-cleaning_f01a6023.png" },
  { id: "ac2", category: "التكييف", name: "تعبئة فريون كامل", price: "250 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/ac-04-refrigerant_ece9b064.png" },
  { id: "ac3", category: "التكييف", name: "تركيب مكيف سبليت", price: "350 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/ac-01-split-unit_ed3c8716.png" },
  { id: "ac4", category: "التكييف", name: "صيانة مكيف شباك", price: "80 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/ac-02-window-ac_cf816a2b.png" },
  { id: "ac5", category: "التكييف", name: "تعبئة فريون تكميلي", price: "150 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/ac-05-ac-installation_e2b1f205.png" },
];

// خدمات الكاميرات والأنظمة
const cameraServices: ServiceItem[] = [
  { id: "cam1", category: "الكاميرات", name: "تركيب كاميرة مراقبة داخلية أو خارجية", price: "40 - 70 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/camera-01-cctv_2025efe5.png" },
  { id: "cam2", category: "الكاميرات", name: "تركيب كاميرة مراقبة متحركة PTZ", price: "80 - 150 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/camera-02-ptz-camera_75e727b3.png" },
  { id: "cam3", category: "الكاميرات", name: "تركيب كاميرة شحن لاسلكية أو طاقة شمسية", price: "60 - 100 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/camera-03-wireless-camera_743acc53.png" },
  { id: "cam4", category: "الكاميرات", name: "تركيب جرس باب ذكي مزود بكاميرة", price: "50 - 90 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/camera-04-smart-doorbell_3c0d6aac.png" },
  { id: "cam5", category: "الكاميرات", name: "تركيب وعرض كاميرات على الشاشة", price: "80 - 150 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/camera-05-dvr-system_ad6ed3e3.png" },
  { id: "cam6", category: "الكاميرات", name: "تركيب قفل باب ذكي", price: "300 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/camera-06-smart-lock_90cd2fcf.png" },
  { id: "cam7", category: "الكاميرات", name: "تركيب انتركوم منزلي", price: "250 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/camera-07-intercom_97264e27.png" },
];

// خدمات الديكور والتركيبات
const decorServices: ServiceItem[] = [
  { id: "dec1", category: "الديكور", name: "تركيب لوحات جدارية صغيرة أو متوسطة", price: "15 - 30 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/decor-01-wall-art_b47d625c.png" },
  { id: "dec2", category: "الديكور", name: "تركيب أرفف خشبية", price: "30 - 60 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/decor-02-wall-shelf_04adbb28.png" },
  { id: "dec3", category: "الديكور", name: "تركيب حامل شاشة جداري", price: "50 - 100 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/decor-03-tv-mount_5175c5e4.png" },
  { id: "dec4", category: "الديكور", name: "تركيب ستائر رول", price: "40 - 70 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/decor-04-curtains_5bd2ead9.png" },
  { id: "dec5", category: "الديكور", name: "تركيب مرايا جدارية", price: "40 - 80 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/decor-05-mirror_af6d8b39.png" },
  { id: "dec6", category: "الديكور", name: "تركيب ساعات جدارية ديكورية", price: "20 - 40 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/decor-06-wall-clock_5b82ef99.png" },
  { id: "dec7", category: "الديكور", name: "تركيب تعليقات وديكورات جدارية", price: "30 - 70 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/decor-07-hanging-decor_727749f1.png" },
  { id: "dec8", category: "الديكور", name: "تركيب وتثبيت عام", price: "25 - 45 ريال", image: "https://manus-storage.s3.amazonaws.com/manus-storage/decor-08-wall-mounting_22e5ff95.png" },
];

const SERVICES_DATA: ServiceCategory[] = [
  {
    id: "electricity",
    title: "خدمات الكهرباء",
    icon: <Zap className="w-8 h-8" />,
    color: "from-yellow-500 to-orange-600",
    services: electricityServices
  },
  {
    id: "plumbing",
    title: "خدمات السباكة",
    icon: <Droplets className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-600",
    services: plumbingServices
  },
  {
    id: "ac",
    title: "خدمات التكييف",
    icon: <Wind className="w-8 h-8" />,
    color: "from-teal-400 to-blue-500",
    services: acServices
  },
  {
    id: "cameras",
    title: "كاميرات وأنظمة",
    icon: <Camera className="w-8 h-8" />,
    color: "from-purple-500 to-indigo-600",
    services: cameraServices
  },
  {
    id: "decor",
    title: "ديكورات وتركيبات",
    icon: <Palette className="w-8 h-8" />,
    color: "from-pink-500 to-rose-600",
    services: decorServices
  }
];

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  // Authentication state removed - not needed for this page

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const WHATSAPP_NUMBER = "966575442802";

  const socialLinks = [
    { name: "فيسبوك", username: "osamah711x", icon: "facebook", url: "https://www.facebook.com/osamah711x", color: "from-blue-600 to-blue-400" },
    { name: "تيك توك", username: "osamah711x", icon: "tiktok", url: "https://www.tiktok.com/@osamah711x", color: "from-gray-900 to-gray-700" },
    { name: "إنستجرام", username: "osamah711x", icon: "instagram", url: "https://www.instagram.com/osamah711x", color: "from-pink-500 to-rose-400" },
    { name: "يوتيوب", username: "osamah711x", icon: "youtube", url: "https://www.youtube.com/@osamah711x", color: "from-red-600 to-red-500" },
    { name: "سناب شات", username: "osamah711xx", icon: "snapchat", url: "https://www.snapchat.com/add/osamah711xx", color: "from-yellow-400 to-yellow-300" },
    { name: "إكس", username: "osamah711x", icon: "x", url: "https://www.x.com/osamah711x", color: "from-gray-800 to-gray-600" },
    { name: "لينكد إن", username: "osamah711x", icon: "linkedin", url: "https://www.linkedin.com/in/osamah711x", color: "from-blue-700 to-blue-500" },
    { name: "واتس آب", username: "00966575442802", icon: "whatsapp", url: "https://wa.me/966575442802", color: "from-green-600 to-green-400" },
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
    toast.success(`تمت إضافة الخدمة إلى السلة`);
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

    let message = "السلام عليكم ورحمة الله وبركاته، أرغب في طلب الخدمات التالية:\n\n";
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   السعر: ${item.price}\n`;
      message += `   الكمية: ${item.quantity}\n\n`;
    });
    message += "يرجى التواصل معي لتأكيد الموعد والتفاصيل.";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    setCart([]);
    setIsCartOpen(false);
    toast.success("تم توجيهك إلى تطبيق واتس آب");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-right font-sans" dir="rtl">
      {/* AI Chat Assistant */}
      <AIChatAssistant />
      {/* خلفية متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* زر السلة العائم */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 left-8 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <ShoppingCart className="w-4 h-4" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900">
            {cartCount}
          </span>
        )}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap" translate="no">السلة</span>
      </button>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* رأس الملف الشخصي */}
        <div className="flex flex-col items-center justify-center mb-12 md:mb-16">
          <div className="mb-8 md:mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-75 animate-pulse"></div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl border-4 border-white/20 overflow-hidden shadow-2xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: 'url(https://files.manuscdn.com/user_upload_by_module/session_file/310519663816443346/PAJWkVOQNmXHZgbg.png)'}} />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-2 md:mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent" translate="no">
            أسامة مبارك البعوي
          </h1>
          <p className="text-lg md:text-2xl font-semibold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" translate="no">
            مهندس متخصص
          </p>
          <p className="text-sm md:text-lg text-center mb-8 md:mb-10 text-gray-300 px-4" translate="no">
            متخصص في خدمات الكهرباء والسباكة والتكييف والكاميرات
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

        {/* قسم من نحن */}
        <div className="relative z-10 max-w-4xl mx-auto mb-16 md:mb-24 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-2xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent" translate="no">عني</h2>
          <p className="text-gray-200 text-lg md:text-xl leading-relaxed" translate="no">مهندس كهربائي متخصص في المشاريع الإنشائية والإشراف على المواقع. أتمتع بخبرة واسعة في تنفيذ المشاريع الكبرى وضمان الالتزام بمعايير الهندسة والسلامة. أعمل على تقديم حلول فعالة وموثوقة لكل مشروع.</p>
        </div>

        {/* قسم وسائل التواصل */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent" translate="no">
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

        {/* قسم الخدمات - في الأسفل */}
        <div className="relative z-10 max-w-7xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent" translate="no">
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
                    <h3 className="text-lg md:text-xl font-bold text-white text-center" translate="no">{category.title}</h3>
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
                <span translate="no">العودة للفئات</span>
              </button>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {selectedCategory.services.map((service) => (
                  <div
                    key={service.id}
                    className="group relative"
                  >
                    <button
                      onClick={() => setSelectedService(service)}
                      className="w-full h-full"
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
                    
                    {/* زر إضافة للسلة المباشر */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(service);
                        toast.success('تمت الإضافة للسلة!');
                      }}
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                      title="إضافة للسلة"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* قسم الاتصال */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] p-8 md:p-16 text-center text-white mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 blur-xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6" translate="no">تواصل معي</h2>
            <p className="text-lg md:text-2xl mb-10 text-blue-100" translate="no">تواصل معي عبر أي من قنوات التواصل الاجتماعية أو البريد الإلكتروني</p>
            <Button
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold px-12 py-4 text-lg md:text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                window.location.href = "mailto:osamah711x@gmail.com";
              }}
            >
              <span translate="no">تواصل معي الآن</span>
            </Button>
          </div>
        </div>
      </div>

      {/* نافذة تفاصيل الخدمة */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white rounded-[2.5rem] p-0 shadow-2xl" dir="rtl">
          <DialogHeader className="p-8 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {selectedService?.name}
                </DialogTitle>
                <DialogDescription className="text-blue-400 text-lg font-bold mt-2">
                  {selectedService?.price}
                </DialogDescription>
              </div>
              <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-white/10 rounded-full">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </DialogHeader>

          <div className="p-8">
                    <div className="relative w-full h-80 overflow-hidden rounded-2xl bg-slate-800 mb-6 flex items-center justify-center">
              {selectedService?.image ? (
                <img 
                  src={selectedService.image} 
                  alt={selectedService.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-9xl">
                  {selectedService?.category === 'الكهرباء' && '⚡'}
                  {selectedService?.category === 'السباكة' && '🚰'}
                  {selectedService?.category === 'التكييف' && '❄️'}
                  {selectedService?.category === 'الكاميرات والأنظمة' && '📹'}
                  {selectedService?.category === 'الديكورات والتركيبات' && '🎨'}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1" translate="no">الفئة</p>
                <p className="text-white font-bold" translate="no">{selectedService?.category}</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1" translate="no">السعر</p>
                <p className="text-white font-bold text-lg">{selectedService?.price}</p>
              </div>

              <Button
                onClick={() => {
                  if (selectedService) addToCart(selectedService);
                  setSelectedService(null);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 rounded-xl shadow-lg flex items-center justify-center gap-3 text-lg transition-all transform hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" /> <span translate="no">إضافة للسلة</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة السلة */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white rounded-[2.5rem] p-0" dir="rtl">
          <DialogHeader className="p-8 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-blue-500" />
                <DialogTitle className="text-2xl font-bold" translate="no">السلة</DialogTitle>
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
                <p className="text-gray-400 text-xl" translate="no">السلة فارغة</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
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
                <span className="text-gray-400" translate="no">إجمالي الخدمات:</span>
                <span className="text-2xl font-bold text-white">{cartCount}</span>
              </div>
              <Button
                onClick={sendOrderToWhatsApp}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-8 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-xl transition-all transform hover:scale-[1.02]"
              >
                {SocialIcons.whatsapp} <span translate="no">إرسال الطلب عبر واتس آب</span>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* التذييل */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10 text-white text-center py-12">
        <p className="text-gray-400 text-sm md:text-base mb-2" translate="no">© 2024 أسامة مبارك البعوي. جميع الحقوق محفوظة.</p>
        <p className="text-gray-500 text-xs" translate="no">صمم باحترافية لتلبية احتياجاتكم</p>
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

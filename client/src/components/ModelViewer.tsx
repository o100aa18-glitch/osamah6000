import { useEffect, useRef } from 'react';

interface ModelViewerProps {
  onClick?: () => void;
}

export function ModelViewer({ onClick }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // تحميل مكتبة model-viewer من Google
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ model-viewer loaded');
      
      // إنشاء عنصر model-viewer
      if (containerRef.current) {
        // تنظيف العناصر السابقة
        containerRef.current.innerHTML = '';
        
        const modelViewer = document.createElement('model-viewer');
        
        // استخدام مجسم 3D من مصدر موثوق
        modelViewer.setAttribute('src', 'https://modelviewer.dev/shared-assets/models/Astronaut.glb');
        modelViewer.setAttribute('alt', 'AI OSAMAH711X');
        modelViewer.setAttribute('autoplay', 'true');
        modelViewer.setAttribute('auto-rotate', 'true');
        modelViewer.setAttribute('shadow-intensity', '1');
        modelViewer.setAttribute('camera-controls', 'true');
        modelViewer.setAttribute('interaction-prompt', 'none');
        
        // تطبيق الأنماط - نفس الزاوية اليسرى السفلية
        Object.assign(modelViewer.style, {
          width: '200px',
          height: '200px',
          backgroundColor: 'transparent',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.5)',
          border: '3px solid rgba(59, 130, 246, 0.8)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'block',
        });

        // إضافة حدث الضغط
        modelViewer.addEventListener('click', (e: Event) => {
          e.stopPropagation();
          onClick?.();
        });

        // إضافة تأثير hover
        modelViewer.addEventListener('mouseenter', () => {
          Object.assign(modelViewer.style, {
            boxShadow: '0 12px 48px rgba(59, 130, 246, 0.8)',
            transform: 'scale(1.1)',
          });
        });

        modelViewer.addEventListener('mouseleave', () => {
          Object.assign(modelViewer.style, {
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.5)',
            transform: 'scale(1)',
          });
        });

        containerRef.current.appendChild(modelViewer);
        console.log('✅ model-viewer created and displayed');
      }
    };

    script.onerror = () => {
      console.error('❌ Failed to load model-viewer');
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onClick]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '200px',
        height: '200px',
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
      title="AI OSAMAH711X"
    />
  );
}

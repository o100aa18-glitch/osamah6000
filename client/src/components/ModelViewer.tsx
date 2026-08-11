import { useEffect, useRef } from 'react';

interface ModelViewerProps {
  onClick?: () => void;
}

export function ModelViewer({ onClick }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    // تحميل مكتبة model-viewer من Google
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ model-viewer loaded successfully');
      
      // إنشاء عنصر model-viewer بعد تحميل المكتبة
      if (containerRef.current && !modelViewerRef.current) {
        const modelViewer = document.createElement('model-viewer');
        
        // استخدام رابط مجسم من Sketchfab - Oguri cap chibi
        // رابط مباشر من CDN Sketchfab
        modelViewer.setAttribute('src', 'https://cdn.sketchfab.com/models/1a1bf1651e8849d795997e79f8e182ca/1a1bf1651e8849d795997e79f8e182ca.glb');
        modelViewer.setAttribute('alt', 'AI Robot Assistant - Oguri Cap Chibi');
        modelViewer.setAttribute('autoplay', '');
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('shadow-intensity', '1');
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('touch-action', 'pan-y');
        modelViewer.setAttribute('exposure', '1');
        
        // تطبيق الأنماط
        Object.assign(modelViewer.style, {
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          width: '200px',
          height: '200px',
          backgroundColor: 'transparent',
          zIndex: '9999',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          border: '2px solid rgba(59, 130, 246, 0.5)',
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
            boxShadow: '0 12px 48px rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 0.8)',
            transform: 'scale(1.05)',
          });
        });

        modelViewer.addEventListener('mouseleave', () => {
          Object.assign(modelViewer.style, {
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            transform: 'scale(1)',
          });
        });

        containerRef.current.appendChild(modelViewer);
        modelViewerRef.current = modelViewer;
        console.log('✅ model-viewer element created and displayed');
      }
    };

    script.onerror = () => {
      console.error('❌ Failed to load model-viewer library');
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (containerRef.current && modelViewerRef.current) {
        try {
          containerRef.current.removeChild(modelViewerRef.current);
        } catch (e) {
          console.warn('Error removing model viewer:', e);
        }
        modelViewerRef.current = null;
      }
    };
  }, [onClick]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        width: '200px',
        height: '200px',
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
    />
  );
}

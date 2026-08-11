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
        modelViewer.setAttribute('src', 'https://models.readyplayer.me/63d9c2b3c0e8b9f2e1a3c4d5.glb');
        modelViewer.setAttribute('alt', 'AI Robot Assistant');
        modelViewer.setAttribute('autoplay', '');
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('shadow-intensity', '1');
        modelViewer.setAttribute('camera-controls', '');
        
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
        console.log('✅ model-viewer element created');
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
        containerRef.current.removeChild(modelViewerRef.current);
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
      }}
    />
  );
}

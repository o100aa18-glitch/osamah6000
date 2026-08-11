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
    document.head.appendChild(script);

    // إنشاء عنصر model-viewer
    if (containerRef.current) {
      const modelViewer = document.createElement('model-viewer');
      modelViewer.setAttribute('src', 'https://models.readyplayer.me/63d9c2b3c0e8b9f2e1a3c4d5.glb');
      modelViewer.setAttribute('alt', 'AI Robot Assistant');
      modelViewer.setAttribute('autoplay', '');
      modelViewer.setAttribute('auto-rotate', '');
      modelViewer.setAttribute('shadow-intensity', '1');
      modelViewer.setAttribute('camera-controls', '');
      
      modelViewer.style.position = 'fixed';
      modelViewer.style.bottom = '10px';
      modelViewer.style.left = '10px';
      modelViewer.style.width = '200px';
      modelViewer.style.height = '200px';
      modelViewer.style.backgroundColor = 'transparent';
      modelViewer.style.zIndex = '9999';
      modelViewer.style.borderRadius = '12px';
      modelViewer.style.overflow = 'hidden';
      modelViewer.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.3)';
      modelViewer.style.border = '2px solid rgba(59, 130, 246, 0.5)';
      modelViewer.style.cursor = 'pointer';
      modelViewer.style.transition = 'all 0.3s ease';

      // إضافة حدث الضغط
      modelViewer.addEventListener('click', onClick || (() => {}));

      // إضافة تأثير hover
      modelViewer.addEventListener('mouseenter', () => {
        modelViewer.style.boxShadow = '0 12px 48px rgba(59, 130, 246, 0.5)';
        modelViewer.style.borderColor = 'rgba(59, 130, 246, 0.8)';
        modelViewer.style.transform = 'scale(1.05)';
      });

      modelViewer.addEventListener('mouseleave', () => {
        modelViewer.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.3)';
        modelViewer.style.borderColor = 'rgba(59, 130, 246, 0.5)';
        modelViewer.style.transform = 'scale(1)';
      });

      containerRef.current.appendChild(modelViewer);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [onClick]);

  return <div ref={containerRef} />;
}

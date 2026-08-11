import { useEffect, useRef } from 'react';

interface ModelViewerProps {
  onClick?: () => void;
}

const MODEL_VIEWER_SCRIPT_ID = 'google-model-viewer-script';
const MODEL_VIEWER_SCRIPT_SRC =
  'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
const ROBOT_MODEL_SRC =
  'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb';

export function ModelViewer({ onClick }: ModelViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onClickRef = useRef(onClick);

  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let viewer: HTMLElement | null = null;

    const mountViewer = () => {
      if (disposed || !host) return;

      host.replaceChildren();
      viewer = document.createElement('model-viewer');
      viewer.setAttribute('src', ROBOT_MODEL_SRC);
      viewer.setAttribute('alt', 'AI OSAMAH711X - Cute Robot Assistant');
      viewer.setAttribute('autoplay', '');
      viewer.setAttribute('animation-name', 'Wave');
      viewer.setAttribute('camera-controls', '');
      viewer.setAttribute('shadow-intensity', '1');
      viewer.setAttribute('interaction-prompt', 'none');
      viewer.setAttribute('touch-action', 'pan-y');
      viewer.setAttribute('ar', '');

      Object.assign(viewer.style, {
        position: 'fixed',
        right: 'max(20px, env(safe-area-inset-right))',
        bottom: 'max(20px, env(safe-area-inset-bottom))',
        width: 'clamp(56px, 14vw, 88px)',
        height: 'clamp(56px, 14vw, 88px)',
        display: 'block',
        background: 'transparent',
        backgroundColor: 'transparent',
        border: '0',
        outline: '0',
        boxShadow: 'none',
        borderRadius: '0',
        overflow: 'visible',
        zIndex: '9999',
        cursor: 'pointer',
        pointerEvents: 'auto',
      });

      viewer.addEventListener('click', (event) => {
        event.stopPropagation();
        onClickRef.current?.();
      });

      viewer.addEventListener('keydown', (event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault();
          onClickRef.current?.();
        }
      });

      host.appendChild(viewer);
    };

    const existingScript = document.getElementById(MODEL_VIEWER_SCRIPT_ID);
    const ready = customElements.get('model-viewer');

    if (ready) {
      mountViewer();
    } else {
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = MODEL_VIEWER_SCRIPT_ID;
        script.type = 'module';
        script.src = MODEL_VIEWER_SCRIPT_SRC;
        script.async = true;
        script.addEventListener('error', () => {
          console.error('Failed to load Google model-viewer.');
        });
        document.head.appendChild(script);
      }

      customElements
        .whenDefined('model-viewer')
        .then(mountViewer)
        .catch((error) => console.error('Failed to define model-viewer:', error));
    }

    return () => {
      disposed = true;
      viewer?.remove();
      viewer = null;
    };
  }, []);

  return (
    <div
      ref={hostRef}
      role="button"
      tabIndex={0}
      aria-label="فتح مساعد الذكاء الاصطناعي AI OSAMAH711X"
      title="AI OSAMAH711X"
      style={{
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '1px',
        height: '1px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}

export { ROBOT_MODEL_SRC };

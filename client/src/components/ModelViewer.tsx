import { useEffect, useRef } from 'react';

interface ModelViewerProps {
  onClick?: () => void;
}

const MODEL_VIEWER_SCRIPT_ID = 'google-model-viewer-script';
const MODEL_VIEWER_SCRIPT_SRC =
  'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
const ROBOT_MODEL_SRC =
  'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb';
const BASE_ANIMATION = 'Wave';
const INTERACTION_ANIMATION = 'Yes';

export function ModelViewer({ onClick }: ModelViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const modelHostRef = useRef<HTMLDivElement>(null);
  const onClickRef = useRef(onClick);
  const restoreAnimationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    const host = modelHostRef.current;
    if (!host) return;

    let disposed = false;
    let viewer: HTMLElement | null = null;

    const setAnimation = (name: string) => {
      if (viewer?.tagName.toLowerCase() !== 'model-viewer') return;
      viewer.setAttribute('animation-name', name);
      viewer.setAttribute('autoplay', '');
    };

    const playFriendlyReaction = () => {
      if (!viewer) return;
      if (restoreAnimationTimerRef.current) {
        window.clearTimeout(restoreAnimationTimerRef.current);
      }
      setAnimation(INTERACTION_ANIMATION);
      restoreAnimationTimerRef.current = window.setTimeout(() => {
        if (!disposed) setAnimation(BASE_ANIMATION);
      }, 1100);
    };

    const mountViewer = () => {
      if (disposed || !host) return;

      host.replaceChildren();
      viewer = document.createElement('model-viewer');
      viewer.setAttribute('src', ROBOT_MODEL_SRC);
      viewer.setAttribute('alt', 'روبوت مساعد لطيف AI OSAMAH711X');
      viewer.setAttribute('autoplay', '');
      viewer.setAttribute('animation-name', BASE_ANIMATION);
      viewer.setAttribute('camera-controls', '');
      viewer.setAttribute('disable-zoom', '');
      viewer.setAttribute('shadow-intensity', '0.5');
      viewer.setAttribute('interaction-prompt', 'none');
      viewer.setAttribute('touch-action', 'none');
      viewer.setAttribute('data-testid', 'friendly-ai-robot');

      Object.assign(viewer.style, {
        position: 'absolute',
        inset: '0 0 18px 0',
        width: '100%',
        height: 'calc(100% - 18px)',
        display: 'block',
        background: 'transparent',
        backgroundColor: 'transparent',
        border: '0',
        outline: '0',
        boxShadow: 'none',
        borderRadius: '0',
        overflow: 'visible',
        cursor: 'pointer',
        pointerEvents: 'auto',
      });

      viewer.addEventListener('click', (event) => {
        event.stopPropagation();
        playFriendlyReaction();
        window.setTimeout(() => onClickRef.current?.(), 220);
      });

      viewer.addEventListener('pointerenter', playFriendlyReaction);
      viewer.addEventListener('keydown', (event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault();
          playFriendlyReaction();
          window.setTimeout(() => onClickRef.current?.(), 220);
        }
      });

      host.appendChild(viewer);
    };

    const existingScript = document.getElementById(MODEL_VIEWER_SCRIPT_ID);
    if (customElements.get('model-viewer')) {
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
      if (restoreAnimationTimerRef.current) {
        window.clearTimeout(restoreAnimationTimerRef.current);
      }
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
      data-testid="friendly-ai-robot-host"
      style={{
        position: 'fixed',
        right: 'max(14px, env(safe-area-inset-right))',
        bottom: 'max(14px, env(safe-area-inset-bottom))',
        width: 'clamp(84px, 20vw, 112px)',
        height: 'clamp(104px, 24vw, 132px)',
        zIndex: 9999,
        pointerEvents: 'auto',
        display: 'block',
      }}
    >
      <div ref={modelHostRef} style={{ position: 'absolute', inset: 0 }} />
      <span
        aria-hidden="true"
        data-testid="friendly-smile"
        style={{
          position: 'absolute',
          top: '34px',
          left: '50%',
          width: '14px',
          height: '7px',
          transform: 'translateX(-50%)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.95)',
          borderRadius: '0 0 14px 14px',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.75))',
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '0',
          bottom: '0',
          width: '100%',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.88)',
          fontSize: '10px',
          lineHeight: '14px',
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '0.04em',
          textShadow: '0 1px 3px rgba(0,0,0,0.75)',
          pointerEvents: 'none',
        }}
      >
        osamah711x
      </span>
    </div>
  );
}

export { ROBOT_MODEL_SRC };

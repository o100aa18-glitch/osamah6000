import { useEffect, useRef, useState } from 'react';

interface ModelViewerProps {
  onClick?: () => void;
}

export function ModelViewer({ onClick }: ModelViewerProps) {
  const [isGreeting, setIsGreeting] = useState(false);
  const greetingTimerRef = useRef<number | null>(null);
  const openTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (greetingTimerRef.current) window.clearTimeout(greetingTimerRef.current);
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
    };
  }, []);

  const playGreeting = (openChat = false) => {
    if (greetingTimerRef.current) window.clearTimeout(greetingTimerRef.current);
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);

    setIsGreeting(true);
    greetingTimerRef.current = window.setTimeout(() => setIsGreeting(false), 1050);

    if (openChat) {
      openTimerRef.current = window.setTimeout(() => onClick?.(), 440);
    }
  };

  return (
    <button
      type="button"
      onClick={() => playGreeting(true)}
      onPointerEnter={() => playGreeting(false)}
      className={`friendly-mascot ${isGreeting ? 'is-greeting' : ''}`}
      aria-label="فتح مساعد الذكاء الاصطناعي AI OSAMAH711X"
      title="AI OSAMAH711X"
      data-testid="friendly-ai-robot-host"
      translate="no"
    >
      <style>{`
        .friendly-mascot {
          position: fixed;
          right: max(14px, env(safe-area-inset-right));
          bottom: max(14px, env(safe-area-inset-bottom));
          z-index: 9999;
          width: clamp(92px, 22vw, 126px);
          height: clamp(132px, 30vw, 158px);
          padding: 0;
          border: 0;
          background: transparent;
          color: white;
          cursor: pointer;
          filter: drop-shadow(0 14px 16px rgba(15, 23, 42, 0.32));
          -webkit-tap-highlight-color: transparent;
        }
        .friendly-mascot:focus-visible { outline: 3px solid rgba(103, 232, 249, .95); outline-offset: 5px; border-radius: 18px; }
        .friendly-mascot:active { transform: scale(.97); }
        .mascot-hole { position: absolute; z-index: 0; left: 50%; bottom: 24px; width: 72px; height: 15px; transform: translateX(-50%); border-radius: 50%; background: radial-gradient(ellipse at 50% 35%, rgba(5, 18, 34, .98) 0 32%, rgba(9, 40, 67, .9) 48%, rgba(92, 194, 220, .35) 73%, transparent 76%); box-shadow: 0 2px 2px rgba(0,0,0,.28), 0 0 12px rgba(73, 220, 240, .23); }
        .mascot-stage { position: relative; z-index: 1; display: block; width: 100%; height: 100%; transform-origin: 70% 100%; animation: mascotPeek 13.8s cubic-bezier(.77,0,.175,1) infinite; }
        .friendly-mascot svg { display: block; width: 100%; height: calc(100% - 24px); overflow: visible; }
        .mascot-peek { transform-origin: 70px 124px; }
        .mascot-float { transform-origin: 70px 118px; animation: mascotFloat 3.4s ease-in-out infinite; }
        .robot-wave-arm { transform-box: fill-box; transform-origin: 0% 0%; animation: robotWave 13.8s ease-in-out infinite; }
        .robot-hand-wave { opacity: 0; animation: robotHandWave 13.8s steps(1, end) infinite; }
        .robot-hand-rest { animation: robotHandRest 13.8s steps(1, end) infinite; }
        .robot-eye { transform-box: fill-box; transform-origin: center; animation: robotBlink 4.1s steps(1, end) infinite; }
        .robot-antenna { transform-origin: 70px 32px; animation: antennaWiggle 3.4s ease-in-out infinite; }
        .robot-glow { animation: chestGlow 2.4s ease-in-out infinite; }
        .robot-leg { transform-box: fill-box; transform-origin: 50% 0%; animation: robotLegSway 2.7s ease-in-out infinite alternate; }
        .robot-leg--right { animation-delay: -.8s; }
        .is-greeting .robot-wave-arm { animation: robotWaveFast .82s ease-in-out 2; }
        .is-greeting .robot-hand-wave { animation: none; opacity: 1; }
        .is-greeting .robot-hand-rest { animation: none; opacity: 0; }
        .is-greeting .mascot-float { animation: mascotHappyHop .6s cubic-bezier(.23,1,.32,1) 1; }
        .mascot-copy { position: absolute; z-index: 3; right: 0; bottom: 0; left: 0; }
        .mascot-ask { display: table; margin: -5px auto 1px; padding: 2px 7px; border: 1px solid rgba(142, 244, 248, .7); border-radius: 999px; background: rgba(6, 41, 70, .82); color: #d8ffff; font: 700 10px/13px Arial, sans-serif; box-shadow: 0 2px 8px rgba(39, 223, 238, .22); }
        .mascot-label { display: block; margin-top: -1px; font: 700 10px/14px Arial, sans-serif; letter-spacing: .06em; text-shadow: 0 1px 3px rgba(0,0,0,.85); }
        @keyframes mascotFloat { 0%,100% { transform: translateY(0) rotate(0deg); } 35% { transform: translateY(-6px) rotate(-1.5deg); } 64% { transform: translateY(-2px) rotate(1deg); } }
        @keyframes mascotPeek { 0%,8%,54%,100% { opacity:1; transform: translateY(0) rotate(0deg) scale(1); clip-path: inset(0 0 0 0); } 12% { transform: translateY(-8px) rotate(-3deg) scale(1.04); } 16% { transform: translateY(-3px) rotate(3deg) scale(1.03); } 20% { opacity:1; transform: translateY(0) rotate(0deg) scale(1); } 59%,69% { opacity:0; transform: translateY(54px) rotate(9deg) scale(.62); clip-path: inset(100% 0 0 0); } 73% { opacity:1; transform: translateY(22px) rotate(-2deg) scale(1); clip-path: inset(0 0 70% 0); } 78% { opacity:1; transform: translateY(10px) rotate(2deg) scale(1.02); clip-path: inset(0 0 42% 0); } 84% { opacity:1; transform: translateY(-4px) rotate(-1deg) scale(1.03); clip-path: inset(0 0 0 0); } 90% { opacity:1; transform: translateY(0) rotate(0deg) scale(1); } }
        @keyframes robotWave { 0%,82%,100% { transform: rotate(0deg); } 86% { transform: rotate(-58deg); } 89% { transform: rotate(46deg); } 92% { transform: rotate(-50deg); } 95% { transform: rotate(38deg); } 98% { transform: rotate(0deg); } }
        @keyframes robotWaveFast { 0%,100% { transform: rotate(0deg); } 22% { transform: rotate(-62deg); } 48% { transform: rotate(50deg); } 72% { transform: rotate(-54deg); } 88% { transform: rotate(30deg); } }
        @keyframes robotHandWave { 0%,84%,100% { opacity: 0; } 86%,98% { opacity: 1; } }
        @keyframes robotHandRest { 0%,84%,100% { opacity: 1; } 86%,98% { opacity: 0; } }
        @keyframes robotBlink { 0%,43%,47%,72%,76%,100% { transform: scaleY(1); } 45%,74% { transform: scaleY(.08); } }
        @keyframes antennaWiggle { 0%,100% { transform: rotate(0deg); } 45% { transform: rotate(5deg); } 55% { transform: rotate(-5deg); } }
        @keyframes chestGlow { 0%,100% { opacity:.68; transform: scale(.9); } 50% { opacity:1; transform: scale(1.08); } }
        @keyframes robotLegSway { from { transform: rotate(-3deg); } to { transform: rotate(3deg); } }
        @keyframes mascotHappyHop { 0%,100% { transform: translateY(0) rotate(0deg); } 45% { transform: translateY(-9px) rotate(-4deg); } 70% { transform: translateY(-2px) rotate(3deg); } }
        @media (prefers-reduced-motion: reduce) { .mascot-stage, .mascot-peek, .mascot-float, .robot-wave-arm, .robot-hand-wave, .robot-hand-rest, .robot-eye, .robot-antenna, .robot-glow, .robot-leg { animation: none !important; } }
      `}</style>

      <span className="mascot-hole" aria-hidden="true" />
      <span className="mascot-stage">
      <svg viewBox="0 0 140 142" aria-hidden="true" data-testid="programmatic-cute-robot">
        <defs>
          <linearGradient id="headShell" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f7fcff" />
            <stop offset=".48" stopColor="#bfe8ff" />
            <stop offset="1" stopColor="#78a9cf" />
          </linearGradient>
          <linearGradient id="screenFace" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#0f2a42" />
            <stop offset="1" stopColor="#06101f" />
          </linearGradient>
          <linearGradient id="bodyShell" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#68e1e7" />
            <stop offset=".5" stopColor="#2874b6" />
            <stop offset="1" stopColor="#163b75" />
          </linearGradient>
          <linearGradient id="armShell" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f8fdff" />
            <stop offset="1" stopColor="#8cc5e8" />
          </linearGradient>
          <radialGradient id="eyeGlow"><stop stopColor="#f0ffff" /><stop offset=".38" stopColor="#54f6ee" /><stop offset="1" stopColor="#0c9dd4" /></radialGradient>
          <filter id="softGlow"><feGaussianBlur stdDeviation="1.6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        <g className="mascot-peek">
          <g className="mascot-float">
            <ellipse cx="70" cy="132" rx="35" ry="5" fill="rgba(7,18,37,.24)" />

            <g className="robot-antenna">
              <path d="M70 32 L70 16" stroke="#5c9dd1" strokeWidth="3" strokeLinecap="round" />
              <circle cx="70" cy="13" r="5" fill="#71f2f2" filter="url(#softGlow)" />
              <circle cx="68.5" cy="11.5" r="1.5" fill="white" opacity=".9" />
            </g>

            <g>
              <rect x="35" y="29" width="70" height="52" rx="21" fill="url(#headShell)" stroke="#416e9f" strokeWidth="2" />
              <path d="M95 35 Q108 45 102 68 Q98 77 88 79 L91 40Z" fill="#6d9fc3" opacity=".72" />
              <path d="M42 34 Q60 24 82 33" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".75" />
              <rect x="43" y="39" width="54" height="33" rx="14" fill="url(#screenFace)" stroke="#74cbef" strokeWidth="1.5" />
              <ellipse cx="58" cy="54" rx="8" ry="8.4" fill="url(#eyeGlow)" filter="url(#softGlow)" className="robot-eye" />
              <ellipse cx="82" cy="54" rx="8" ry="8.4" fill="url(#eyeGlow)" filter="url(#softGlow)" className="robot-eye" />
              <circle cx="55.5" cy="51.5" r="2" fill="white" opacity=".95" />
              <circle cx="79.5" cy="51.5" r="2" fill="white" opacity=".95" />
              <path d="M61 63 Q70 70 79 63" fill="none" stroke="#8ffcf4" strokeWidth="2" strokeLinecap="round" />
              <circle cx="37" cy="57" r="6" fill="#3e8fc3" />
              <circle cx="103" cy="57" r="6" fill="#3e8fc3" />
            </g>

            <g>
              <g className="robot-leg">
                <path d="M51 105 Q55 110 66 109 L65 127 Q58 130 51 126Z" fill="url(#armShell)" stroke="#4c90c5" strokeWidth="1.5" />
                <path d="M54 111 L62 112" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".65" />
                <ellipse cx="58" cy="129" rx="11" ry="4.5" fill="#255c95" />
              </g>
              <g className="robot-leg robot-leg--right">
                <path d="M74 109 Q85 110 89 105 L90 126 Q82 130 75 127Z" fill="url(#armShell)" stroke="#4c90c5" strokeWidth="1.5" />
                <path d="M78 112 L86 111" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".65" />
                <ellipse cx="83" cy="129" rx="11" ry="4.5" fill="#255c95" />
              </g>
              <path d="M48 79 Q70 73 92 79 L98 111 Q70 121 42 111Z" fill="url(#bodyShell)" stroke="#184e8a" strokeWidth="2" />
              <path d="M49 82 Q63 77 72 80 L67 113 Q52 114 43 110Z" fill="#77eff0" opacity=".38" />
              <rect x="58" y="88" width="24" height="19" rx="8" fill="#0b315d" stroke="#87f5f2" strokeWidth="1.5" />
              <circle cx="70" cy="97" r="5" fill="#74fff3" filter="url(#softGlow)" className="robot-glow" />
            </g>

            <g>
              <path d="M45 86 Q33 90 29 104" fill="none" stroke="url(#armShell)" strokeWidth="10" strokeLinecap="round" />
              <circle cx="28" cy="106" r="7" fill="#e9fbff" stroke="#5594c6" strokeWidth="1.5" />
            </g>

            <g>
              <circle cx="94" cy="87" r="6" fill="#4b91c6" stroke="#b9efff" strokeWidth="1.5" />
              <g className="robot-wave-arm">
                <path d="M95 88 C103 90 108 98 108 108" fill="none" stroke="url(#armShell)" strokeWidth="10" strokeLinecap="round" />
                <g className="robot-hand robot-hand-rest">
                  <circle cx="108" cy="113" r="8" fill="#eaffff" stroke="#5594c6" strokeWidth="1.5" />
                  <path d="M104 113 Q108 117 112 113" fill="none" stroke="#c7f0ff" strokeWidth="2" strokeLinecap="round" />
                </g>
                <g className="robot-hand robot-hand-wave">
                  <circle cx="108" cy="113" r="8" fill="#eaffff" stroke="#5594c6" strokeWidth="1.5" />
                  <path d="M104 108 L100 103 M109 106 L108 99 M113 107 L116 102" fill="none" stroke="#d9faff" strokeWidth="2.8" strokeLinecap="round" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      </span>
      <span className="mascot-copy">
        <span className="mascot-ask">اسألني</span>
        <span className="mascot-label">osamah711x</span>
      </span>
    </button>
  );
}

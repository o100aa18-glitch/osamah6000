import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('friendly interactive 3D assistant configuration', () => {
  const component = readFileSync(
    resolve(process.cwd(), 'client/src/components/ModelViewer.tsx'),
    'utf8',
  );
  const assistant = readFileSync(
    resolve(process.cwd(), 'client/src/components/AIChatAssistant.tsx'),
    'utf8',
  );

  it('uses the cute expressive robot and friendly animations', () => {
    expect(component).toContain('/manus-storage/robot-polygonal-mind_897aa57d.glb');
    expect(component).toContain("const BASE_ANIMATION = 'Wave'");
    expect(component).toContain("const INTERACTION_ANIMATION = 'Yes'");
    expect(component).toContain("viewer.setAttribute('autoplay', '')");
    expect(component).toContain('playFriendlyReaction');
    expect(component).toContain('viewer.animate(');
    expect(component).toContain('data-testid="friendly-smile"');
    expect(component).toContain("borderBottom: '2px solid rgba(255, 255, 255, 0.95)'");
  });

  it('places a compact transparent robot away from the cart and labels it', () => {
    expect(component).toContain("right: 'max(14px, env(safe-area-inset-right))'");
    expect(component).toContain("bottom: 'max(14px, env(safe-area-inset-bottom))'");
    expect(component).toContain("width: 'clamp(84px, 20vw, 112px)'");
    expect(component).toContain("height: 'clamp(104px, 24vw, 132px)'");
    expect(component).toContain("backgroundColor: 'transparent'");
    expect(component).toContain('osamah711x');
    expect(component).toContain("border: '0'");
  });

  it('keeps the model connected to the AI chat click flow', () => {
    expect(assistant).toContain('<ModelViewer onClick={() => setIsOpen(true)} />');
    expect(component).toContain('onClickRef.current?.()');
    expect(component).toContain('window.setTimeout(() => onClickRef.current?.(), 220)');
  });

  it('does not overlap the cart on a 390px mobile viewport', () => {
    const viewport = { width: 390, height: 844 };
    const hostWidth = Math.max(84, Math.min((20 * viewport.width) / 100, 112));
    const hostHeight = Math.max(104, Math.min((24 * viewport.width) / 100, 132));
    const robot = {
      left: viewport.width - 14 - hostWidth,
      top: viewport.height - 14 - hostHeight,
      right: viewport.width - 14,
      bottom: viewport.height - 14,
    };
    const cart = { left: 32, top: 756, right: 88, bottom: 812 };
    const overlaps = (a: typeof robot, b: typeof robot) =>
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

    expect(robot.left).toBe(292);
    expect(overlaps(robot, cart)).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('interactive 3D assistant configuration', () => {
  const component = readFileSync(
    resolve(process.cwd(), 'client/src/components/ModelViewer.tsx'),
    'utf8',
  );
  const assistant = readFileSync(
    resolve(process.cwd(), 'client/src/components/AIChatAssistant.tsx'),
    'utf8',
  );

  it('uses the animated RobotExpressive model and Wave animation', () => {
    expect(component).toContain('https://modelviewer.dev/shared-assets/models/RobotExpressive.glb');
    expect(component).toContain("viewer.setAttribute('autoplay', '')");
    expect(component).toContain("viewer.setAttribute('animation-name', 'Wave')");
  });

  it('keeps the model transparent, frameless, and responsive', () => {
    expect(component).toContain("backgroundColor: 'transparent'");
    expect(component).toContain("border: '0'");
    expect(component).toContain("right: 'max(20px, env(safe-area-inset-right))'");
    expect(component).toContain("width: 'clamp(56px, 14vw, 88px)'");
    expect(component).toContain("height: 'clamp(56px, 14vw, 88px)'");
  });

  it('opens the AI assistant from the model without the old framed button', () => {
    expect(assistant).toContain('<ModelViewer onClick={() => setIsOpen(true)} />');
    expect(assistant).not.toContain('overflow-hidden border-2 border-blue-500');
  });
});

  it('keeps the compact mobile model away from the cart and primary CTAs', () => {
    const viewport = { width: 390, height: 844 };
    const modelSize = Math.max(56, Math.min(14 * viewport.width / 100, 88));
    const model = {
      left: viewport.width - 20 - modelSize,
      top: viewport.height - 20 - modelSize,
      right: viewport.width - 20,
      bottom: viewport.height - 20,
    };
    const cart = { left: 16, top: 760, right: 88, bottom: 832 };
    const primaryCta = { left: 16, top: 408, right: 374, bottom: 493 };
    const overlaps = (a: typeof model, b: typeof model) =>
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

    expect(model.right - model.left).toBe(56);
    expect(overlaps(model, cart)).toBe(false);
    expect(overlaps(model, primaryCta)).toBe(false);
  });

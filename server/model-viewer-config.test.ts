import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('programmatic friendly robot assistant', () => {
  const component = readFileSync(
    resolve(process.cwd(), 'client/src/components/ModelViewer.tsx'),
    'utf8',
  );
  const assistant = readFileSync(
    resolve(process.cwd(), 'client/src/components/AIChatAssistant.tsx'),
    'utf8',
  );

  it('uses one unified programmatic robot instead of a GLB or separate overlay', () => {
    expect(component).toContain('data-testid="programmatic-cute-robot"');
    expect(component).toContain('robot-wave-arm');
    expect(component).toContain('robot-eye');
    expect(component).toContain('headShell');
    expect(component).not.toContain('model-viewer');
    expect(component).not.toContain('ROBOT_MODEL_SRC');
  });

  it('contains integrated autonomous motions for waving, blinking, floating, and peeking', () => {
    expect(component).toContain('@keyframes robotWave');
    expect(component).toContain('@keyframes robotBlink');
    expect(component).toContain('@keyframes mascotFloat');
    expect(component).toContain('@keyframes mascotPeek');
    expect(component).toContain('mascotHappyHop');
  });

  it('stays opposite the cart and preserves the AI chat click flow', () => {
    expect(component).toContain('right: max(14px, env(safe-area-inset-right))');
    expect(component).toContain('osamah711x');
    expect(assistant).toContain('<ModelViewer onClick={() => setIsOpen(true)} />');
    expect(component).toContain('onClick?.()');
  });
});

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('social icon layout', () => {
  const home = readFileSync(resolve(process.cwd(), 'client/src/pages/Home.tsx'), 'utf8');

  it('keeps social profiles in a four-column compact grid', () => {
    expect(home).toContain('grid grid-cols-4 gap-2 md:gap-3 max-w-2xl mx-auto');
    expect(home).toContain('w-9 h-9 md:w-10 md:h-10');
    expect(home).toContain('[&>svg]:!w-4 [&>svg]:!h-4');
  });

  it('uses the recognizable Snapchat yellow ghost icon', () => {
    expect(home).toContain('aria-label="Snapchat"');
    expect(home).toContain('fill="#FFFC00"');
    expect(home).toContain('fill="#fff" stroke="#111"');
  });
});

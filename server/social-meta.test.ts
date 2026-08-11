import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('social sharing metadata', () => {
  const document = readFileSync(resolve(process.cwd(), 'client/index.html'), 'utf8');

  it('includes the primary Open Graph fields and a social image', () => {
    expect(document).toContain('property="og:title"');
    expect(document).toContain('property="og:description"');
    expect(document).toContain('property="og:image" content="https://osamah711x.com/manus-storage/osamah-social-preview_9c28c2f9.png"');
    expect(document).toContain('property="og:url" content="https://osamah711x.com/"');
  });

  it('includes a large Twitter card and canonical primary domain', () => {
    expect(document).toContain('name="twitter:card" content="summary_large_image"');
    expect(document).toContain('name="twitter:image" content="https://osamah711x.com/manus-storage/osamah-social-preview_9c28c2f9.png"');
    expect(document).toContain('<link rel="canonical" href="https://osamah711x.com/"');
  });
});

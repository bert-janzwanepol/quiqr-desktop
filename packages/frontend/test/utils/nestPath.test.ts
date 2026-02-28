/**
 * nestPath Utility Tests
 *
 * Tests for URL-based nested field navigation utilities:
 * - parseNestPath: extract nest path from URL
 * - buildNestUrl: construct navigation URL
 * - getBasePath: strip /nest/* suffix
 */

import { describe, it, expect } from 'vitest';
import { parseNestPath, buildNestUrl, getBasePath } from '../../src/utils/nestPath';

describe('parseNestPath', () => {
  it('extracts a simple nest path', () => {
    expect(parseNestPath('/sites/x/workspaces/y/singles/z/nest/author')).toBe('author');
  });

  it('extracts a dotted nest path', () => {
    expect(parseNestPath('/sites/x/singles/z/nest/author.address')).toBe('author.address');
  });

  it('extracts a nest path with array index', () => {
    const encoded = encodeURIComponent('content_blocks[0].button');
    expect(parseNestPath(`/sites/x/singles/z/nest/${encoded}`)).toBe('content_blocks[0].button');
  });

  it('returns undefined for a URL without /nest/', () => {
    expect(parseNestPath('/sites/x/singles/z')).toBeUndefined();
  });

  it('returns undefined for root path', () => {
    expect(parseNestPath('/')).toBeUndefined();
  });

  it('handles URL-encoded special characters', () => {
    const encoded = encodeURIComponent('blocks[2].item');
    const result = parseNestPath(`/sites/x/singles/z/nest/${encoded}`);
    expect(result).toBe('blocks[2].item');
  });
});

describe('buildNestUrl', () => {
  it('builds URL with a simple field key', () => {
    expect(buildNestUrl('/sites/x/singles/z', 'author')).toBe(
      '/sites/x/singles/z/nest/author'
    );
  });

  it('appends field key to existing nest path', () => {
    expect(buildNestUrl('/sites/x/singles/z', 'address', 'author')).toBe(
      '/sites/x/singles/z/nest/author.address'
    );
  });

  it('URL-encodes array indices in the path', () => {
    // When building from a compositeKey path that includes array index
    const url = buildNestUrl('/sites/x/singles/z', 'content_blocks[0].button');
    expect(url).toBe('/sites/x/singles/z/nest/content_blocks%5B0%5D.button');
  });

  it('ignores undefined currentNestPath', () => {
    expect(buildNestUrl('/base', 'field', undefined)).toBe('/base/nest/field');
  });
});

describe('getBasePath', () => {
  it('strips /nest/* suffix', () => {
    expect(getBasePath('/sites/x/singles/z/nest/author')).toBe('/sites/x/singles/z');
  });

  it('strips deep /nest/* suffix', () => {
    expect(getBasePath('/sites/x/singles/z/nest/author.address.city')).toBe('/sites/x/singles/z');
  });

  it('returns path unchanged when no /nest/ present', () => {
    expect(getBasePath('/sites/x/singles/z')).toBe('/sites/x/singles/z');
  });

  it('strips encoded nest path', () => {
    const encoded = encodeURIComponent('blocks[0].button');
    expect(getBasePath(`/sites/x/singles/z/nest/${encoded}`)).toBe('/sites/x/singles/z');
  });
});

/**
 * findFieldByPath Utility Tests
 *
 * Tests for static schema traversal, array index handling, and
 * helpers used by SukohForm's nested navigation.
 */

import { describe, it, expect } from 'vitest';
import {
  findFieldByPath,
  pathHasArrayIndex,
  getTopLevelKey,
  getSubTargetIndex,
} from '../../src/utils/findFieldByPath';
import type { Field } from '@quiqr/types';

// ---------------------------------------------------------------------------
// Schema fixture — mirrors the real composit_page + block_img_paragraph shape
// ---------------------------------------------------------------------------

const buttonFields: Field[] = [
  { key: 'enable', type: 'boolean', title: 'Enable' },
  { key: 'label', type: 'string', title: 'Label' },
  { key: 'link', type: 'string', title: 'Link' },
];

const staticFields: Field[] = [
  { key: 'draft', type: 'boolean', title: 'Draft' },
  { key: 'title', type: 'string', title: 'Title' },
  {
    key: 'content_blocks',
    type: 'accordion',
    title: 'Content Blocks',
    // Static accordion fields — dynamic ones are loaded via dynFormSearchKey at runtime
    fields: [
      { key: 'disabled', type: 'boolean' },
      { key: 'content_type', type: 'string', arrayTitle: true },
    ],
  } as unknown as Field,
  {
    key: 'author',
    type: 'nest',
    title: 'Author',
    groupdata: true,
    fields: [
      { key: 'name', type: 'string' },
      {
        key: 'address',
        type: 'nest',
        groupdata: true,
        fields: [
          { key: 'street', type: 'string' },
          { key: 'city', type: 'string' },
        ],
      } as unknown as Field,
    ],
  } as unknown as Field,
];

// ---------------------------------------------------------------------------
// findFieldByPath
// ---------------------------------------------------------------------------

describe('findFieldByPath', () => {
  it('finds a top-level field', () => {
    const result = findFieldByPath(staticFields, 'title');
    expect(result?.key).toBe('title');
  });

  it('finds a nested field via dot notation', () => {
    const result = findFieldByPath(staticFields, 'author.name');
    expect(result?.key).toBe('name');
  });

  it('finds a deeply nested field', () => {
    const result = findFieldByPath(staticFields, 'author.address.city');
    expect(result?.key).toBe('city');
  });

  it('finds a field after stripping array indices', () => {
    // "content_blocks[0]" normalises to "content_blocks"
    const result = findFieldByPath(staticFields, 'content_blocks[0]');
    expect(result?.key).toBe('content_blocks');
  });

  it('strips array index when descending into static children', () => {
    // "content_blocks[0].disabled" → finds "disabled" inside content_blocks.fields
    const result = findFieldByPath(staticFields, 'content_blocks[0].disabled');
    expect(result?.key).toBe('disabled');
  });

  it('returns undefined for a missing top-level key', () => {
    expect(findFieldByPath(staticFields, 'nonexistent')).toBeUndefined();
  });

  it('returns undefined for a missing nested key', () => {
    expect(findFieldByPath(staticFields, 'author.nonexistent')).toBeUndefined();
  });

  it('returns undefined for dynamic fields not in static schema', () => {
    // "button" only exists in the dynamically-loaded block partial,
    // not in the static content_blocks.fields array
    expect(findFieldByPath(staticFields, 'content_blocks.button')).toBeUndefined();
    expect(findFieldByPath(staticFields, 'content_blocks[0].button')).toBeUndefined();
  });

  it('finds a field in a manually composed schema with dynamic fields added', () => {
    // Simulates the scenario where dynamic fields have been merged in
    const fieldsWithDynamic: Field[] = [
      ...staticFields.filter((f) => f.key !== 'content_blocks'),
      {
        key: 'content_blocks',
        type: 'accordion',
        fields: [
          { key: 'disabled', type: 'boolean' },
          { key: 'content_type', type: 'string', arrayTitle: true },
          { key: 'button', type: 'nest', groupdata: true, fields: buttonFields } as unknown as Field,
        ],
      } as unknown as Field,
    ];
    const result = findFieldByPath(fieldsWithDynamic, 'content_blocks[0].button');
    expect(result?.key).toBe('button');
    expect(result?.type).toBe('nest');
  });
});

// ---------------------------------------------------------------------------
// pathHasArrayIndex
// ---------------------------------------------------------------------------

describe('pathHasArrayIndex', () => {
  it('returns true for paths with array indices', () => {
    expect(pathHasArrayIndex('content_blocks[0].button')).toBe(true);
    expect(pathHasArrayIndex('items[2]')).toBe(true);
  });

  it('returns false for plain dot paths', () => {
    expect(pathHasArrayIndex('content_blocks.button')).toBe(false);
    expect(pathHasArrayIndex('author.address.city')).toBe(false);
    expect(pathHasArrayIndex('title')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getTopLevelKey
// ---------------------------------------------------------------------------

describe('getTopLevelKey', () => {
  it('extracts the first key from a dotted path', () => {
    expect(getTopLevelKey('content_blocks.button')).toBe('content_blocks');
  });

  it('extracts the key before an array index', () => {
    expect(getTopLevelKey('content_blocks[0].button')).toBe('content_blocks');
  });

  it('returns the key itself for single-segment paths', () => {
    expect(getTopLevelKey('title')).toBe('title');
  });
});

// ---------------------------------------------------------------------------
// getSubTargetIndex
// ---------------------------------------------------------------------------

describe('getSubTargetIndex', () => {
  it('extracts index when nestPath targets a child of the given fieldPath', () => {
    expect(getSubTargetIndex('content_blocks[0].button', 'content_blocks')).toBe(0);
    expect(getSubTargetIndex('content_blocks[2].button', 'content_blocks')).toBe(2);
  });

  it('returns null when nestPath does not start with fieldPath[N]', () => {
    expect(getSubTargetIndex('other_field[0].button', 'content_blocks')).toBeNull();
  });

  it('returns null when nestPath equals the fieldPath with no index', () => {
    // Direct target, not sub-target
    expect(getSubTargetIndex('content_blocks', 'content_blocks')).toBeNull();
  });

  it('returns null for undefined nestPath', () => {
    expect(getSubTargetIndex(undefined, 'content_blocks')).toBeNull();
  });

  it('returns null when fieldPath is a suffix of nestPath key (no false partial match)', () => {
    // "blocks" should not match "content_blocks[0]"
    expect(getSubTargetIndex('content_blocks[0].button', 'blocks')).toBeNull();
  });

  it('handles deeply nested sub-targets', () => {
    // slider_item is a nested accordion inside a dynamic block — same pattern
    expect(getSubTargetIndex('slider_item[1].button', 'slider_item')).toBe(1);
  });
});

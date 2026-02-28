import type { Field } from '@quiqr/types';

/**
 * Find a field by its nested path (e.g., "author.address" or "blocks[0].button").
 *
 * Array indices are stripped during schema traversal because the static field schema
 * doesn't replicate per-item — "blocks[0].button" traverses the same schema as "blocks.button".
 *
 * Returns undefined when:
 * - A path segment doesn't match any field key
 * - The field only exists in dynamically loaded partials (dynFormSearchKey), not the static schema
 */
export function findFieldByPath(fields: Field[], path: string): Field | undefined {
  // Strip array indices: "content_blocks[0].button" -> "content_blocks.button"
  const normalizedPath = path.replace(/\[\d+\]/g, '');
  const segments = normalizedPath.split('.');
  let currentFields = fields;
  let result: Field | undefined;

  for (const segment of segments) {
    result = currentFields.find((f) => f.key === segment);
    if (!result) return undefined;

    if ('fields' in result && Array.isArray(result.fields)) {
      currentFields = result.fields as Field[];
    }
  }

  return result;
}

/**
 * Given a nestPath, determine the top-level field key.
 * Handles both "field.sub" and "field[0].sub" forms.
 */
export function getTopLevelKey(nestPath: string): string {
  return nestPath.split(/[\[.]/)[0];
}

/**
 * Returns true if the nestPath contains array indices,
 * indicating it passes through an accordion item.
 */
export function pathHasArrayIndex(path: string): boolean {
  return /\[\d+\]/.test(path);
}

/**
 * Parse the array index from a path relative to a parent accordion key.
 * e.g., parentKey="content_blocks", nestPath="content_blocks[2].button" → 2
 * Returns null if the nestPath is not a direct child of the given parent key.
 */
export function getSubTargetIndex(nestPath: string | undefined, fieldPath: string): number | null {
  if (!nestPath) return null;
  const escaped = fieldPath.replace(/[.[\](){}*+?\\^$|]/g, '\\$&');
  const match = nestPath.match(new RegExp(`^${escaped}\\[(\\d+)\\]`));
  return match ? parseInt(match[1], 10) : null;
}

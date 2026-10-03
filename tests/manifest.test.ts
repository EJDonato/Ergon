import { describe, expect, it } from 'vitest';
import { parseManifest } from '../src/core/manifest.js';

const valid = `
id: example
name: Example Skill
persona: Echo
description: A useful example skill.
triggers: [example]
`;

describe('parseManifest', () => {
  it('parses a valid manifest and supplies a version', () => {
    expect(parseManifest(valid)).toMatchObject({ id: 'example', version: '1.0.0' });
  });

  it('returns a useful error for invalid manifests', () => {
    expect(() => parseManifest('id: INVALID\n')).toThrow(/Invalid skill manifest/);
  });

  it('returns a useful error for malformed YAML', () => {
    expect(() => parseManifest('id: [broken')).toThrow(/Invalid YAML/);
  });
});

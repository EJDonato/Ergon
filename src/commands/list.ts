import pc from 'picocolors';
import { listSkills } from '../core/resolver.js';

export async function listCommand(): Promise<void> {
  const skills = await listSkills();
  const widths = {
    id: Math.max(5, ...skills.map((skill) => skill.manifest.id.length)),
    persona: Math.max(7, ...skills.map((skill) => skill.manifest.persona.length)),
  };
  console.log(`${pc.bold('SKILL'.padEnd(widths.id))}  ${pc.bold('PERSONA'.padEnd(widths.persona))}  DESCRIPTION`);
  for (const { manifest } of skills) {
    console.log(`${manifest.id.padEnd(widths.id)}  ${manifest.persona.padEnd(widths.persona)}  ${manifest.description}`);
  }
  console.log(`\nBundles: ${pc.cyan('foundation')}, ${pc.cyan('specialists')}`);
}

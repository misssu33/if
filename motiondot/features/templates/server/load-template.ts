import 'server-only';

import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { getTemplatesDir } from '@/lib/storage';
import type { MotionTemplateDefinition } from '@/types/motion-template';
import { registerTemplate } from '../engine/template-registry';
import { validateMotionTemplate } from '../utils/validate-template';
import { sortTemplatesForDisplay } from '../utils/sort-templates-for-display';

/** templates/{id}.json 단일 로드 */
export async function loadMotionTemplate(
  id: string,
): Promise<MotionTemplateDefinition> {
  const filePath = path.join(getTemplatesDir(), `${id}.json`);
  const raw = await readFile(filePath, 'utf-8');
  const data = JSON.parse(raw) as unknown;

  if (!validateMotionTemplate(data)) {
    throw new Error(`Invalid motion template schema: ${id}`);
  }

  registerTemplate(data);
  return data;
}

/** templates/ 내 모든 JSON */
export async function listMotionTemplates(): Promise<MotionTemplateDefinition[]> {
  const dir = getTemplatesDir();
  const entries = await readdir(dir, { withFileTypes: true });
  const jsonFiles = entries.filter(
    (e) => e.isFile() && e.name.endsWith('.json'),
  );

  const templates = await Promise.all(
    jsonFiles.map((e) =>
      loadMotionTemplate(path.basename(e.name, '.json')),
    ),
  );

  return sortTemplatesForDisplay(templates);
}

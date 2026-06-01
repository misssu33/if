/** localStorage 키 — MotionDot 익명 분석 */
export const ANALYTICS_STORAGE_KEYS = {
  anonId: 'motiondot_anon_id',
  visitCount: 'motiondot_visit_count',
  exportCount: 'motiondot_export_count',
  lastTemplate: 'motiondot_last_template',
  lastPreset: 'motiondot_last_preset',
  segment: 'motiondot_segment',
  firstVisitTs: 'motiondot_first_visit_ts',
  destinationPromptSeen: 'motiondot_destination_prompt_seen',
} as const;

/** sessionStorage — 세션당 1회 방문 카운트 */
export const ANALYTICS_SESSION_KEYS = {
  visitRecorded: 'motiondot_visit_recorded',
  exportAttempt: 'motiondot_export_attempt',
} as const;

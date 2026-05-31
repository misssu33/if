/** 헬스체크 */
export async function GET() {
  return Response.json({ ok: true, service: 'MotionDot' });
}

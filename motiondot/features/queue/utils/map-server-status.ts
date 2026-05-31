import type { JobStatus } from '@/types';
import type { ConversionFileStatus } from '../types';

/** Redis/BullMQ 상태 → UI 상태 */
export function mapServerStatus(status: JobStatus | string): ConversionFileStatus {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'queued':
      return 'queued';
    case 'active':
      return 'processing';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
}

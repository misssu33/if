/**
 * @deprecated 신규 코드는 `./config`를 import 하세요.
 */
export {
  QUEUE_NAMES,
  ALL_QUEUE_NAMES,
  JOB_NAMES,
  type QueueName,
  type JobName,
  PENDING_JOB_ID_PREFIX,
  pendingJobId,
  isPendingJobId,
  redisKeys,
} from './config';

import { QUEUE_NAMES } from './config';

/** @deprecated `QUEUE_NAMES.EXPORT` (`export_queue`) 사용 */
export const MOTIONDOT_QUEUE_NAME = QUEUE_NAMES.EXPORT;

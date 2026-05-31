# lib/

서버·공용 인프라. React 컴포넌트는 두지 않습니다.

| Module | 역할 |
|--------|------|
| `ffmpeg/` | FFmpeg / fluent-ffmpeg (**유일한** 미디어 처리) |
| `queue/` | BullMQ Queue + 진행률 Redis |
| `redis/` | Redis 연결 설정 |
| `storage/` | temp/outputs 경로 |

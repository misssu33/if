import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

type Props = {
  headline: string;
  subline: string;
};

/** 애니메이션 텍스트 오버레이 */
export function TextOverlayLayer({ headline, subline }: Props) {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#18181b',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
      }}
    >
      <div style={{ transform: `translateY(${y}px)`, opacity, textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: 48, fontWeight: 800, margin: 0 }}>
          {headline}
        </p>
        <p style={{ color: '#a1a1aa', fontSize: 24, marginTop: 12 }}>{subline}</p>
      </div>
    </AbsoluteFill>
  );
}

import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';

type Props = {
  mediaSrc?: string;
  headline: string;
};

/** 혼합 미디어 템플릿 */
export function MixedMediaLayer({ mediaSrc, headline }: Props) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      {mediaSrc && (
        <Img
          src={mediaSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity,
          }}
        />
      )}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          padding: 32,
          background:
            'linear-gradient(transparent 40%, rgba(0,0,0,0.75) 100%)',
        }}
      >
        <p
          style={{
            color: '#fff',
            fontSize: 42,
            fontWeight: 700,
            opacity,
            margin: 0,
          }}
        >
          {headline}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

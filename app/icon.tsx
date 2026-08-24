import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#202224',
        border: '5px solid #191a1b',
        color: '#ffcc66',
        display: 'flex',
        fontFamily: 'monospace',
        fontSize: 38,
        fontWeight: 800,
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      $
    </div>,
    size,
  );
}

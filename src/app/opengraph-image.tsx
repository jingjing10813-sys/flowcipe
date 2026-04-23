import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Reciflo — AI 워크플로우 레시피'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f0f0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: '#e5e5e5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            🍳
          </div>
          <span style={{ fontSize: '28px', fontWeight: '700', color: '#e5e5e5', letterSpacing: '-0.5px' }}>
            Reciflo
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: '800',
            color: '#f5f5f5',
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          목표를 입력하면
          <br />
          AI 실행 흐름이 설계됩니다.
        </div>

        {/* Sub */}
        <div style={{ fontSize: '22px', color: '#737373', fontWeight: '500', marginBottom: '48px' }}>
          AI 툴을 재료로, Flow를 레시피로.
        </div>

        {/* Pill tags */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['ChatGPT', 'Midjourney', 'Notion', 'Claude'].map((tool) => (
            <div
              key={tool}
              style={{
                padding: '8px 18px',
                background: '#1e1e1e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '100px',
                fontSize: '16px',
                color: '#a3a3a3',
                fontWeight: '500',
              }}
            >
              {tool}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '80px',
            fontSize: '18px',
            color: '#404040',
            fontWeight: '500',
          }}
        >
          reciflo.com
        </div>
      </div>
    ),
    size,
  )
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Second Semester - 학습 관리 플래너";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1b4b, #312e81, #3b82f6)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
              color: "white",
            }}
          >
            2S
          </div>
          <div style={{ fontSize: 48, fontWeight: 800, color: "white" }}>
            Second Semester
          </div>
        </div>
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.8)", marginBottom: 48 }}>
          학습, 일정, 할 일, 출석을 한눈에 관리하는 스마트 학습 플래너
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["📚 학습 관리", "✅ 할 일", "📅 출석 체크", "🌤️ 날씨/뉴스", "📊 성과 리포트"].map(
            (item) => (
              <div
                key={item}
                style={{
                  padding: "12px 24px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}

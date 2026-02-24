import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          borderRadius: 36,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, color: "white" }}>2S</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginTop: -4 }}>PLANNER</div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 40,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, color: "white" }}>2S</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginTop: -4 }}>PLANNER</div>
      </div>
    ),
    { ...size }
  );
}

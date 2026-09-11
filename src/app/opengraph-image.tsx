import { ImageResponse } from "next/og";
import { defaultSeoDescription, siteName } from "@/services/seoConfig";

export const alt = "Fintaraa financial services marketplace";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7fbff",
          color: "#07162d",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 28,
            fontWeight: 800,
            color: "#4c1d95",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#4c1d95",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            F
          </div>
          {siteName}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              borderRadius: 999,
              background: "#e8f8ef",
              color: "#067647",
              padding: "14px 24px",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            Loans • Credit Cards • Insurance • CIBIL
          </div>
          <div
            style={{
              maxWidth: 900,
              fontSize: 72,
              lineHeight: 1.02,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            Compare financial products with clarity.
          </div>
          <div
            style={{
              maxWidth: 850,
              fontSize: 28,
              lineHeight: 1.35,
              color: "#475467",
              fontWeight: 600,
            }}
          >
            {defaultSeoDescription}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            fontWeight: 800,
            color: "#4c1d95",
          }}
        >
          <span>fintaraa.com</span>
          <span>Trusted partner-assisted journeys</span>
        </div>
      </div>
    ),
    size,
  );
}

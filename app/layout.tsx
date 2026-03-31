import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://bez-rieltora.vercel.app"),
  title: "БезРієлтора | No Realtor",
  description:
    "Оголошення по Україні без рієлторів. Прямий контакт власника. Знайди квартиру без комісії.",

  verification: {
    google: "qL18S4J0gafPHZk9CSwWWg2fU1YaeAL3IEmgbuAz6sw",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          fontFamily: "Arial, sans-serif",
          background: "linear-gradient(to bottom, #0057b7 35%, #f8fafc 75%)",
        }}
      >
        <header
          style={{
            background: "#111827",
            color: "#ffffff",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "30px",
                height: "20px",
                display: "flex",
                flexDirection: "column",
                borderRadius: "3px",
                overflow: "hidden",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.2)",
              }}
            >
              <div style={{ background: "#0057b7", flex: 1 }} />
              <div style={{ background: "#ffd700", flex: 1 }} />
            </div>

            <span style={{ fontWeight: "bold", fontSize: "20px" }}>
              БезРієлтора | No Realtor
            </span>
          </div>

          <a
            href="/create"
            style={{
              padding: "10px 14px",
              background: "#2563eb",
              color: "#ffffff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Додати оголошення
          </a>
        </header>

        <main style={{ padding: "24px" }}>{children}</main>
      </body>
    </html>
  );
}
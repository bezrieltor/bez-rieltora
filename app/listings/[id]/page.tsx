"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Ad = {
  id: string;
  propertyType: string;
  oblast: string;
  district: string;
  city: string;
  price: string;
  contact: string;
  messenger: string;
  image: string;
  status?: string;
};

const disabledOblasts = ["Донецька область", "Луганська область"];

export default function ListingPage() {
  const params = useParams();
  const listingId = String(params?.id ?? "");

  const [ad, setAd] = useState<Ad | null>(null);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem("ads");
      if (!stored) {
        setAd(null);
        return;
      }

      const ads: Ad[] = JSON.parse(stored);

      const validAds = ads.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          item.id.trim() !== ""
      );

      const foundAd = validAds.find((item) => item.id === listingId);
      setAd(foundAd ?? null);
    } catch (error) {
      console.error("Failed to read listing from localStorage:", error);
      setAd(null);
    }
  }, [listingId]);

  if (!ad) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        Оголошення не знайдено
      </div>
    );
  }

  if (disabledOblasts.includes(ad.oblast)) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginTop: 0 }}>Оголошення недоступне</h1>
          <p style={{ color: "#64748b", marginBottom: 0 }}>
            Це оголошення не відображається на платформі.
          </p>
        </div>
      </div>
    );
  }

  if (ad.status === "reported") {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginTop: 0 }}>Оголошення на перевірці</h1>
          <p style={{ color: "#64748b", marginBottom: 0 }}>
            На це оголошення поскаржились як на рієлторське.
          </p>
        </div>
      </div>
    );
  }

  const handleReport = () => {
    setReported(true);

    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem("ads");
      if (!stored) return;

      const ads: Ad[] = JSON.parse(stored);
      const targetIndex = ads.findIndex((item) => item.id === listingId);

      if (targetIndex !== -1) {
        ads[targetIndex].status = "reported";
        window.localStorage.setItem("ads", JSON.stringify(ads));
        setAd({ ...ads[targetIndex] });
      }

      alert("Дякуємо. Оголошення приховано та позначено для перевірки.");
    } catch (error) {
      console.error("Failed to report listing in localStorage:", error);
      alert("Сталася помилка при оновленні оголошення.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        {ad.image ? (
          <img
            src={ad.image}
            alt={ad.propertyType}
            style={{
              width: "100%",
              height: "420px",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "320px",
              background: "#e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              fontSize: "18px",
            }}
          >
            Немає фото
          </div>
        )}

        <div style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "36px",
                }}
              >
                {ad.propertyType}
              </h1>

              <p
                style={{
                  marginTop: "10px",
                  marginBottom: 0,
                  fontSize: "28px",
                  fontWeight: 700,
                }}
              >
                {ad.price}$ / місяць
              </p>
            </div>

            <span
              style={{
                background: "#eff6ff",
                color: "#1d4ed8",
                padding: "8px 12px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {ad.city}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "14px",
                border: "1px solid #e2e8f0",
              }}
            >
              <strong>Область:</strong>
              <div style={{ marginTop: "6px", color: "#475569" }}>
                {ad.oblast}
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "14px",
                border: "1px solid #e2e8f0",
              }}
            >
              <strong>Обласне місто:</strong>
              <div style={{ marginTop: "6px", color: "#475569" }}>
                {ad.city}
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "14px",
                border: "1px solid #e2e8f0",
              }}
            >
              <strong>Район:</strong>
              <div style={{ marginTop: "6px", color: "#475569" }}>
                {ad.district}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#ecfdf5",
              borderRadius: "14px",
              padding: "16px",
              border: "1px solid #bbf7d0",
              marginBottom: "18px",
              color: "#166534",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "18px" }}>
              Контакт власника відкритий безкоштовно
            </div>
            <div style={{ fontSize: "14px", marginTop: "6px" }}>
              На старті платформи зв’язок із власником відкритий безкоштовно.
            </div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              borderRadius: "14px",
              padding: "18px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "10px",
              }}
            >
              Контакт власника
            </h3>

            <div
              style={{
                marginTop: "8px",
                background: "#ecfdf5",
                border: "1px solid #bbf7d0",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <p style={{ marginTop: 0, marginBottom: "8px" }}>
                <strong>Месенджер:</strong> {ad.messenger}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Контакт:</strong> {ad.contact}
              </p>
            </div>

            {!reported && (
              <div
                style={{
                  marginTop: "18px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    color: "#b91c1c",
                    fontSize: "18px",
                    fontWeight: 800,
                    marginBottom: "8px",
                  }}
                >
                  Помітили рієлтора?
                </div>

                <p
                  style={{
                    marginTop: 0,
                    marginBottom: "14px",
                    color: "#7f1d1d",
                    fontSize: "15px",
                    lineHeight: 1.5,
                  }}
                >
                  Якщо це оголошення розмістив агент або рієлтор, натисніть
                  кнопку нижче. Оголошення буде приховано та позначено для
                  перевірки.
                </p>

                <button
                  onClick={handleReport}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    background: "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 800,
                  }}
                >
                  Поскаржитись: це рієлтор
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
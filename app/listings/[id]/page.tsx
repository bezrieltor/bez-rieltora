"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

function parseImages(imageValue: string | null | undefined): string[] {
  if (!imageValue) return [];

  try {
    const parsed = JSON.parse(imageValue);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item) => typeof item === "string" && item.trim() !== ""
      );
    }
  } catch {
    // старий формат з одним фото
  }

  return typeof imageValue === "string" && imageValue.trim() !== ""
    ? [imageValue]
    : [];
}

function normalizePhoneForTel(value: string): string {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

function getMessengerHref(messenger: string, contact: string): string | null {
  const trimmed = contact.trim();

  if (!trimmed) return null;

  if (messenger === "Телефон") {
    const telValue = normalizePhoneForTel(trimmed);
    return telValue ? `tel:${telValue}` : null;
  }

  if (messenger === "Telegram") {
    if (trimmed.startsWith("@")) {
      return `https://t.me/${trimmed.slice(1)}`;
    }
    return `https://t.me/${trimmed}`;
  }

  if (messenger === "WhatsApp") {
    const phone = normalizePhoneForTel(trimmed).replace("+", "");
    return phone ? `https://wa.me/${phone}` : null;
  }

  if (messenger === "Viber") {
    const phone = normalizePhoneForTel(trimmed);
    return phone ? `viber://chat?number=${encodeURIComponent(phone)}` : null;
  }

  return null;
}

function getMessengerButtonText(messenger: string): string {
  if (messenger === "Телефон") return "Подзвонити";
  if (messenger === "Telegram") return "Написати в Telegram";
  if (messenger === "WhatsApp") return "Написати в WhatsApp";
  if (messenger === "Viber") return "Написати в Viber";
  return "Зв’язатися";
}

export default function ListingPage() {
  const params = useParams();
  const listingId = String(params?.id ?? "");

  const [ad, setAd] = useState<Ad | null>(null);
  const [reported, setReported] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const fetchAd = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", listingId)
        .single();

      if (error) {
        console.error(error);
        setAd(null);
        return;
      }

      const nextAd: Ad = {
        id: data.id,
        propertyType: data.propertytype,
        oblast: data.oblast,
        district: data.district,
        city: data.city,
        price: data.price,
        contact: data.contact,
        messenger: data.messenger,
        image: data.image,
        status: data.status,
      };

      setAd(nextAd);

      const parsedImages = parseImages(nextAd.image);
      setSelectedImage(parsedImages[0] ?? "");
    };

    if (listingId) {
      fetchAd();
    }
  }, [listingId]);

  const images = useMemo(() => parseImages(ad?.image), [ad?.image]);
  const messengerHref = useMemo(
    () => getMessengerHref(ad?.messenger ?? "", ad?.contact ?? ""),
    [ad?.messenger, ad?.contact]
  );

  const normalizedPhone = useMemo(
    () => normalizePhoneForTel(ad?.contact ?? ""),
    [ad?.contact]
  );

  const whatsappHref = useMemo(() => {
    const phone = normalizedPhone.replace("+", "");
    return phone ? `https://wa.me/${phone}` : null;
  }, [normalizedPhone]);

  const viberHref = useMemo(() => {
    return normalizedPhone
      ? `viber://chat?number=${encodeURIComponent(normalizedPhone)}`
      : null;
  }, [normalizedPhone]);

  const telHref = useMemo(() => {
    return normalizedPhone ? `tel:${normalizedPhone}` : null;
  }, [normalizedPhone]);

  const handleReport = async () => {
    if (!listingId) return;

    const { error } = await supabase
      .from("listings")
      .update({ status: "reported" })
      .eq("id", listingId);

    if (error) {
      console.error(error);
      alert("Сталася помилка при оновленні оголошення.");
      return;
    }

    setReported(true);
    setAd((prev) => (prev ? { ...prev, status: "reported" } : prev));
    alert("Дякуємо. Оголошення приховано та позначено для перевірки.");
  };

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
        {selectedImage ? (
          <img
            src={selectedImage}
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

        {images.length > 1 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "10px",
              padding: "14px 14px 0 14px",
              background: "#ffffff",
            }}
          >
            {images.map((img, index) => (
              <button
                key={`${img}-${index}`}
                onClick={() => setSelectedImage(img)}
                style={{
                  padding: 0,
                  border:
                    selectedImage === img
                      ? "2px solid #2563eb"
                      : "1px solid #e5e7eb",
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                <img
                  src={img}
                  alt={`Фото ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "90px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </button>
            ))}
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
              <strong>Місто:</strong>
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

              <p style={{ marginTop: 0, marginBottom: "14px" }}>
                <strong>Контакт:</strong> {ad.contact}
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {messengerHref && (
                  <a
                    href={messengerHref}
                    target={ad.messenger === "Телефон" ? "_self" : "_blank"}
                    rel="noreferrer"
                    style={{
                      padding: "12px 16px",
                      background: "#2563eb",
                      color: "#ffffff",
                      textDecoration: "none",
                      borderRadius: "10px",
                      fontWeight: 700,
                    }}
                  >
                    {getMessengerButtonText(ad.messenger)}
                  </a>
                )}

                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "12px 16px",
                      background: "#25D366",
                      color: "#ffffff",
                      textDecoration: "none",
                      borderRadius: "10px",
                      fontWeight: 700,
                    }}
                  >
                    WhatsApp
                  </a>
                )}

                {viberHref && (
                  <a
                    href={viberHref}
                    style={{
                      padding: "12px 16px",
                      background: "#7360F2",
                      color: "#ffffff",
                      textDecoration: "none",
                      borderRadius: "10px",
                      fontWeight: 700,
                    }}
                  >
                    Viber
                  </a>
                )}

                {telHref && (
                  <a
                    href={telHref}
                    style={{
                      padding: "12px 16px",
                      background: "#16a34a",
                      color: "#ffffff",
                      textDecoration: "none",
                      borderRadius: "10px",
                      fontWeight: 700,
                    }}
                  >
                    Подзвонити
                  </a>
                )}
              </div>
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
"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PropertyType = "Квартира" | "Дім" | "Гараж";
type MessengerType = "Telegram" | "Viber" | "WhatsApp" | "Телефон";

const oblastDistricts: Record<string, string[]> = {
  "Київська область": ["Білоцерківський", "Бориспільський", "Броварський"],
  "Львівська область": ["Львівський", "Дрогобицький"],
  "Одеська область": ["Одеський", "Ізмаїльський"],
  "Дніпропетровська область": ["Дніпровський", "Криворізький"],
  "м. Київ": ["Шевченківський", "Печерський", "Дарницький"],
};

const oblastCenterCities: Record<string, string[]> = {
  "Київська область": ["Біла Церква", "Бровари"],
  "Львівська область": ["Львів"],
  "Одеська область": ["Одеса"],
  "Дніпропетровська область": ["Дніпро"],
  "м. Київ": ["Київ"],
};

function makeAdId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function CreatePage() {
  const router = useRouter();
  const oblasts = Object.keys(oblastDistricts);

  const [propertyType, setPropertyType] = useState<PropertyType>("Квартира");
  const [oblast, setOblast] = useState<string>("м. Київ");
  const [city, setCity] = useState<string>(oblastCenterCities["м. Київ"][0]);
  const [district, setDistrict] = useState<string>(
    oblastDistricts["м. Київ"][0]
  );
  const [price, setPrice] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [messenger, setMessenger] = useState<MessengerType>("Telegram");
  const [image, setImage] = useState<string>("");
  const [isOwnerConfirmed, setIsOwnerConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const districts = useMemo(() => oblastDistricts[oblast] ?? [], [oblast]);
  const cities = useMemo(() => oblastCenterCities[oblast] ?? [], [oblast]);

  const handleOblastChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextOblast = e.target.value;
    const nextDistricts = oblastDistricts[nextOblast] ?? [];
    const nextCities = oblastCenterCities[nextOblast] ?? [];

    setOblast(nextOblast);
    setDistrict(nextDistricts[0] ?? "");
    setCity(nextCities[0] ?? "");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!oblast || !district || !city || !price || !contact) {
      alert("Заповни всі поля");
      return;
    }

    if (!isOwnerConfirmed) {
      alert("Потрібно підтвердити, що ти власник житла");
      return;
    }

    setLoading(true);

    const normalizedContact = contact.trim().toLowerCase();

    const { data: existing, error: checkError } = await supabase
      .from("listings")
      .select("id, contact")
      .eq("contact", normalizedContact);

    if (checkError) {
      console.error(checkError);
      alert("Помилка перевірки");
      setLoading(false);
      return;
    }

    if (existing && existing.length >= 2) {
      alert("Максимум 2 оголошення на один контакт. Це захист від рієлторів.");
      setLoading(false);
      return;
    }

    const status =
      existing && existing.length >= 1 ? "suspicious" : "active";

    const { error } = await supabase.from("listings").insert([
      {
        id: makeAdId(),
        propertytype: propertyType,
        oblast,
        district,
        city,
        price,
        contact: normalizedContact,
        messenger,
        image,
        status,
        createdat: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Помилка при створенні");
      return;
    }

    alert("Оголошення додано");

    setPropertyType("Квартира");
    setOblast("м. Київ");
    setCity(oblastCenterCities["м. Київ"][0]);
    setDistrict(oblastDistricts["м. Київ"][0]);
    setPrice("");
    setContact("");
    setMessenger("Telegram");
    setImage("");
    setIsOwnerConfirmed(false);

    router.push("/");
    router.refresh();
  };

  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "24px 16px 40px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: "12px",
            fontSize: "34px",
          }}
        >
          Додати оголошення
        </h1>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "14px",
            marginBottom: "20px",
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: "#16a34a", fontWeight: 700 }}>
            Платформа тільки для власників.
          </span>{" "}
          <span style={{ color: "#dc2626", fontWeight: 700 }}>
            Агентські та рієлторські оголошення приховуються та видаляються після перевірки.
          </span>
        </div>

        <div style={gridStyle}>
          <div style={fieldBlockStyle}>
            <label style={labelStyle}>Тип обʼєкта</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              style={inputStyle}
            >
              <option value="Квартира">Квартира</option>
              <option value="Дім">Дім</option>
              <option value="Гараж">Гараж</option>
            </select>
          </div>

          <div style={fieldBlockStyle}>
            <label style={labelStyle}>Область</label>
            <select
              value={oblast}
              onChange={handleOblastChange}
              style={inputStyle}
            >
              {oblasts.map((oblastName) => (
                <option key={oblastName} value={oblastName}>
                  {oblastName}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldBlockStyle}>
            <label style={labelStyle}>Обласне місто</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={inputStyle}
            >
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldBlockStyle}>
            <label style={labelStyle}>Район</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={inputStyle}
            >
              {districts.map((districtName) => (
                <option key={districtName} value={districtName}>
                  {districtName}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldBlockStyle}>
            <label style={labelStyle}>Ціна, $</label>
            <input
              placeholder="Наприклад: 700"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={fieldBlockStyle}>
            <label style={labelStyle}>Месенджер</label>
            <select
              value={messenger}
              onChange={(e) => setMessenger(e.target.value as MessengerType)}
              style={inputStyle}
            >
              <option value="Telegram">Telegram</option>
              <option value="Viber">Viber</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Телефон">Телефон</option>
            </select>
          </div>

          <div style={{ ...fieldBlockStyle, gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Контакт</label>
            <input
              placeholder="Наприклад: @owner1 або +380..."
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <label style={labelStyle}>Фото</label>
          <div
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: "14px",
              padding: "18px",
              background: "#f8fafc",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
            <p
              style={{
                marginBottom: 0,
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Завантаж головне фото квартири, дому або гаража.
            </p>
          </div>
        </div>

        {image && (
          <div style={{ marginTop: "20px" }}>
            <label style={labelStyle}>Попередній перегляд</label>
            <img
              src={image}
              alt="Попередній перегляд"
              style={{
                width: "100%",
                maxHeight: "360px",
                objectFit: "cover",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
              }}
            />
          </div>
        )}

        <div
          style={{
            marginTop: "20px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "14px",
          }}
        >
          <label
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              lineHeight: 1.5,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={isOwnerConfirmed}
              onChange={(e) => setIsOwnerConfirmed(e.target.checked)}
              style={{ marginTop: "4px" }}
            />
            <span>
              Я підтверджую, що я{" "}
              <span style={{ color: "#16a34a", fontWeight: 700 }}>
                власник житла
              </span>
              , а{" "}
              <span style={{ color: "#dc2626", fontWeight: 700 }}>
                не рієлтор або агент
              </span>
              . У разі неправдивих даних оголошення буде приховано та видалено після перевірки.
            </span>
          </label>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={buttonStyle}>
          {loading ? "Додавання..." : "Додати оголошення"}
        </button>
      </div>
    </div>
  );
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "16px",
  alignItems: "start",
};

const fieldBlockStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  marginBottom: "8px",
  fontWeight: 700,
  fontSize: "15px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
  background: "#ffffff",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "24px",
  padding: "14px 18px",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 700,
};
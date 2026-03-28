"use client";

import { ChangeEvent, useMemo, useState } from "react";

type PropertyType = "Квартира" | "Дім" | "Гараж";
type MessengerType = "Telegram" | "Viber" | "WhatsApp" | "Телефон";
type AdStatus = "active" | "suspicious" | "reported";

type Ad = {
  id: string;
  propertyType: PropertyType;
  oblast: string;
  district: string;
  city: string;
  price: string;
  contact: string;
  messenger: MessengerType;
  image: string;
  status: AdStatus;
  isOwnerConfirmed: boolean;
  createdAt: string;
};

const oblastDistricts: Record<string, string[]> = {
  "Вінницька область": [
    "Вінницький",
    "Гайсинський",
    "Жмеринський",
    "Могилів-Подільський",
    "Тульчинський",
    "Хмільницький",
  ],
  "Волинська область": [
    "Володимирський",
    "Камінь-Каширський",
    "Ковельський",
    "Луцький",
  ],
  "Дніпропетровська область": [
    "Дніпровський",
    "Кам’янський",
    "Криворізький",
    "Нікопольський",
    "Новомосковський",
    "Павлоградський",
    "Синельниківський",
  ],
  "Житомирська область": [
    "Бердичівський",
    "Житомирський",
    "Звягельський",
    "Коростенський",
  ],
  "Закарпатська область": [
    "Берегівський",
    "Мукачівський",
    "Рахівський",
    "Тячівський",
    "Ужгородський",
    "Хустський",
  ],
  "Запорізька область": [
    "Бердянський",
    "Василівський",
    "Запорізький",
    "Мелітопольський",
    "Пологівський",
  ],
  "Івано-Франківська область": [
    "Верховинський",
    "Івано-Франківський",
    "Калуський",
    "Коломийський",
    "Косівський",
    "Надвірнянський",
  ],
  "Київська область": [
    "Білоцерківський",
    "Бориспільський",
    "Броварський",
    "Бучанський",
    "Вишгородський",
    "Обухівський",
    "Фастівський",
  ],
  "Кіровоградська область": [
    "Голованівський",
    "Кропивницький",
    "Новоукраїнський",
    "Олександрійський",
  ],
  "Львівська область": [
    "Дрогобицький",
    "Золочівський",
    "Львівський",
    "Самбірський",
    "Стрийський",
    "Червоноградський",
    "Яворівський",
  ],
  "Миколаївська область": [
    "Баштанський",
    "Вознесенський",
    "Миколаївський",
    "Первомайський",
  ],
  "Одеська область": [
    "Березівський",
    "Білгород-Дністровський",
    "Болградський",
    "Ізмаїльський",
    "Одеський",
    "Подільський",
    "Роздільнянський",
  ],
  "Полтавська область": [
    "Кременчуцький",
    "Лубенський",
    "Миргородський",
    "Полтавський",
  ],
  "Рівненська область": [
    "Вараський",
    "Дубенський",
    "Рівненський",
    "Сарненський",
  ],
  "Сумська область": [
    "Конотопський",
    "Охтирський",
    "Роменський",
    "Сумський",
    "Шосткинський",
  ],
  "Тернопільська область": [
    "Кременецький",
    "Тернопільський",
    "Чортківський",
  ],
  "Харківська область": [
    "Богодухівський",
    "Ізюмський",
    "Красноградський",
    "Куп’янський",
    "Лозівський",
    "Харківський",
    "Чугуївський",
  ],
  "Херсонська область": [
    "Бериславський",
    "Генічеський",
    "Каховський",
    "Скадовський",
    "Херсонський",
  ],
  "Хмельницька область": [
    "Кам’янець-Подільський",
    "Хмельницький",
    "Шепетівський",
  ],
  "Черкаська область": [
    "Звенигородський",
    "Золотоніський",
    "Уманський",
    "Черкаський",
  ],
  "Чернівецька область": [
    "Вижницький",
    "Дністровський",
    "Чернівецький",
  ],
  "Чернігівська область": [
    "Корюківський",
    "Ніжинський",
    "Новгород-Сіверський",
    "Прилуцький",
    "Чернігівський",
  ],
  "м. Київ": [
    "Голосіївський",
    "Дарницький",
    "Деснянський",
    "Дніпровський",
    "Оболонський",
    "Печерський",
    "Подільський",
    "Святошинський",
    "Солом’янський",
    "Шевченківський",
  ],
};

const oblastCenterCities: Record<string, string[]> = {
  "Вінницька область": ["Вінниця"],
  "Волинська область": ["Луцьк"],
  "Дніпропетровська область": ["Дніпро"],
  "Житомирська область": ["Житомир"],
  "Закарпатська область": ["Ужгород"],
  "Запорізька область": ["Запоріжжя"],
  "Івано-Франківська область": ["Івано-Франківськ"],
  "Київська область": [
    "Біла Церква",
    "Бориспіль",
    "Бровари",
    "Буча",
    "Вишгород",
    "Обухів",
    "Фастів",
  ],
  "Кіровоградська область": ["Кропивницький"],
  "Львівська область": ["Львів"],
  "Миколаївська область": ["Миколаїв"],
  "Одеська область": ["Одеса"],
  "Полтавська область": ["Полтава"],
  "Рівненська область": ["Рівне"],
  "Сумська область": ["Суми"],
  "Тернопільська область": ["Тернопіль"],
  "Харківська область": ["Харків"],
  "Херсонська область": ["Херсон"],
  "Хмельницька область": ["Хмельницький"],
  "Черкаська область": ["Черкаси"],
  "Чернівецька область": ["Чернівці"],
  "Чернігівська область": ["Чернігів"],
  "м. Київ": ["Київ"],
};

function makeAdId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function CreatePage() {
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

  const handleSubmit = () => {
    if (!oblast || !district || !city || !price || !contact) {
      alert("Заповни всі поля");
      return;
    }

    if (!isOwnerConfirmed) {
      alert("Потрібно підтвердити, що ти власник житла");
      return;
    }

    const stored = localStorage.getItem("ads");
    const ads: Ad[] = stored ? JSON.parse(stored) : [];

    const normalizedContact = contact.trim().toLowerCase();

    const sameContactAds = ads.filter(
      (a) => a.contact.trim().toLowerCase() === normalizedContact
    );

    if (sameContactAds.length >= 2) {
      alert("Максимум 2 оголошення на один контакт. Це захист від рієлторів.");
      return;
    }

    const isSuspicious = sameContactAds.length >= 1;

    const newAd: Ad = {
      id: makeAdId(),
      propertyType,
      oblast,
      district,
      city,
      price,
      contact,
      messenger,
      image,
      status: isSuspicious ? "suspicious" : "active",
      isOwnerConfirmed: true,
      createdAt: new Date().toISOString(),
    };

    ads.push(newAd);

    localStorage.setItem("ads", JSON.stringify(ads));
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

        <button onClick={handleSubmit} style={buttonStyle}>
          Додати оголошення
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
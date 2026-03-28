"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
  createdAt?: string;
};

const disabledOblasts = ["Донецька область", "Луганська область"];

const availableOblasts = [
  "Вінницька область",
  "Волинська область",
  "Дніпропетровська область",
  "Житомирська область",
  "Закарпатська область",
  "Запорізька область",
  "Івано-Франківська область",
  "Київська область",
  "Кіровоградська область",
  "Львівська область",
  "Миколаївська область",
  "Одеська область",
  "Полтавська область",
  "Рівненська область",
  "Сумська область",
  "Тернопільська область",
  "Харківська область",
  "Херсонська область",
  "Хмельницька область",
  "Черкаська область",
  "Чернівецька область",
  "Чернігівська область",
  "м. Київ",
];

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

const allRegionalCities = [
  "Вінниця",
  "Луцьк",
  "Дніпро",
  "Житомир",
  "Ужгород",
  "Запоріжжя",
  "Івано-Франківськ",
  "Біла Церква",
  "Бориспіль",
  "Бровари",
  "Буча",
  "Вишгород",
  "Обухів",
  "Фастів",
  "Кропивницький",
  "Львів",
  "Миколаїв",
  "Одеса",
  "Полтава",
  "Рівне",
  "Суми",
  "Тернопіль",
  "Харків",
  "Херсон",
  "Хмельницький",
  "Черкаси",
  "Чернівці",
  "Чернігів",
  "Київ",
];

export default function HomePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedOblast, setSelectedOblast] = useState<string>("Усі області");
  const [selectedCity, setSelectedCity] = useState<string>("Усі міста");

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem("ads");

      if (!stored) {
        setAds([]);
        return;
      }

      const parsed: Ad[] = JSON.parse(stored);

      const validAds = parsed.filter(
        (ad) =>
          ad &&
          typeof ad === "object" &&
          typeof ad.id === "string" &&
          ad.id.trim() !== ""
      );

      setAds(validAds);
    } catch (error) {
      console.error("Failed to read ads from localStorage:", error);
      setAds([]);
    }
  }, []);

  const cleanAds = useMemo(() => {
    return ads.filter(
      (ad) => !disabledOblasts.includes(ad.oblast) && ad.status !== "reported"
    );
  }, [ads]);

  const oblasts = useMemo(() => {
    return ["Усі області", ...availableOblasts];
  }, []);

  const cities = useMemo(() => {
    if (selectedOblast === "Усі області") {
      return ["Усі міста", ...allRegionalCities];
    }

    const oblastCities = oblastCenterCities[selectedOblast] ?? [];
    return ["Усі міста", ...oblastCities];
  }, [selectedOblast]);

  const filteredAds = useMemo(() => {
    let result = cleanAds;

    if (selectedOblast !== "Усі області") {
      result = result.filter((ad) => ad.oblast === selectedOblast);
    }

    if (selectedCity !== "Усі міста") {
      result = result.filter((ad) => ad.city === selectedCity);
    }

    return [...result].reverse();
  }, [cleanAds, selectedOblast, selectedCity]);

  return (
    <div
      style={{
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "10px 10px 36px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "22px",
          padding: "26px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.7)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 420px" }}>
            <h1
              style={{
                marginTop: 0,
                marginBottom: "10px",
                fontSize: "40px",
                lineHeight: 1.1,
              }}
            >
              Оголошення по Україні
            </h1>

            <p
              style={{
                marginTop: 0,
                marginBottom: "12px",
                color: "#475569",
                fontSize: "16px",
              }}
            >
              Список оголошень безкоштовний. Контакт власника на старті відкритий
              безкоштовно.
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {filteredAds.length} оголошень
              </span>

              <span
                style={{
                  background: "#ecfdf5",
                  color: "#047857",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Нові зверху
              </span>

              <span
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Анти-рієлтор
              </span>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "360px",
              display: "grid",
              gap: "14px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                Обрати область
              </label>

              <select
                value={selectedOblast}
                onChange={(e) => {
                  setSelectedOblast(e.target.value);
                  setSelectedCity("Усі міста");
                }}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              >
                {oblasts.map((oblast) => (
                  <option key={oblast} value={oblast}>
                    {oblast}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                Обласне місто
              </label>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredAds.length === 0 ? (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "22px",
            padding: "34px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "10px",
              fontSize: "34px",
            }}
          >
            Оголошень поки немає
          </h2>

          <p
            style={{
              color: "#64748b",
              maxWidth: "640px",
              margin: "0 auto",
              fontSize: "16px",
            }}
          >
            Додай перше оголошення і одразу подивись, як воно виглядає для
            людини, яка шукає житло.
          </p>

          <Link
            href="/create"
            style={{
              display: "inline-block",
              marginTop: "18px",
              padding: "13px 20px",
              background: "#2563eb",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            Додати оголошення
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
            gap: "22px",
          }}
        >
          {filteredAds.map((ad) => (
            <Link
              key={`${ad.id}-${ad.createdAt ?? ""}`}
              href={`/listings/${ad.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                  border: "1px solid #e5e7eb",
                  transition: "transform 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "230px",
                    background: "#e2e8f0",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {ad.image ? (
                    <img
                      src={ad.image}
                      alt={ad.propertyType}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748b",
                        fontSize: "15px",
                      }}
                    >
                      Немає фото
                    </div>
                  )}

                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "#2563eb",
                      color: "#fff",
                      padding: "7px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Нове
                  </div>

                  {ad.status === "suspicious" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "#f59e0b",
                        color: "#fff",
                        padding: "7px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      Перевірка
                    </div>
                  )}
                </div>

                <div style={{ padding: "18px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      gap: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "25px",
                        lineHeight: 1.1,
                      }}
                    >
                      {ad.propertyType}
                    </h3>

                    <span
                      style={{
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ad.city}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    {ad.price}$ / місяць
                  </p>

                  <p
                    style={{
                      margin: "0 0 8px 0",
                      color: "#475569",
                    }}
                  >
                    <strong>Область:</strong> {ad.oblast}
                  </p>

                  <p
                    style={{
                      margin: "0 0 8px 0",
                      color: "#475569",
                    }}
                  >
                    <strong>Обласне місто:</strong> {ad.city}
                  </p>

                  <p
                    style={{
                      margin: "0 0 8px 0",
                      color: "#475569",
                    }}
                  >
                    <strong>Район:</strong> {ad.district}
                  </p>

                  <p
                    style={{
                      margin: "12px 0 0 0",
                      color: "#64748b",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Контакт відкритий безкоштовно
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
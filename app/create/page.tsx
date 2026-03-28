"use client";

import React, { ChangeEvent, useMemo, useState } from "react";

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
    setOblast(nextOblast);
    setDistrict(oblastDistricts[nextOblast]?.[0] ?? "");
    setCity(oblastCenterCities[nextOblast]?.[0] ?? "");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!oblast || !district || !city || !price || !contact) {
      alert("Заповни всі поля");
      return;
    }

    if (!isOwnerConfirmed) {
      alert("Підтверди що ти власник");
      return;
    }

    const stored = localStorage.getItem("ads");
    const ads: Ad[] = stored ? JSON.parse(stored) : [];

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
      status: "active",
      isOwnerConfirmed: true,
      createdAt: new Date().toISOString(),
    };

    ads.push(newAd);
    localStorage.setItem("ads", JSON.stringify(ads));

    alert("Оголошення додано");

    setPrice("");
    setContact("");
    setImage("");
    setIsOwnerConfirmed(false);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h1>Додати оголошення</h1>

      <select value={propertyType} onChange={(e) => setPropertyType(e.target.value as PropertyType)}>
        <option>Квартира</option>
        <option>Дім</option>
        <option>Гараж</option>
      </select>

      <select value={oblast} onChange={handleOblastChange}>
        {oblasts.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>

      <select value={city} onChange={(e) => setCity(e.target.value)}>
        {cities.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <select value={district} onChange={(e) => setDistrict(e.target.value)}>
        {districts.map((d) => (
          <option key={d}>{d}</option>
        ))}
      </select>

      <input placeholder="Ціна" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Контакт" value={contact} onChange={(e) => setContact(e.target.value)} />

      <select value={messenger} onChange={(e) => setMessenger(e.target.value as MessengerType)}>
        <option>Telegram</option>
        <option>Viber</option>
        <option>WhatsApp</option>
        <option>Телефон</option>
      </select>

      <input type="file" onChange={handleImageChange} />

      <label>
        <input type="checkbox" checked={isOwnerConfirmed} onChange={(e) => setIsOwnerConfirmed(e.target.checked)} />
        Я власник
      </label>

      <button onClick={handleSubmit}>Додати</button>
    </div>
  );
}
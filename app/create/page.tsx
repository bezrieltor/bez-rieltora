"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
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

  const handleSubmit = async () => {
    if (!oblast || !district || !city || !price || !contact) {
      alert("Заповни всі поля");
      return;
    }

    if (!isOwnerConfirmed) {
      alert("Підтверди що ти власник");
      return;
    }

    setLoading(true);

    const normalizedContact = contact.trim().toLowerCase();

    const { data: existing, error: existingError } = await supabase
      .from("listings")
      .select("id, contact")
      .eq("contact", normalizedContact);

    if (existingError) {
      console.error(existingError);
      alert("Помилка перевірки контакту");
      setLoading(false);
      return;
    }

    if (existing && existing.length >= 2) {
      alert("Максимум 2 оголошення на один контакт");
      setLoading(false);
      return;
    }

    const newStatus = existing && existing.length >= 1 ? "suspicious" : "active";

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
        status: newStatus,
        createdat: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Помилка при збереженні");
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
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h1>Додати оголошення</h1>

      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value as PropertyType)}
      >
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

      <input
        placeholder="Ціна"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        placeholder="Контакт"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />

      <select
        value={messenger}
        onChange={(e) => setMessenger(e.target.value as MessengerType)}
      >
        <option>Telegram</option>
        <option>Viber</option>
        <option>WhatsApp</option>
        <option>Телефон</option>
      </select>

      <input type="file" onChange={handleImageChange} />

      <label>
        <input
          type="checkbox"
          checked={isOwnerConfirmed}
          onChange={(e) => setIsOwnerConfirmed(e.target.checked)}
        />
        Я власник
      </label>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Збереження..." : "Додати"}
      </button>
    </div>
  );
}
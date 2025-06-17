// app/page.tsx or any page
"use client"

import { useState } from "react";
import { MarketCard } from "../dashboard/MarketCard";
import type { MarketMeta } from "@/types/market";

export default function MarketGrid() {
  const [markets, setMarkets] = useState<MarketMeta[]>([]);
  const [idInput, setIdInput] = useState("");

  const handleAddMarket = () => {
    if (!idInput) return;

    // Fake market data, in real case fetch from backend
    const newMarket: MarketMeta = {
      id: idInput,
      name: "Will hollow knight Silksong release in July?",
      image: "/yin-yang.png", // adjust path
      yesPercent: 65,
      noPercent: 35,
      volume: "$10m",
    };

    setMarkets(prev => [...prev, newMarket]);
    setIdInput("");
  };

  return (
    // cringe section of code for testing shiet!
    <div className="p-8">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Market ID"
          className="px-4 py-2 rounded-md text-black"
          value={idInput}
          onChange={e => setIdInput(e.target.value)}
        />
        <button
          onClick={handleAddMarket}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Add Market
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {markets.map((meta, idx) => (
          <MarketCard
            id = {meta.id}
            name={meta.name}
            image={meta.image}
            yesPercent = {meta.yesPercent}
            noPercent = {meta.noPercent}
            volume = {meta.volume}/>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const priceData = [
  { time: "12:00", price: 12.1 },
  { time: "13:00", price: 11.8 },
  { time: "14:00", price: 11.5 },
  { time: "15:00", price: 11.9 },
  { time: "16:00", price: 12.3 },
  { time: "17:00", price: 12.0 },
  { time: "18:00", price: 12.4 },
  { time: "19:00", price: 12.2 },
  { time: "20:00", price: 12.8 },
  { time: "21:00", price: 13.1 },
  { time: "22:00", price: 13.6 },
  { time: "23:00", price: 14.0 },
  { time: "00:00", price: 14.5 },
  { time: "03:00", price: 14.2 },
  { time: "06:00", price: 14.8 },
  { time: "09:00", price: 15.1 },
  { time: "12:00", price: 15.35 },
];

const timeFilters = ["15 min", "30 min", "1H", "24H", "WEEK", "MONTH", "ALL"];

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}
  >
    {children}
  </div>
);

export default function SwapView() {
  const [activeFilter, setActiveFilter] = useState("24H");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  return (
    <div className="w-full px-8 md:px-16 py-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {["SWAP", "Liquidity"].map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              tab === "SWAP"
                ? "bg-[#1e1e7a] text-white border border-white/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
        {/* Chart Card */}
        <Card className="p-6">
          {/* Time filters */}
          <div className="flex gap-2 mb-6 justify-end flex-wrap">
            {timeFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeFilter === f
                    ? "bg-white text-[#1a1a6e] font-bold"
                    : "text-white/60 hover:text-white border border-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Price info */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">$15.35</span>
              <span className="text-green-400 font-semibold">+34.69%</span>
            </div>
            <div className="text-white/40 text-sm mt-1">2022.11.18. 22:34</div>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f7931a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f7931a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a5e",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: 12,
                  }}
                  formatter={(v: any) => [`$${v}`, "Price"]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#f7931a"
                  strokeWidth={2}
                  fill="url(#orangeGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Swap Widget */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Swap</h2>
            <button className="text-white/40 hover:text-white transition-colors">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* From */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-2">
            <div className="text-white/50 text-xs mb-2 font-medium">From</div>
            <div className="flex items-center justify-between">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                className="bg-transparent text-2xl text-white/40 outline-none w-28 placeholder-white/30"
              />
              <div className="flex items-center gap-2">
                <button className="text-[#5b9cf6] text-sm font-medium hover:text-blue-300">Max</button>
                <div className="flex items-center gap-2 bg-yellow-500 rounded-full px-3 py-1.5">
                  <span className="text-black text-xs font-bold">⬡</span>
                  <span className="text-black text-sm font-semibold">BNB</span>
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" className="text-black">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-white/30 text-xs mt-2">Balance: 0.0</div>
          </div>

          {/* Swap arrows */}
          <div className="flex justify-center my-3">
            <button className="text-[#5b9cf6] hover:scale-110 transition-transform">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-6">
            <div className="text-white/50 text-xs mb-2 font-medium">To</div>
            <div className="flex items-center justify-between">
              <input
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder="0.0"
                className="bg-transparent text-2xl text-white/40 outline-none w-28 placeholder-white/30"
              />
              <button className="bg-[#1e1e7a] text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20 hover:bg-[#2a2a9e] transition-all">
                Select a Token
              </button>
            </div>
            <div className="text-white/30 text-xs mt-2">Balance: 0.0</div>
          </div>

          {/* Action button */}
          <button className="w-full py-4 rounded-xl bg-[#1a1a5e] border border-white/10 text-white font-semibold text-base hover:bg-[#22227a] transition-all">
            Enter an Amount
          </button>
        </Card>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const lineData = [
  { t: "19:00", v: 42000 }, { t: "19:10", v: 40000 }, { t: "19:20", v: 38000 },
  { t: "19:30", v: 36000 }, { t: "19:40", v: 32000 }, { t: "19:50", v: 22000 },
];

const barData = [
  { t: "19:00", v: 48000 }, { t: "19:05", v: 34000 }, { t: "19:10", v: 50000 },
  { t: "19:15", v: 28000 }, { t: "19:20", v: 42000 }, { t: "19:25", v: 22000 },
  { t: "19:30", v: 38000 }, { t: "19:35", v: 44000 }, { t: "19:40", v: 36000 },
  { t: "19:45", v: 48000 }, { t: "19:50", v: 30000 },
];

const tokens = [
  { rank: 1, coin: "BNB", price: "$285.40", change: "+2.14%", volume: "$1.2B", positive: true },
  { rank: 2, coin: "ETH", price: "$1,890.20", change: "-0.83%", volume: "$8.4B", positive: false },
  { rank: 3, coin: "BTC", price: "$27,340.00", change: "+1.64%", volume: "$18.2B", positive: true },
  { rank: 4, coin: "MATIC", price: "$0.8820", change: "+3.22%", volume: "$412M", positive: true },
  { rank: 5, coin: "SOL", price: "$21.45", change: "-1.10%", volume: "$890M", positive: false },
];

const tooltipStyle = {
  background: "#1a1a5e",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 ${className}`}>
    {children}
  </div>
);

export default function OverviewView() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="w-full px-8 md:px-16 py-4">
      {/* Tabs + Search */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex gap-2">
          {["Overview", "Pools", "Tokens"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-[#1e1e7a] text-white border border-white/20"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.4)" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            placeholder="Search terms here..."
            className="bg-transparent text-sm text-white/60 outline-none placeholder-white/30 w-48"
          />
          <button className="bg-[#1e1e7a] text-white text-xs px-3 py-1 rounded-full border border-white/20">
            Search
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Liquidity */}
        <Card>
          <div className="text-white font-bold text-lg mb-1">Liquidity</div>
          <div className="text-white text-3xl font-bold mb-1">$355 352 102</div>
          <div className="text-white/40 text-sm mb-6">Sep 19, 2022</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5b9cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5b9cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Liquidity"]} />
                <Area type="monotone" dataKey="v" stroke="#5b9cf6" strokeWidth={2} fill="url(#blueGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 24H Volume */}
        <Card>
          <div className="text-white font-bold text-lg mb-1">24H Volume</div>
          <div className="text-white text-3xl font-bold mb-1">$125 352 002</div>
          <div className="text-white/40 text-sm mb-6">Sep 19, 2022</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Volume"]} />
                <Bar dataKey="v" fill="rgba(91,156,246,0.5)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Tokens Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">Top Tokens</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white text-sm px-4 py-2 rounded-full">
              USDT
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </button>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white text-sm px-4 py-2 rounded-full">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              Filter Periode
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {["Rank", "Coin", "Last Price", "Change (24h)", "Volume (24h)", "Graph"].map((h) => (
                  <th key={h} className="text-left text-white/50 text-xs font-medium px-6 py-4">
                    {h} {h !== "Graph" && <span className="ml-1 opacity-60">⇅</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => (
                <tr key={t.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white/60 text-sm">{t.rank}</td>
                  <td className="px-6 py-4 text-white font-medium text-sm">{t.coin}</td>
                  <td className="px-6 py-4 text-white text-sm">{t.price}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${t.positive ? "text-green-400" : "text-red-400"}`}>{t.change}</td>
                  <td className="px-6 py-4 text-white/70 text-sm">{t.volume}</td>
                  <td className="px-6 py-4">
                    <div className="w-20 h-8 opacity-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={lineData.slice(0, 4)}>
                          <Area type="monotone" dataKey="v" stroke={t.positive ? "#4ade80" : "#f87171"} strokeWidth={1.5} fill="none" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

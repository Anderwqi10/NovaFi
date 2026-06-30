import React, { useState, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { useLiveData } from "../hooks/useLiveData";
import { fetchCoinChart, fetchTopCoins } from "../services/coingecko.service";

const timeOptions: { label: string; days: number | string }[] = [
  { label: "1H", days: 0.04 },
  { label: "24H", days: 1 },
  { label: "7D", days: 7 },
  { label: "1M", days: 30 },
  { label: "1A", days: 365 },
];

const TIP = {
  background: "#0c0c24",
  border: "1px solid rgba(99,102,241,0.3)",
  borderRadius: 12,
  color: "#e2e8f0",
  fontSize: 12,
};

const Spinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-7 h-7 border-2 border-indigo-800 border-t-cyan-400 rounded-full animate-spin" />
  </div>
);

export default function SwapView() {
  const [activeFilter, setActiveFilter] = useState(timeOptions[1]);
  const [fromAmount, setFromAmount] = useState("");

  const chartFetcher = useCallback(
    () => fetchCoinChart("binancecoin", activeFilter.days),
    [activeFilter.days]
  );
  const priceFetcher = useCallback(() => fetchTopCoins(5), []);

  const { data: chartData, loading: chartLoading, lastUpdated } = useLiveData(chartFetcher, 30000);
  const { data: coins, loading: coinsLoading } = useLiveData(priceFetcher, 30000);

  const bnb = coins?.find((c) => c.id === "binancecoin");
  const currentPrice = bnb?.current_price ?? 0;
  const change24h = bnb?.price_change_percentage_24h ?? 0;
  const positive = change24h >= 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8 py-6">
      {/* Tabs */}
      <div className="flex gap-1 mb-8">
        {["SWAP", "Liquidity"].map((tab, idx) => (
          <button key={tab}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              idx === 0
                ? "bg-indigo-950 border border-indigo-700/50 text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >{tab}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">
        {/* Chart Card */}
        <div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              {coinsLoading ? (
                <div className="h-10 w-48 rounded-lg bg-indigo-900/20 animate-pulse" />
              ) : (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-slate-100">${currentPrice.toLocaleString()}</span>
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded-lg ${positive ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
                    {positive ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}%
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-500 text-sm">BNB / USD</span>
                {lastUpdated && <span className="text-slate-700 text-xs">· {lastUpdated.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}</span>}
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {timeOptions.map((f) => (
                <button key={f.label} onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeFilter.label === f.label
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-slate-500 border border-indigo-900/40 hover:text-slate-300 hover:border-indigo-700/50"
                  }`}
                >{f.label}</button>
              ))}
            </div>
          </div>

          {chartLoading ? <Spinner /> : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bnbGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip contentStyle={TIP} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "BNB"]} />
                  <Area type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} fill="url(#bnbGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Swap Widget */}
        <div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-100">Swap</h2>
            <button className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* From */}
          <div className="rounded-xl bg-[#080818] border border-indigo-900/40 p-4 mb-2 focus-within:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 text-xs font-medium">From</span>
              <button className="text-cyan-400 text-xs font-semibold hover:text-cyan-300">Max</button>
            </div>
            <div className="flex items-center justify-between gap-3 mt-2">
              <input type="number" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-2xl font-semibold text-slate-100 outline-none flex-1 min-w-0 placeholder-slate-700"
              />
              <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-xl px-3 py-1.5 shrink-0">
                <span className="text-amber-400 text-sm font-bold">⬡</span>
                <span className="text-amber-300 text-sm font-semibold">BNB</span>
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" className="text-amber-400">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <div className="text-slate-600 text-xs mt-2">
              {fromAmount && currentPrice
                ? `≈ $${(parseFloat(fromAmount) * currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "Balance: 0.0"}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-3">
            <button className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-cyan-400 hover:bg-indigo-900/50 hover:scale-105 transition-all">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To */}
          <div className="rounded-xl bg-[#080818] border border-indigo-900/40 p-4 mb-6 focus-within:border-cyan-500/40 transition-all">
            <span className="text-slate-500 text-xs font-medium">To</span>
            <div className="flex items-center justify-between gap-3 mt-2">
              <span className="text-2xl font-semibold text-slate-600">0.00</span>
              <button className="flex items-center gap-1.5 bg-indigo-950 border border-indigo-700/50 text-slate-300 text-sm font-semibold px-3 py-1.5 rounded-xl hover:border-cyan-500/40 hover:text-white transition-all shrink-0">
                Select token
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>
            <div className="text-slate-600 text-xs mt-2">Balance: 0.0</div>
          </div>

          <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-cyan-500/15 mt-auto">
            Enter an amount
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const coinData: Record<string, any> = {
  Bitcoin: {
    symbol: "BTC",
    color: "#f7931a",
    price: "$27,340.00",
    change: "+1.64%",
    volume: "$18.2B",
    marketCap: "$530.4B",
    rate: "1 BTC = 27,340 USD",
    description:
      "Bitcoin is the world's first decentralized digital currency, created in 2009 by the pseudonymous Satoshi Nakamoto. It operates on a peer-to-peer network without a central authority, enabling secure, borderless transactions through cryptographic proof.",
  },
  Ethereum: {
    symbol: "ETH",
    color: "#00d4b5",
    price: "$11,898.15",
    change: "+1.64%",
    volume: "$47.22B",
    marketCap: "$219.24B",
    rate: "1 Eth = 380.43 USD",
    description:
      "Launched in 2015, Ethereum is an open-source, blockchain-based, decentralized software platform used for its own cryptocurrency, ether. It enables SmartContracts and Distributed Applications (DApps) to be built and run without any downtime, fraud, control, or interference from a third party.\n\nEthereum is not just a platform but also a programming language (Turing complete) running on a blockchain, helping developers to build and publish distributed applications.",
  },
  Monero: {
    symbol: "XMR",
    color: "#ff6600",
    price: "$148.30",
    change: "+0.92%",
    volume: "$78M",
    marketCap: "$2.7B",
    rate: "1 XMR = 148.30 USD",
    description:
      "Monero is a privacy-focused cryptocurrency that uses ring signatures, stealth addresses, and RingCT to obfuscate sender, receiver, and amount details on its blockchain.",
  },
  Litecoin: {
    symbol: "LTC",
    color: "#a0aec0",
    price: "$68.20",
    change: "-0.45%",
    volume: "$320M",
    marketCap: "$4.9B",
    rate: "1 LTC = 68.20 USD",
    description:
      "Litecoin is a peer-to-peer Internet currency that enables instant, near-zero cost payments to anyone in the world. It is an open source, global payment network.",
  },
};

const chartData = [
  { week: "Week 01", v: 380000 }, { week: "Week 02", v: 320000 },
  { week: "Week 03", v: 280000 }, { week: "Week 04", v: 500000 },
  { week: "Week 05", v: 820000 }, { week: "Week 06", v: 220000 },
  { week: "Week 07", v: 380000 }, { week: "Week 08", v: 520000 },
  { week: "Week 09", v: 680000 }, { week: "Week 10", v: 800000 },
];

const coinIcons: Record<string, string> = {
  Bitcoin: "₿",
  Ethereum: "Ξ",
  Monero: "ɱ",
  Litecoin: "Ł",
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

export default function CoinDetailsView() {
  const [activeCoin, setActiveCoin] = useState("Ethereum");
  const coin = coinData[activeCoin];

  return (
    <div className="w-full px-8 md:px-16 py-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-white text-3xl font-bold">Coin Details</h1>
        <div className="flex gap-6">
          {Object.keys(coinData).map((name) => (
            <button
              key={name}
              onClick={() => setActiveCoin(name)}
              className={`flex items-center gap-2 pb-1 text-sm font-semibold transition-all ${
                activeCoin === name
                  ? "text-white border-b-2 border-[#e84141]"
                  : "text-white/50 hover:text-white border-b-2 border-transparent"
              }`}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: coinData[name].color }}
              >
                {coinIcons[name]}
              </span>
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* About card */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">About</span>
            <button className="text-white/40 hover:text-white">⋮</button>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ background: coin.color }}
            >
              {coinIcons[activeCoin]}
            </div>
            <div>
              <div className="text-white font-bold text-lg">{activeCoin}</div>
              <div className="text-white/40 text-sm">{coin.symbol}</div>
              <div className="text-white/40 text-xs">{coin.rate}</div>
            </div>
          </div>
          <p className="text-white/50 text-xs leading-5 whitespace-pre-line">{coin.description}</p>
        </Card>

        {/* Chart card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
            <div>
              <div className="text-white font-semibold text-lg">Coin Chart</div>
              <div className="text-white/40 text-xs">Lorem ipsum dolor sit amet, consectetur</div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg">
                📅 4 June 2020 – 17 June 2020
              </button>
              <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg">
                USD ($ US Dollar)
                <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-4 mb-6 flex-wrap">
            <div>
              <div className="text-white/40 text-xs">Price</div>
              <div className="text-white text-2xl font-bold">{coin.price}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs">24h% change</div>
              <div className="text-green-400 font-semibold text-sm flex items-center gap-1">
                {coin.change} ▲
              </div>
            </div>
            <div>
              <div className="text-white/40 text-xs">Volume (24h)</div>
              <div className="text-white font-semibold">{coin.volume}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs">Market Cap</div>
              <div className="text-white font-semibold">{coin.marketCap}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="coinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={coin.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={coin.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "#1a1a5e", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontSize: 12 }}
                  formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Value"]}
                />
                <ReferenceLine x="Week 06" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="v" stroke={coin.color} strokeWidth={2.5} fill="url(#coinGrad)" dot={false}
                  activeDot={{ r: 6, fill: coin.color, stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Tooltip bubble */}
            <div
              className="absolute top-2 left-[48%] bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ transform: "translateX(-50%)" }}
            >
              <div>$748k</div>
              <div className="font-normal opacity-90">2 July 2020</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

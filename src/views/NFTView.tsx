import React, { useState } from "react";

const categories = ["ALL", "TOP NFTs", "Celebrities", "Gaming", "Sport", "Music", "Crypto"];

const nfts = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "ArtCrypto",
  price: "0.25 BNB",
  total: "1 of 321",
  timeLeft: "3h 50m 2s left",
}));

const sellers = [
  { name: "Sam Lee", handle: "@samlee", following: false },
  { name: "Jane Donald", handle: "@janedoe", following: true },
  { name: "Lois Lane", handle: "@supermanchic", following: false },
  { name: "Barry Allen", handle: "@flash", following: false },
  { name: "Jenner Foster", handle: "@jennerfos", following: false },
  { name: "Sam Lee", handle: "@samlee", following: false },
  { name: "Jane Donald", handle: "@janedoe", following: true },
  { name: "Lois Lane", handle: "@supermanchic", following: false },
];

const avatarColors = ["#06b6d4", "#f7931a", "#10b981", "#6366f1", "#a855f7"];

const NFTCard = ({ nft }: { nft: any }) => (
  <div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] overflow-hidden hover:border-indigo-700/50 hover:shadow-lg hover:shadow-black/30 transition-all group">
    <div className="h-40 relative overflow-hidden">
      <div
        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        style={{
          background: `linear-gradient(135deg,
            hsl(${(nft.id * 47) % 360},70%,40%) 0%,
            hsl(${(nft.id * 47 + 120) % 360},75%,50%) 50%,
            hsl(${(nft.id * 47 + 240) % 360},70%,45%) 100%)`,
        }}
      />
      <div className="absolute bottom-2 left-2 flex -space-x-2">
        {[0, 1, 2].map((j) => (
          <div
            key={j}
            className="w-7 h-7 rounded-full border-2 border-[#0c0c24] flex items-center justify-center text-white text-xs font-bold"
            style={{ background: avatarColors[(nft.id + j) % avatarColors.length] }}
          >
            {String.fromCharCode(65 + ((nft.id + j) % 26))}
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-0.5">
        <span className="text-white text-[10px] font-medium">{nft.total}</span>
      </div>
    </div>

    <div className="p-4">
      <div className="text-slate-100 font-semibold mb-2">{nft.name} #{nft.id}</div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400 text-xs">⬡</span>
          <span className="text-slate-300 text-xs font-medium">{nft.price}</span>
        </div>
        <span className="text-slate-600 text-xs">{nft.timeLeft}</span>
      </div>
      <button className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-semibold hover:opacity-90 transition-all">
        Place a bid
      </button>
    </div>
  </div>
);

export default function NFTView() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [view, setView] = useState<"NFTs" | "Collections">("NFTs");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8 py-6">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-indigo-950 border border-indigo-700/50 text-white"
                  : "text-slate-500 border border-indigo-900/40 hover:text-slate-300 hover:border-indigo-700/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0c0c24] border border-indigo-900/40 rounded-xl px-3 py-2">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input placeholder="Search NFTs..." className="bg-transparent text-xs text-slate-300 outline-none placeholder-slate-600 w-28" />
          </div>
          <div className="flex gap-1 bg-[#0c0c24] rounded-xl p-1 border border-indigo-900/40">
            {(["NFTs", "Collections"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  view === v
                    ? "bg-indigo-950 border border-indigo-700/50 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-6">
        {/* NFT Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>

        {/* Top Sellers */}
        <div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-200 font-bold text-sm">Top Sellers</span>
            <button className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors">See All →</button>
          </div>
          <div className="flex flex-col gap-3">
            {sellers.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: avatarColors[i % avatarColors.length] }}
                  >
                    {s.name[0]}
                  </div>
                  <div>
                    <div className="text-slate-200 text-xs font-semibold">{s.name}</div>
                    <div className="text-slate-600 text-xs">{s.handle}</div>
                  </div>
                </div>
                <button
                  className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                    s.following
                      ? "border-indigo-800/50 text-slate-500"
                      : "bg-gradient-to-r from-cyan-500 to-violet-600 border-transparent text-white hover:opacity-90"
                  }`}
                >
                  {s.following ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

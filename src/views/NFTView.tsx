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
  <div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] overflow-hidden hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 group">
    <div className="h-44 relative overflow-hidden">
      <div
        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        style={{
          background: `linear-gradient(135deg,
            hsl(${(nft.id * 47) % 360},70%,40%) 0%,
            hsl(${(nft.id * 47 + 120) % 360},75%,50%) 50%,
            hsl(${(nft.id * 47 + 240) % 360},70%,45%) 100%)`,
        }}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute bottom-2.5 left-2.5 flex -space-x-2">
        {[0, 1, 2].map((j) => (
          <div
            key={j}
            className="w-7 h-7 rounded-full border-2 border-[#0c0c24] flex items-center justify-center text-white text-xs font-bold shadow-lg"
            style={{ background: avatarColors[(nft.id + j) % avatarColors.length] }}
          >
            {String.fromCharCode(65 + ((nft.id + j) % 26))}
          </div>
        ))}
      </div>

      <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1 border border-white/10">
        <span className="text-white text-[10px] font-semibold tracking-wide">{nft.total}</span>
      </div>
    </div>

    <div className="p-4">
      <div className="text-slate-100 font-bold text-sm mb-2.5">{nft.name} #{nft.id}</div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400 text-sm">⬡</span>
          <span className="text-slate-200 text-xs font-semibold">{nft.price}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
          <span className="text-slate-500 text-[10px]">{nft.timeLeft}</span>
        </div>
      </div>

      {/* Place a Bid button — glow effect on hover */}
      <button className="relative w-full py-2.5 rounded-xl text-white text-xs font-bold tracking-wide overflow-hidden group/btn transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-600 transition-opacity duration-300" />
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
        <span className="relative flex items-center justify-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Place a bid
        </span>
      </button>
    </div>
  </div>
);

export default function NFTView() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [view, setView] = useState<"NFTs" | "Collections">("NFTs");
  const [following, setFollowing] = useState<Record<number, boolean>>(
    Object.fromEntries(sellers.map((s, i) => [i, s.following]))
  );

  const toggleFollow = (index: number) => {
    setFollowing((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8 py-6">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Category pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/20 border border-transparent"
                  : "text-slate-400 border border-indigo-900/40 hover:text-white hover:border-cyan-500/30 hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#080818] border border-indigo-900/40 rounded-xl px-3 py-2 focus-within:border-cyan-500/40 transition-colors">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              placeholder="Search NFTs..."
              className="bg-transparent text-xs text-slate-300 outline-none placeholder-slate-600 w-28"
            />
          </div>

          {/* NFTs / Collections toggle */}
          <div className="flex gap-0.5 bg-[#080818] rounded-xl p-1 border border-indigo-900/40">
            {(["NFTs", "Collections"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  view === v
                    ? "bg-gradient-to-r from-cyan-500/20 to-violet-600/20 border border-indigo-700/50 text-white"
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
        <div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-5 h-fit">
          <div className="flex items-center justify-between mb-5">
            <span className="text-slate-100 font-bold text-sm">Top Sellers</span>
            <button className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors group/all">
              See All
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="group-hover/all:translate-x-0.5 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col divide-y divide-indigo-900/30">
            {sellers.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Rank */}
                  <span className="text-slate-600 text-[10px] font-bold w-4 shrink-0 text-right">{i + 1}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ring-1 ring-indigo-700/40 ring-offset-1 ring-offset-[#0c0c24]"
                    style={{ background: avatarColors[i % avatarColors.length] }}
                  >
                    {s.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-200 text-xs font-semibold truncate">{s.name}</div>
                    <div className="text-slate-600 text-[10px] truncate">{s.handle}</div>
                  </div>
                </div>

                {/* Follow button */}
                <button
                  onClick={() => toggleFollow(i)}
                  className={`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-lg transition-all duration-200 ${
                    following[i]
                      ? "bg-indigo-950 border border-indigo-800/50 text-slate-400 hover:border-red-800/50 hover:text-red-400 hover:bg-red-950/20"
                      : "bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:shadow-md hover:shadow-cyan-500/25 hover:opacity-90"
                  }`}
                >
                  {following[i] ? "Following" : "+ Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

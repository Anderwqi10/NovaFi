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

const avatarColors = ["#e84141", "#f7931a", "#00d4b5", "#5b9cf6", "#a855f7"];

const NFTCard = ({ nft }: { nft: any }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-all group">
    {/* Image placeholder with gradient */}
    <div className="h-40 relative overflow-hidden">
      <div
        className="w-full h-full"
        style={{
          background: `linear-gradient(135deg,
            hsl(${(nft.id * 47) % 360},70%,50%) 0%,
            hsl(${(nft.id * 47 + 120) % 360},80%,60%) 50%,
            hsl(${(nft.id * 47 + 240) % 360},70%,55%) 100%)`,
        }}
      />
      {/* Avatar stack */}
      <div className="absolute bottom-2 left-2 flex -space-x-2">
        {[0, 1, 2].map((j) => (
          <div
            key={j}
            className="w-7 h-7 rounded-full border-2 border-[#1a1a5e] flex items-center justify-center text-white text-xs font-bold"
            style={{ background: avatarColors[(nft.id + j) % avatarColors.length] }}
          >
            {String.fromCharCode(65 + ((nft.id + j) % 26))}
          </div>
        ))}
      </div>
    </div>

    <div className="p-4">
      <div className="text-white font-semibold mb-2">{nft.name}</div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-xs">⬡</span>
          <span className="text-white/60 text-xs">{nft.price}</span>
        </div>
        <span className="text-white/40 text-xs">{nft.total}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-xs">{nft.timeLeft}</span>
        <button className="text-[#e84141] text-xs font-semibold hover:text-red-400 transition-colors">
          Place a bid
        </button>
      </div>
    </div>
  </div>
);

export default function NFTView() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [view, setView] = useState<"NFTs" | "Collections">("NFTs");

  return (
    <div className="w-full px-8 md:px-16 py-4">
      {/* Filters row */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#1e1e7a] text-white border border-white/20"
                  : "text-white/60 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Search */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 ml-2">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.4)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              placeholder="Search terms here..."
              className="bg-transparent text-xs text-white/60 outline-none placeholder-white/30 w-32"
            />
            <button className="bg-[#1e1e7a] text-white text-xs px-2 py-0.5 rounded-full border border-white/20">
              Search
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {(["NFTs", "Collections"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                view === v
                  ? "bg-[#1e1e7a] text-white border border-white/20"
                  : "text-white/60 hover:text-white border border-white/10"
              }`}
            >
              {v}
            </button>
          ))}
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
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-bold">Top Sellers</span>
            <button className="text-[#e84141] text-xs hover:text-red-400">See All</button>
          </div>
          <div className="flex flex-col gap-3">
            {sellers.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: avatarColors[i % avatarColors.length] }}
                  >
                    {s.name[0]}
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold">{s.name}</div>
                    <div className="text-white/40 text-xs">{s.handle}</div>
                  </div>
                </div>
                <button
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    s.following
                      ? "border-white/20 text-white/60"
                      : "border-[#1e1e7a] bg-[#1e1e7a] text-white hover:bg-[#2a2a9e]"
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

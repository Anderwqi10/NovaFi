import React, { useState } from "react";

const sidebarCategories = [
  { icon: "🆕", title: "Newest and Recent", sub: "Find the latest update" },
  { icon: "🔥", title: "Popular of the day", sub: "Shots featured today by curators" },
  { icon: "👥", title: "Following", count: 24, sub: "Explore from your favorite person" },
];

const popularTags = [
  { tag: "#javascript", count: "82,645 Posted by this tag" },
  { tag: "#bitcoin", count: "65,523 Posted • Trending" },
  { tag: "#design", count: "51,354 • Trending in Bangladesh" },
  { tag: "#innovation", count: "48,029 Posted by this tag" },
];

const pinnedGroups = [
  { tag: "#bitcoin", count: "69,523 Posted • Trending" },
  { tag: "#blogging", count: "48,029 Posted by this tag" },
  { tag: "#tutorial", count: "51,354 • Trending in Bangladesh" },
];

const posts = [
  {
    id: 1,
    title: "Blockchain developer best practices on innovationchain",
    tags: ["finance", "bitcoin", "crypto"],
    author: "Pavel Gvay",
    time: "3 weeks ago",
    views: "651,324 Views",
    likes: "36,654 Likes",
    comments: "56 comments",
    coin: "BTC",
    coinSymbol: "Bitcoin",
    coinPrice: "$20,788",
    coinChange: "+0.25%",
    liked: false,
    chartColor: "#5b9cf6",
  },
  {
    id: 2,
    title: "The 4-step SEO framework that led to a 1000% increase in traffic. Let's talk about blogging and SEO...",
    tags: ["seo", "blogging", "traffic"],
    author: "AR Jakir",
    time: "3 days ago",
    views: "244,564 Views",
    likes: "10,920 Likes",
    comments: "184 comments",
    coin: "ETH",
    coinSymbol: "Ethereum",
    coinPrice: "$1,890",
    coinChange: "+1.2%",
    liked: true,
    chartColor: "#f7931a",
  },
];

const meetups = [
  { month: "FEB", day: "7", title: "UIHUT - Crunchbase Company Profile...", tags: ["Remote", "Part-time", "Worldwide"] },
  { month: "FEB", day: "3", title: "Design Meetups USA | Dribbble", tags: ["Remote", "Part-time"] },
  { month: "FEB", day: "5", title: "Meetup Brand Identity Design - Beha...", tags: ["Full Time", "Contract", "Worldwide"] },
];

const podcasts = [
  "Selling a Business and Scaling Another Amidst Tragedy.",
  "Mental health as a founder and the importance of community...",
  "Growing to $8.5k MRR in 1 year - Marie Martens, Tally.so",
  "Mental Health and Bootstrapping in 2022 with Rob Walling of TinySe",
  "Money, Happiness, and Productivity as a Solo Founder with Pieter Levels",
  "Mental health as a founder and the importance of community",
];

const avatarColors = ["#e84141", "#f7931a", "#00d4b5", "#5b9cf6", "#a855f7"];

const MiniChart = ({ color }: { color: string }) => {
  const points = [40, 35, 45, 30, 50, 25, 42];
  const w = 80, h = 40;
  const max = Math.max(...points), min = Math.min(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((p) => h - ((p - min) / (max - min)) * h);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  return (
    <svg width={w} height={h}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
};

export default function BlogView() {
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="w-full px-8 md:px-16 py-4">
      <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr_240px] gap-6">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Categories */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
            {sidebarCategories.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                className={`flex items-start gap-3 p-2 rounded-xl text-left transition-all ${
                  activeCategory === i ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{c.icon}</span>
                <div>
                  <div className="text-white text-xs font-semibold">
                    {c.title}
                    {c.count && (
                      <span className="ml-1 bg-[#1e1e7a] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {c.count}
                      </span>
                    )}
                  </div>
                  <div className="text-white/40 text-xs">{c.sub}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Popular Tags */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-white font-bold text-sm mb-3">Popular Tags</div>
            {popularTags.map((t, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-white/10 text-xs">
                  {["&lt;/&gt;", "₿", "✏️", "💡"][i]}
                </div>
                <div>
                  <div className="text-white text-xs font-medium">{t.tag}</div>
                  <div className="text-white/40 text-[10px]">{t.count}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pinned Group */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold text-sm">Pinned Group</span>
              <span className="text-[#e84141] text-xs">→</span>
            </div>
            {pinnedGroups.map((g, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: avatarColors[i % avatarColors.length] }}
                >
                  #
                </div>
                <div>
                  <div className="text-white text-xs font-medium">{g.tag}</div>
                  <div className="text-white/40 text-[10px]">{g.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Feed */}
        <div className="flex flex-col gap-4">
          {/* Create Post */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
              style={{ background: "#e84141" }}
            >
              U
            </div>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Let's share what going on your mind..."
              className="flex-1 bg-transparent text-white/50 outline-none text-sm placeholder-white/30"
            />
            <button className="bg-[#1e1e7a] text-white text-sm font-semibold px-5 py-2 rounded-xl border border-white/20 hover:bg-[#2a2a9e] transition-all whitespace-nowrap">
              Create Post
            </button>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <div key={post.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex gap-4">
                {/* Coin thumbnail */}
                <div className="flex-shrink-0 w-36 rounded-xl overflow-hidden bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-white/60 text-xs font-bold">{post.coin}</span>
                  </div>
                  <div className="text-white/40 text-[10px] mb-2">{post.coinSymbol}</div>
                  <MiniChart color={post.chartColor} />
                  <div className="text-white font-bold text-sm mt-2">{post.coinPrice}</div>
                  <div className="text-green-400 text-xs">{post.coinChange}</div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="text-white font-semibold text-base leading-snug mb-2">
                    {post.title}
                  </div>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: avatarColors[post.id % avatarColors.length] }}
                    >
                      {post.author[0]}
                    </div>
                    <div>
                      <span className="text-white text-xs font-medium">{post.author}</span>
                      <span className="text-white/30 text-xs ml-1">•</span>
                      <span className="text-white/40 text-xs ml-1">{post.time}</span>
                    </div>
                  </div>
                  <div className="flex gap-6 text-white/40 text-xs">
                    <span>{post.views}</span>
                    <span>{post.likes}</span>
                    <span>{post.comments}</span>
                  </div>
                </div>

                {/* Like button */}
                <div className="flex-shrink-0">
                  <button
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      post.liked ? "bg-[#e84141] text-white" : "bg-white/10 text-white/40 hover:text-white"
                    }`}
                  >
                    ♥
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Meetups */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold text-sm">Meetups</span>
              <span className="text-[#e84141] text-xs">→</span>
            </div>
            {meetups.map((m, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <div className="text-center">
                  <div className="text-white/40 text-[10px] uppercase">{m.month}</div>
                  <div className="text-white font-bold text-sm">{m.day}</div>
                </div>
                <div>
                  <div className="text-white text-xs font-medium leading-tight mb-1">{m.title}</div>
                  <div className="flex gap-1 flex-wrap">
                    {m.tags.map((tag) => (
                      <span key={tag} className="bg-white/10 text-white/60 text-[10px] px-1.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Podcasts */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold text-sm">Podcasts</span>
              <span className="text-[#e84141] text-xs">→</span>
            </div>
            {podcasts.map((p, i) => (
              <div key={i} className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: avatarColors[i % avatarColors.length] }}
                >
                  ▶
                </div>
                <div className="flex-1">
                  <div className="text-white text-[10px] leading-tight">{p}</div>
                </div>
                <button className="text-white/30 hover:text-white text-sm">→</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

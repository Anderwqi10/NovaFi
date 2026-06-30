import React, { useState, useEffect } from "react";
import {
  pgGetBlogPosts,
  pgLogin,
  pgRegister,
  saveSession,
  clearSession,
  getStoredUser,
  BlogPost,
  PgUser,
} from "../services/pg.api.service";

const sidebarCategories = [
  { icon: "🆕", label: "All", value: "" },
  { icon: "📈", label: "Market", value: "Market" },
  { icon: "⚙️", label: "Technology", value: "Technology" },
  { icon: "🏦", label: "DeFi", value: "DeFi" },
  { icon: "🖼️", label: "NFT", value: "NFT" },
  { icon: "⚖️", label: "Regulation", value: "Regulation" },
  { icon: "📚", label: "Education", value: "Education" },
];

const meetups = [
  { month: "JUL", day: "12", title: "DeFi Summit 2026 – Buenos Aires", tags: ["In-person", "Free"] },
  { month: "JUL", day: "18", title: "Blockchain Dev Meetup Online", tags: ["Remote", "Free"] },
  { month: "AUG", day: "3", title: "NFT & Web3 Expo – Medellín", tags: ["In-person", "Paid"] },
];

const podcasts = [
  "Bitcoin: The Future of Money with Nic Carter",
  "DeFi Explained for Beginners – Bankless",
  "Ethereum Layer 2: Everything You Need to Know",
  "How to Survive the Bear Market – The Crypto Mind",
  "NFTs and the New Digital Economy – Metaverse Today",
  "Crypto Security: Protect Your Assets – CryptoSec",
];

const avatarColors = ["#e84141", "#f7931a", "#00d4b5", "#5b9cf6", "#a855f7"];

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

function AuthModal({ onClose, onAuth }: { onClose: () => void; onAuth: (user: PgUser) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = mode === "login"
        ? await pgLogin(email, password)
        : await pgRegister(email, password, username);
      if (res.success) {
        saveSession(res.data.token, res.data.user);
        onAuth(res.data.user);
        onClose();
      } else {
        setError(res.msg || "Unknown error");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#080818] border border-indigo-900/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-100 font-bold text-xl">
            {mode === "login" ? "Sign in" : "Create account"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all text-lg">✕</button>
        </div>
        <div className="flex gap-1 mb-6 bg-[#0c0c24] rounded-xl p-1 border border-indigo-900/40">
          {(["login", "register"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === m ? "bg-indigo-950 border border-indigo-700/50 text-white" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {m === "login" ? "Sign in" : "Register"}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === "register" && (
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
              className="bg-[#0c0c24] border border-indigo-900/40 rounded-xl px-4 py-3 text-slate-100 text-sm outline-none placeholder-slate-600 focus:border-cyan-500/50 transition-all"
            />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="bg-[#0c0c24] border border-indigo-900/40 rounded-xl px-4 py-3 text-slate-100 text-sm outline-none placeholder-slate-600 focus:border-cyan-500/50 transition-all"
          />
          <input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="bg-[#0c0c24] border border-indigo-900/40 rounded-xl px-4 py-3 text-slate-100 text-sm outline-none placeholder-slate-600 focus:border-cyan-500/50 transition-all"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/15"
          >
            {loading ? "Loading..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BlogView() {
  const [activeCategory, setActiveCategory] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<PgUser | null>(getStoredUser());
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    setLoading(true);
    pgGetBlogPosts(10, 0)
      .then((res) => {
        if (res.success) setPosts(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts;

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8 py-6">
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onAuth={(u) => setUser(u)} />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_220px] gap-6">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-4">
          {/* User card */}
          <div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {user.username?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-100 text-sm font-semibold truncate">{user.username}</div>
                    <div className="text-slate-500 text-xs truncate">{user.email}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-slate-600 hover:text-cyan-400 text-xs text-left transition-colors">
                  Sign out →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="text-slate-200 text-sm font-semibold mb-1">Your account</div>
                <p className="text-slate-500 text-xs">Sign in to save favorites and create posts.</p>
                <button onClick={() => setShowAuth(true)}
                  className="mt-2 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Sign in / Register
                </button>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-4 flex flex-col gap-0.5">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Categories</div>
            {sidebarCategories.map((c) => (
              <button key={c.value} onClick={() => setActiveCategory(c.value)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm transition-all ${
                  activeCategory === c.value
                    ? "bg-indigo-950 border border-indigo-700/50 text-white"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/3"
                }`}
              >
                <span className="text-base">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center Feed */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-slate-100 font-bold text-lg">{activeCategory || "All posts"}</h2>
            <span className="text-slate-600 text-xs">{filtered.length} articles</span>
          </div>

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-5">
                <div className="flex gap-4">
                  <div className="w-28 h-24 rounded-xl bg-indigo-900/20 animate-pulse flex-shrink-0" />
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="h-5 w-3/4 bg-indigo-900/20 animate-pulse rounded" />
                    <div className="h-3 w-1/2 bg-indigo-900/20 animate-pulse rounded" />
                    <div className="h-3 w-full bg-indigo-900/20 animate-pulse rounded" />
                    <div className="h-3 w-4/5 bg-indigo-900/20 animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-8 text-center text-slate-600">
              No posts in this category yet.
            </div>
          ) : (
            filtered.map((post) => (
              <div key={post.id} className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-5 hover:border-indigo-700/50 hover:bg-indigo-950/30 transition-all">
                <div className="flex gap-4">
                  {post.image_url && (
                    <div className="flex-shrink-0 w-28 h-24 rounded-xl overflow-hidden bg-indigo-900/20">
                      <img src={post.image_url} alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="text-slate-100 font-semibold text-sm leading-snug mb-2">
                      {post.title}
                    </div>
                    <p className="text-slate-500 text-xs leading-5 line-clamp-2 mb-3">
                      {post.content}
                    </p>
                    <div className="flex gap-1.5 mb-3 flex-wrap">
                      {(post.tags || []).map((tag) => (
                        <span key={tag} className="bg-indigo-900/30 text-slate-500 text-[10px] px-2 py-0.5 rounded-full border border-indigo-900/40">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                        style={{ background: avatarColors[post.id % avatarColors.length] }}
                      >
                        {post.author[0]}
                      </div>
                      <span className="text-slate-300 text-xs font-medium">{post.author}</span>
                      <span className="text-slate-600 text-xs">·</span>
                      <span className="text-slate-500 text-xs">{timeAgo(post.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Events */}
          <div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-200 font-bold text-sm">Events</span>
              <span className="text-cyan-400 text-xs cursor-pointer hover:text-cyan-300">View all →</span>
            </div>
            {meetups.map((m, i) => (
              <div key={i} className={`flex gap-3 ${i < meetups.length - 1 ? "mb-3 pb-3 border-b border-indigo-900/30" : ""}`}>
                <div className="text-center min-w-[32px] bg-indigo-950/50 rounded-lg px-1 py-1.5 border border-indigo-900/40">
                  <div className="text-slate-600 text-[9px] uppercase font-semibold">{m.month}</div>
                  <div className="text-slate-200 font-bold text-sm leading-none">{m.day}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-slate-300 text-xs font-medium leading-tight mb-1.5 line-clamp-2">{m.title}</div>
                  <div className="flex gap-1 flex-wrap">
                    {m.tags.map((tag) => (
                      <span key={tag} className="bg-indigo-900/30 text-slate-500 text-[9px] px-1.5 py-0.5 rounded border border-indigo-900/40">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Podcasts */}
          <div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-200 font-bold text-sm">Podcasts</span>
              <span className="text-cyan-400 text-xs cursor-pointer hover:text-cyan-300">View all →</span>
            </div>
            {podcasts.map((p, i) => (
              <div key={i} className={`flex items-center gap-2.5 ${i < podcasts.length - 1 ? "mb-3" : ""}`}>
                <div
                  className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: avatarColors[i % avatarColors.length] }}
                >
                  ▶
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-400 text-[10px] leading-tight line-clamp-2">{p}</div>
                </div>
                <button className="text-slate-600 hover:text-cyan-400 text-xs transition-colors shrink-0">→</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

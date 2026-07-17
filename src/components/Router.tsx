import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

const SwapView       = lazy(() => import("../views/SwapView"));
const LiquidityView  = lazy(() => import("../views/LiquidityView"));
const OverviewView   = lazy(() => import("../views/OverviewView"));
const CoinDetailsView = lazy(() => import("../views/CoinDetailsView"));
const NFTView        = lazy(() => import("../views/NFTView"));
const BlogView       = lazy(() => import("../views/BlogView"));
const NotFound       = lazy(() => import("../views/NotFound"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
  </div>
);

const Layout = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
  </>
);

export function Routers() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/swap"      element={<SwapView />} />
          <Route path="/liquidity" element={<LiquidityView />} />
          <Route path="/overview"  element={<OverviewView />} />
          <Route path="/coins"     element={<CoinDetailsView />} />
          <Route path="/nft"       element={<NFTView />} />
          <Route path="/blog"      element={<BlogView />} />

          <Route path="/" element={<Navigate to="/swap" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default Routers;

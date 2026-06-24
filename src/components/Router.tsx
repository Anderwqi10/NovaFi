import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import PrivateRoutes from "./helper/PrivateRoutes";
import PublicRoutes from "./helper/PublicRoutes";

import Dashboard from "../views/Dashboard";
import SwapView from "../views/SwapView";
import OverviewView from "../views/OverviewView";
import CoinDetailsView from "../views/CoinDetailsView";
import NFTView from "../views/NFTView";
import BlogView from "../views/BlogView";
import GoogleLogin from "../views/GoogleLogin";
import GoogleRedirect from "../views/GoogleRedirect";
import ResetPassword from "./auth/ResetPassword";
import Profile from "./profile/Profile";
import EditProfile from "./profile/EditProfile";

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
    <Routes>
      <Route element={<Layout />}>
        {/* New design screens */}
        <Route path="/swap" element={<SwapView />} />
        <Route path="/liquidity" element={<SwapView />} />
        <Route path="/overview" element={<OverviewView />} />
        <Route path="/coins" element={<CoinDetailsView />} />
        <Route path="/nft" element={<NFTView />} />
        <Route path="/blog" element={<BlogView />} />

        {/* Existing routes */}
        <Route path="/prediction" element={<Dashboard />} />
        <Route
          path="/reset-password"
          element={
            <PublicRoutes>
              <ResetPassword />
            </PublicRoutes>
          }
        />
        <Route
          path="/google/login"
          element={
            <PrivateRoutes>
              <GoogleLogin />
            </PrivateRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoutes>
              <Profile />
            </PrivateRoutes>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoutes>
              <EditProfile />
            </PrivateRoutes>
          }
        />
        <Route path="/google/redirect" element={<GoogleRedirect />} />

        {/* Default: Swap as home */}
        <Route path="/" element={<Navigate to="/swap" />} />
      </Route>
    </Routes>
  );
}

export default Routers;

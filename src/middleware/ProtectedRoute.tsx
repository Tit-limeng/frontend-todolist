import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api } from "../api/api";
import LoadingBar from "react-top-loading-bar";
import type { LoadingBarRef } from "react-top-loading-bar";
import { useRef } from "react";


export function ProtectedRoute() {
  const loadingBarRef = useRef<LoadingBarRef>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    loadingBarRef.current?.continuousStart();
    const checkAuth = async () => {
      try {
        await api.get("/auth/check");
        await new Promise(i=>setTimeout(i,1500));
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
        console.error("Authentication check failed:", error);
      } finally {
        setLoading(false);
        loadingBarRef.current?.complete();
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <>

      <LoadingBar
        color="#f11946"
        ref={loadingBarRef}
        height={4}
        shadow
      />

    </>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}


export function GuestRoute() {
  const loadingBarRef = useRef<LoadingBarRef>(null);
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    loadingBarRef.current?.continuousStart();

    const checkAuth = async () => {
      try {

        if (location.pathname === "/auth/forgot-password") {
          return <Outlet />;
        }
        await api.get("/auth/check");
        await new Promise(i=>setTimeout(i,1500));
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        loadingBarRef.current?.complete();
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <>
        <LoadingBar
          color="#f11946"
          ref={loadingBarRef}
          height={4}
          shadow
        />
      </>
    );
  }

  return authenticated ? <Navigate to="/" replace /> : <Outlet />;
}
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { api } from "../api/api";
import LoadingBar from "react-top-loading-bar";
import type { LoadingBarRef } from "react-top-loading-bar";
import { useRef } from "react";


export  function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/check"); 
        setAuthenticated(true);
      } catch (error ) {
        setAuthenticated(false);
        console.error("Authentication check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}


// export function GuestRoute() {
//   const loadingBarRef = useRef<LoadingBarRef>(null);
//   const [loading, setLoading] = useState(true);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         await api.get("/auth/check");
//         setAuthenticated(true);
//       } catch {
//         setAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   if (loading) {
//         loadingBarRef.current?.continuousStart() ;
//             loadingBarRef.current?.complete();

//    <>
//         <LoadingBar
//         color="#6fc276"
//         ref={loadingBarRef}
//         height={4}
//         shadow={true}
//       />
//       </>
//   }

//   return authenticated ? <Navigate to="/" replace /> : <Outlet />;
// }

export function GuestRoute() {
  const loadingBarRef = useRef<LoadingBarRef>(null);

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    loadingBarRef.current?.continuousStart();

    const checkAuth = async () => {
      try {
        await api.get("/auth/check");
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
          color="#6fc276"
          ref={loadingBarRef}
          height={4}
          shadow
        />
      </>
    );
  }

  return authenticated ? <Navigate to="/" replace /> : <Outlet />;
}
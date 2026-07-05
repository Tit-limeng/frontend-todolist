// // components/ProtectedRoute.tsx

// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { api } from "../api/api";

// interface Props {
//   children: React.ReactNode;
// }

// export default function ProtectedRoute({ children }: Props) {
//   const [loading, setLoading] = useState(true);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkLogin = async () => {
//       try {
//         await api.get("/auth/check");
//         setAuthenticated(true);
//       } catch {
//         setAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkLogin();
//   }, []);

//   if (loading) {
//     return <h2>Loading...</h2>;
//   }

//   if (!authenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// }


import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { api } from "../api/api";

export default function ProtectedRoute() {
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
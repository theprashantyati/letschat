import { WallpaperProvider } from "./context/WallpaperContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "@clerk/react";
import PageLoader from "./components/PageLoader";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

import { Toaster } from "react-hot-toast";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  // option 1
  // const { checkAuth, isCheckingAuth, clearAuth } = useAuthStore();

  // option 2 - better for performance
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) checkAuth();
    else clearAuth();
  }, [checkAuth, clearAuth, isLoaded, isSignedIn]);

  
  if (!isLoaded || (isSignedIn && isCheckingAuth)) return <PageLoader />;

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />} />
          <Route
            path="/auth"
            element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}
          />
        </Routes>
        <Toaster />
      </WallpaperProvider>
    </ThemeProvider>
  );
}

export default App;


// import { WallpaperProvider } from "./context/WallpaperContext";
// import { ThemeProvider } from "./context/ThemeContext";
// import { Navigate, Route, Routes } from "react-router";
// import ChatPage from "./pages/ChatPage";
// import AuthPage from "./pages/AuthPage";
// import { useAuth } from "@clerk/react";
// import PageLoader from "./components/PageLoader";
// import { useAuthStore } from "./store/useAuthStore";
// import { useEffect } from "react";

// import { Toaster } from "react-hot-toast";

// function App() {
//   const { isSignedIn, isLoaded } = useAuth();
//   // option 2 - better for performance
//   const clearAuth = useAuthStore((state) => state.clearAuth);
//   const checkAuth = useAuthStore((state) => state.checkAuth);
//   const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

//   useEffect(() => {
//     if (!isLoaded) return;

//     if (isSignedIn) {
//       // First sync user to MongoDB
//       syncUserToDatabase();
//       // Then check auth
//       checkAuth();
//     } else {
//       clearAuth();
//     }
//   }, [checkAuth, clearAuth, isLoaded, isSignedIn]);

//   const syncUserToDatabase = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sync-user`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });

//       if (response.ok) {
//         console.log("✅ User synced to MongoDB");
//       } else {
//         console.error("❌ Failed to sync user to MongoDB");
//       }
//     } catch (error) {
//       console.error("Error syncing user:", error);
//     }
//   };

//   if (!isLoaded || (isSignedIn && isCheckingAuth)) return <PageLoader />;

//   return (
//     <ThemeProvider>
//       <WallpaperProvider>
//         <Routes>
//           <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />} />
//           <Route
//             path="/auth"
//             element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}
//           />
//         </Routes>
//         <Toaster />
//       </WallpaperProvider>
//     </ThemeProvider>
//   );
// }

// export default App;
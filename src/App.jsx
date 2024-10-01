import { Route, Routes, useNavigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Registor from "./pages/Registor";
import Seting from "./pages/Seting";
import Home from "./pages/Home";
import Login from "./pages/Login";
import File from "./pages/File";
import { useEffect, useState } from "react";
import BoardDetail from "./pages/BoardDetail";

function App() {
  const [authToken, setToken] = useState("");
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

 
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);  
    }
    setLoading(false);  
  }, []);

 
  function ProtectedRoute({ isAuthenticated, children }) {
    useEffect(() => {
      if (!isAuthenticated && !loading) {  
        navigate("/login");
      }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
      return <div>Loading...</div>;  
    }

    return isAuthenticated ? children : null;
  }

  return (
    <div className="flex h-screen">
      <Routes>
        <Route
          path="/registor"
          element={<Registor />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/seting"
          element={
            <ProtectedRoute isAuthenticated={!!authToken}>
              <MainLayout>
                <Seting />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/file"
          element={
            <ProtectedRoute isAuthenticated={!!authToken}>
              <MainLayout>
                <File />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={!!authToken}>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />
    

      <Route
          path="/board/:boardId"
          element={
            <ProtectedRoute isAuthenticated={!!authToken}>
              <MainLayout>
                <BoardDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

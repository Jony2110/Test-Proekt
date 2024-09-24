
import { Route, Routes, useNavigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Registor from "./pages/Registor";
import Seting from "./pages/Seting";
import Home from "./pages//Home";
import Login from "./pages/Login";
import File from "./pages/File";
import { useEffect, useState } from "react";

function App() {


  // const [token, setToken] = useState("");
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");
  //   if (storedToken) {
  //     setToken(storedToken);
  //   }
  // }, []);

  // function ProtectedRoute({ isAuthenticated, children }) {
  //   useEffect(() => {
  //     if (!isAuthenticated) {
  //       navigate('/login');
  //     }
  //   }, [isAuthenticated, navigate]);

  //   return isAuthenticated ? children : null;
  // }






  return (
    <div className="flex h-screen">
      <Routes>
        <Route
          path="/registor"
          element={
            
              <Registor></Registor>
           
          }
        ></Route>

        <Route
          path="/login"
          element={
            
              <Login></Login>
          
          }
        ></Route>
        <Route
          path="/seting"
          element={
            <MainLayout>
              <Seting></Seting>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/file"
          element={
            <MainLayout>
              <File></File>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/"
          element={
            // <ProtectedRoute isAuthenticated={!!token}>
              <MainLayout>
              <Home></Home>
            </MainLayout>
            // </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;

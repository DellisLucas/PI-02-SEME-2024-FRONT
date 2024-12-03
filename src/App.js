import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import CadastrarUsuario from "./components/CadastrarUsuario";
import Inicio from "./components/Inicial";
import Home from "./components/Home";
import Expense from "./components/Expenses";
import Income from "./components/Incomes";
import QuemSomos from "./components/quem-somos";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Obtém o token do localStorage

  if (!token) {
    // Exibe notificação e redireciona se o usuário não estiver autenticado
    toast.error("Usuário não autenticado. Faça login para continuar.", {
      position: "top-right",
      autoClose: 3000,
    });
    return <Navigate to="/login" replace />;
  }

  return children; // Renderiza o componente filho se autenticado
};

function App() {
  return (
    <Router>
      <div>
        {/* Componente para notificações */}
        <ToastContainer />

        <main>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/Inicio" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastrar" element={<CadastrarUsuario />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/" element={<Inicio />} />

            {/* Rotas protegidas */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expense"
              element={
                <ProtectedRoute>
                  <Expense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/income"
              element={
                <ProtectedRoute>
                  <Income />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  // Obter o token do localStorage
  const token = localStorage.getItem("token");

  // Verifica se o token existe
  if (!token) {
    toast.error("Usuário não logado. Faça login para continuar.", {
      position: "top-right",
      autoClose: 3000,
    });
    return <Navigate to="/login" replace />; // Redireciona para a tela de login
  }

  // Token válido, renderiza o componente filho
  return children;
};

export default ProtectedRoute;

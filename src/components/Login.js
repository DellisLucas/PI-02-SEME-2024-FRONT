import React, { useState, useEffect } from "react";
import axios from "axios";
import Toastify from "toastify-js";
import "./../styles/Login.css";
import "toastify-js/src/toastify.css";
import Header from "./Header";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Adiciona VLibras
    const vlibrasContainer = document.createElement("div");
    vlibrasContainer.setAttribute("vw", "");
    vlibrasContainer.classList.add("enabled");
    vlibrasContainer.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    `;
    document.body.appendChild(vlibrasContainer);

    const vlibrasScript = document.createElement("script");
    vlibrasScript.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    vlibrasScript.async = true;
    vlibrasScript.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
      }
    };
    document.body.appendChild(vlibrasScript);

    // Adiciona a barra de acessibilidade
    const accessibilityScript = document.createElement("script");
    accessibilityScript.src =
      "https://cdn.jsdelivr.net/gh/brenonovelli/Accessibility-Settings-Bar/dist/AccessibilitySettingsBar.min.js";
    accessibilityScript.async = true;
    accessibilityScript.onload = () => {
      if (window.AccessibilitySettingsBar) {
        new window.AccessibilitySettingsBar().init();
      }
    };
    document.body.appendChild(accessibilityScript);

    return () => {
      // Remove VLibras e a barra de acessibilidade
      document.body.removeChild(vlibrasContainer);
      document.body.removeChild(vlibrasScript);
      document.body.removeChild(accessibilityScript);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      Toastify({
        text: "Preencha todos os campos obrigatórios.",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #ff5f5f, #ff9966)",
      }).showToast();
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("https://pi-02-sem-2024.onrender.com/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.access_token);

      Toastify({
        text: "Login realizado com sucesso! Redirecionando...",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();

      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } catch (error) {
      const status = error.response?.status;

      let errorMessage = "Erro desconhecido. Por favor, tente novamente.";
      if (status === 401) {
        errorMessage = "Usuário ou senha inválidos. Tente novamente.";
      } else if (status === 404) {
        errorMessage = "Usuário não encontrado. Verifique suas credenciais.";
      } else if (status >= 500) {
        errorMessage = "Erro interno no servidor. Tente novamente mais tarde.";
      }

      Toastify({
        text: errorMessage,
        duration: 4000,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #ff5f5f, #ff9966)",
      }).showToast();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <div className="login-box">
          <img src="/img/login.png" alt="Login Text" className="login" />
          <form onSubmit={handleLogin} aria-label="Formulário de Login">
            <div className="form-group">
              <input
                type="text"
                id="username"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-required="true"
                aria-label="Digite seu usuário"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
                aria-label="Digite sua senha"
              />
            </div>
            <button type="submit" disabled={isLoading} aria-busy={isLoading}>
              {isLoading ? "Carregando..." : "ENTRAR"}
            </button>
          </form>
          <p className="link">
            Não possui registro? <a href="/cadastrar">Cadastre-se</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

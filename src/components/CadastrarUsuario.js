import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/Cadastro.css";
import Header from "./Header";

const Cadastro = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
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

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      if (window.VLibras && window.VLibras.Widget) {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(vlibrasContainer);
      document.body.removeChild(script);
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.warning("Por favor, preencha todos os campos!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (password.length < 6) {
      toast.warning("A senha deve ter pelo menos 6 caracteres!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("https://pi-02-sem-2024.onrender.com/user/register", {
        username,
        password,
      });

      toast.success("Usuário registrado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      const status = error.response?.status;

      let errorMessage = "Erro ao registrar usuário. Tente novamente.";
      if (status === 400) {
        errorMessage = "Usuário já existe. Escolha outro nome.";
      } else if (status >= 500) {
        errorMessage = "Erro no servidor. Tente novamente mais tarde.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <div className="login-box">
          <img src="/img/cadastro.png" alt="Cadastro" className="cadastro" />
          <form onSubmit={handleRegister} className="login-form">
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Carregando..." : "CADASTRAR"}
            </button>
          </form>

          <p className="link">
            Já possui conta? <a href="/login">Login</a>
          </p>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Cadastro;

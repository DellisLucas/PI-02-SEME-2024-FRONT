import React from "react";
import { Link } from "react-router-dom"; // Importando o Link para navegação interna
import "./../styles/Header.css"; // Importando o CSS específico

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src="/img/icon-logo.png" alt="Logo Icon" className="logo-icon" />
        <img src="/img/cashtab.png" alt="Logo Text" className="logo-name" />
      </div>

      {/* Menu de Navegação */}
      <nav className="menu">
      <Link to="/inicio">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/quem-somos">Quem Somos</Link>
        <Link to="/cadastrar">Cadastrar</Link>
      </nav>
    </header>
  );
};

export default Header;

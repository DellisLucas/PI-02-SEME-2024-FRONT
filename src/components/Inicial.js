import React, { useEffect } from "react";
import "./../styles/inicio.css";
import Header from "./Header";
import { Link } from "react-router-dom";

const App = () => {
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

  return (
    <div>
      <Header />
      <main className="main-container">
        <div className="content">
          <div className="image-container">
            <img src="/img/pessoa_note.png" alt="Pessoa com notebook" className="main-image" />
          </div>
          <div className="info">
            <ul>
              <li><span className="icon">💰</span> INSIRA SEU RENDIMENTO</li>
              <li><span className="icon">📊</span> INFORME SUAS DESPESAS</li>
              <li><span className="icon">📈</span> CONTROLAMOS SEUS GASTOS</li>
            </ul>
            <Link to="/cadastrar">
              <button className="cta-button">INSCREVA-SE</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

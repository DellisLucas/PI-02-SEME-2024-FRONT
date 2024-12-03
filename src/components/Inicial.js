import React from "react";
import "./../styles/inicio.css";
import Header from "./Header";
import { Link } from "react-router-dom";

const App = () => {
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

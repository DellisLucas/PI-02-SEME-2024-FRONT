import React, { useEffect } from "react";
import "./../styles/QuemSomos.css";
import Header from "./Header";

const QuemSomos = () => {
  useEffect(() => {
    // Adicionar o script do VLibras no carregamento do componente
    const vlibrasScript = document.createElement("script");
    vlibrasScript.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    vlibrasScript.async = true;
    vlibrasScript.onload = () => {
      new window.VLibras.Widget("https://vlibras.gov.br/app");
    };
    document.body.appendChild(vlibrasScript);

    return () => {
      // Remover o script ao desmontar o componente
      document.body.removeChild(vlibrasScript);
    };
  }, []);

  return (
    <>
      <Header />
      <main className="main-container">
        <div className="content">
          <div className="text-content">
            <p>
              Somos a Innotech, uma empresa fundada em 2023 por alunos da FATEC
              Indaiatuba, movidos pela paixão por tecnologia e inovação. Nosso
              propósito é desenvolver soluções tecnológicas que contribuam para
              o progresso e a equidade na sociedade, sempre buscando facilitar
              a vida das pessoas por meio de ferramentas acessíveis e eficazes.
            </p>
            <p>
              Nosso principal projeto, o CashTab, foi criado com o objetivo de
              empoderar indivíduos no controle de suas finanças, oferecendo um
              sistema intuitivo e eficiente para organizar gastos e alcançar
              metas financeiras. Na Innotech, acreditamos que a tecnologia pode
              transformar vidas e estamos comprometidos em fazer a diferença no
              mundo.
            </p>
          </div>
          <div className="image-content">
            <img src="./img/fatec.png" alt="Logo Fatec" className="fatec-logo" />
          </div>
        </div>
      </main>
      {/* Botão e Plugin do VLibras */}
      <div vw="enabled">
        <div vw-access-button="active"></div>
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
    </>
  );
};

export default QuemSomos;

import React, { useState } from "react";
import axios from "axios";
import "./../styles/Header.css";

const Header_Home = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // Controle do modal
  const [filters, setFilters] = useState({
    type: "both", // Tipo de relatório (despesas, receitas ou ambos)
    startDate: "",
    endDate: "",
    minValue: "",
    maxValue: "",
  });

  const handleGenerateReport = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Usuário não autenticado! Faça login.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/reports/generate", // Substitua pela sua rota
        filters,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
          },
          responseType: "blob", // Para receber o arquivo em formato binário
        }
      );

      // Baixar o relatório gerado
      const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `relatorio-${filters.type}-${Date.now()}.xlsx`; // Nome do arquivo
      link.click();

      alert("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar o relatório:", error);
      alert("Erro ao gerar o relatório. Tente novamente.");
    }
  };

  return (
    <>
      <header className="header">
        
        <div className="logo-container">
          <img src="/img/icon-logo.png" alt="Logo Icon" className="logo-icon" />
          <img src="/img/cashtab.png" alt="Logo Text" className="logo-name" />
        </div>
        <nav className="menu">
          <a href="/home">Home</a>
          <a href="/expense">Despesas</a>
          <a href="/income">Receitas</a>
          <a
            href="#relatorios"
            onClick={(e) => {
              e.preventDefault(); // Evita o comportamento padrão do link
              setIsReportModalOpen(true); // Abre o modal
            }}
          >
            Relatórios
          </a>
        </nav>
      </header>

      {/* Modal de Relatórios */}
      {isReportModalOpen && (
  <div className="report-modal">
    <div className="report-modal-content">
      <h2>Gerar Relatório</h2>
      <form>
        <label>Tipo de Relatório</label>
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value })
          }
        >
          <option value="expenses">Despesas</option>
          <option value="incomes">Receitas</option>
          <option value="both">Ambos</option>
        </select>

        <label>Período</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />

        <label>Filtrar por Valor</label>
        <input
          type="number"
          placeholder="Valor mínimo"
          value={filters.minValue}
          onChange={(e) =>
            setFilters({ ...filters, minValue: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Valor máximo"
          value={filters.maxValue}
          onChange={(e) =>
            setFilters({ ...filters, maxValue: e.target.value })
          }
        />

        <div className="report-modal-actions">
          <button
            type="button"
            onClick={handleGenerateReport}
          >
            Gerar Relatório
          </button>
          <button
            type="button"
            onClick={() => setIsReportModalOpen(false)} // Fecha o modal
          >
            Fechar
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </>
  );
};

export default Header_Home;

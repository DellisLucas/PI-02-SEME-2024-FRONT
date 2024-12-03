import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver"; // Biblioteca para salvar o arquivo Excel
import "./../styles/ReportModal.css";

const ReportModal = ({ isOpen, onClose }) => {
  const [type, setType] = useState("both"); // Tipo de relatório: despesas, receitas ou ambos
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const handleGenerateReport = async () => {
    try {
      // Preparar o payload com os filtros
      const payload = {
        type,
        startDate: startDate || null,
        endDate: endDate || null,
        minValue: minValue || null,
        maxValue: maxValue || null,
      };

      // Chamada para o backend para obter os dados filtrados
      const response = await axios.post("http://localhost:3001/reports/generate", payload, {
        responseType: "blob", // Necessário para receber o arquivo
      });

      // Salvar o arquivo Excel
      const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
      saveAs(blob, `relatorio-${type}-${Date.now()}.xlsx`);
    } catch (error) {
      console.error("Erro ao gerar o relatório:", error);
      alert("Erro ao gerar o relatório. Tente novamente.");
    }
  };

  if (!isOpen) return null; // Retorna nada se o modal estiver fechado

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Gerar Relatório</h2>
        <form>
          <div className="form-group">
            <label>Tipo de Relatório</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expenses">Despesas</option>
              <option value="incomes">Receitas</option>
              <option value="both">Ambos</option>
            </select>
          </div>
          <div className="form-group">
            <label>Período</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Data inicial"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Data final"
            />
          </div>
          <div className="form-group">
            <label>Filtrar por Valor</label>
            <input
              type="number"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              placeholder="Valor mínimo"
            />
            <input
              type="number"
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
              placeholder="Valor máximo"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={handleGenerateReport}>
              Gerar Relatório
            </button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;

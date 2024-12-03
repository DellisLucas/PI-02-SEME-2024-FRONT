import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/Expenses.css"; // Certifique-se de criar o arquivo CSS para estilizar
import Header_Home from "./Header_Home"; // Header reutilizável
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const Incomes = () => {
  const [Incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal para adicionar despesa
  const [currentExpense, setCurrentExpense] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [newExpense, setNewExpense] = useState({ description: "", date: "", amount: 0 });

  // Função para buscar as despesas
  const fetchIncomes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token não encontrado! Faça login.");
        return;
      }

      const response = await axios.get("https://pi-02-sem-2024.onrender.com/Incomes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIncomes(response.data);
      setFilteredIncomes(response.data);
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
      alert("Erro ao carregar dados. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const filterIncomesByDate = () => {
    const filtered = Incomes.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      return expenseDate >= start && expenseDate <= end;
    });

    setFilteredIncomes(filtered);
  };

  const openModal = (expense) => {
    setCurrentExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentExpense(null);
  };

  const handleUpdateIncome = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token não encontrado! Faça login.");
        return;
      }

      const response = await axios.put(
        `https://pi-02-sem-2024.onrender.com/Incomes/${currentExpense.id}`,
        currentExpense,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedIncomes = Incomes.map((expense) =>
        expense.id === currentExpense.id ? response.data : expense
      );
      setIncomes(updatedIncomes);
      setFilteredIncomes(updatedIncomes);

      closeModal();
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error);
      alert("Erro ao atualizar a despesa. Tente novamente.");
    }
  };

  const openConfirmModal = (expense) => {
    setExpenseToDelete(expense);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token não encontrado! Faça login.");
        return;
      }

      await axios.delete(`https://pi-02-sem-2024.onrender.com/Incomes/${expenseToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedIncomes = Incomes.filter(
        (expense) => expense.id !== expenseToDelete.id
      );
      setIncomes(updatedIncomes);
      setFilteredIncomes(updatedIncomes);

      closeConfirmModal();
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
      alert("Erro ao excluir a despesa. Tente novamente.");
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setExpenseToDelete(null);
  };

  const openAddModal = () => {
    setNewExpense({ description: "", date: "", amount: 0 });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token não encontrado! Faça login.");
        return;
      }

      const response = await axios.post("https://pi-02-sem-2024.onrender.com/Incomes", newExpense, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIncomes([...Incomes, response.data]);
      setFilteredIncomes([...Incomes, response.data]);

      closeAddModal();
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      alert("Erro ao adicionar a despesa. Tente novamente.");
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  return (
    <div>
      <Header_Home />

      <main className="expenses-main">
        <div className="Desp-icon-container">
          <img src="/img/receitas.png" alt="Desp Icon" className="Desp-icon" />
        </div>

        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <>
            <div className="expenses-summary">
              <h2>
                Total de Despesas: R$
                {filteredIncomes
                  .reduce((acc, expense) => acc + expense.amount, 0)
                  .toFixed(2)}
              </h2>
            </div>

            <div className="date-filter">
              <label>Data Inicial:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <label>Data Final:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <button onClick={filterIncomesByDate}>Filtrar</button>
              <button className="add-expense-btn" onClick={openAddModal}>
                <FaPlus className="add-icon" />
              </button>
            </div>

            <div className="expenses-table">
              <table>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Data</th>
                    <th>Valor (R$)</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncomes.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.description}</td>
                      <td>{new Date(expense.date + "T00:00:00").toLocaleDateString()}</td>
                      <td>{expense.amount.toFixed(2)}</td>
                      <td>
                        <FaEdit onClick={() => openModal(expense)} />
                        <FaTrashAlt onClick={() => openConfirmModal(expense)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* Modal para editar despesa */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Alterar Receita</h2>
            <label>Descrição:</label>
            <input
              type="text"
              value={currentExpense?.description || ""}
              onChange={(e) =>
                setCurrentExpense({
                  ...currentExpense,
                  description: e.target.value,
                })
              }
            />
            <label>Data:</label>
            <input
              type="date"
              value={currentExpense?.date || ""}
              onChange={(e) =>
                setCurrentExpense({ ...currentExpense, date: e.target.value })
              }
            />
            <label>Valor (R$):</label>
            <input
              type="number"
              value={currentExpense?.amount || ""}
              onChange={(e) =>
                setCurrentExpense({
                  ...currentExpense,
                  amount: parseFloat(e.target.value),
                })
              }
            />
            <div className="modal-actions">
              <button onClick={handleUpdateIncome}>Atualizar</button>
              <button className="cancel" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}


 {isAddModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h2>Adicionar Nova Receita</h2>
      <label>Descrição:</label>
      <input
        type="text"
        value={newExpense.description}
        onChange={(e) =>
          setNewExpense({ ...newExpense, description: e.target.value })
        }
      />
      <label>Data:</label>
      <input
        type="date"
        value={newExpense.date}
        onChange={(e) =>
          setNewExpense({ ...newExpense, date: e.target.value })
        }
      />
      <label>Valor (R$):</label>
      <input
        type="number"
        value={newExpense.amount}
        onChange={(e) =>
          setNewExpense({
            ...newExpense,
            amount: parseFloat(e.target.value),
          })
        }
      />
      <div className="modal-actions">
        <button onClick={handleAddExpense}>Adicionar</button>
        <button className="cancel" onClick={closeAddModal}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
      {isConfirmModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Tem certeza que deseja excluir essa receita?</h2>
            <div className="modal-actions">
              <button onClick={handleDeleteExpense}>Sim</button>
              <button className="cancel" onClick={closeConfirmModal}>
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incomes;


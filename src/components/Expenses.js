import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/Expenses.css";
import Header_Home from "./Header_Home";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [newExpense, setNewExpense] = useState({ description: "", date: "", amount: 0 });

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token não encontrado! Faça login.");
        return;
      }

      const response = await axios.get("https://pi-02-sem-2024.onrender.com/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(response.data);
      setFilteredExpenses(response.data);
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
      alert("Erro ao carregar dados. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const filterExpensesByDate = () => {
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      return expenseDate >= start && expenseDate <= end;
    });

    setFilteredExpenses(filtered);
  };

  const openModal = (expense) => {
    setCurrentExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentExpense(null);
  };

  const handleUpdateExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token não encontrado! Faça login.");
        return;
      }

      const response = await axios.put(
        `https://pi-02-sem-2024.onrender.com/expenses/${currentExpense.id}`,
        currentExpense,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedExpenses = expenses.map((expense) =>
        expense.id === currentExpense.id ? response.data : expense
      );
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);

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

      await axios.delete(`https://pi-02-sem-2024.onrender.com/expenses/${expenseToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedExpenses = expenses.filter((expense) => expense.id !== expenseToDelete.id);
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);

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

      const response = await axios.post("https://pi-02-sem-2024.onrender.com/expenses", newExpense, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses([...expenses, response.data]);
      setFilteredExpenses([...expenses, response.data]);

      closeAddModal();
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      alert("Erro ao adicionar a despesa. Tente novamente.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <Header_Home />

      <main className="expenses-main">
        <div className="Desp-icon-container">
          <img src="/img/despesas.png" alt="Desp Icon" className="Desp-icon" />
        </div>

        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <>
            <div className="expenses-summary">
              <h2>
                Total de Despesas: R$
                {filteredExpenses
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

              <button onClick={filterExpensesByDate}>Filtrar</button>
              <button className="add-expense-btn" onClick={openAddModal}>
                <FaPlus className="add-icon" />
              </button>
            </div>

            <div className="expenses-table-container">
  <table className="expenses-table">
    <thead>
      <tr>
        <th>Descrição</th>
        <th>Data</th>
        <th>Valor (R$)</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {filteredExpenses.map((expense) => (
        <tr key={expense.id}>
          <td>{expense.description}</td>
          <td>{new Date(expense.date).toLocaleDateString()}</td>
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
            <h2>Alterar Despesa</h2>
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
              <button onClick={handleUpdateExpense}>Atualizar</button>
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
      <h2>Adicionar Nova Despesa</h2>
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

      <div className="pig-container">
        <img
          src="/img/image.png"
          alt="Porquinho"
          className="pig-image"
        />
      </div>
    </div>
  </div>
)}
      {/* Modal de confirmação para exclusão */}
      {isConfirmModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Tem certeza que deseja excluir essa despesa?</h2>
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

export default Expenses;


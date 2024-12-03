import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "./../styles/home.css";
import Header_Home from "./Header_Home";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MainContent = () => {
  const MySwal = withReactContent(Swal);

  const [meta, setMeta] = useState(300);
  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);
  const [currentMonthIncome, setCurrentMonthIncome] = useState(0);

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

  const saveMetaToCookies = (value) => {
    document.cookie = `meta=${value}; path=/; max-age=${60 * 60 * 24 * 30}`;
    Toastify({
      text: "Meta mensal salva com sucesso!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();
  };

  const loadMetaFromCookies = () => {
    const cookies = document.cookie.split("; ");
    const metaCookie = cookies.find((cookie) => cookie.startsWith("meta="));
    if (metaCookie) {
      return metaCookie.split("=")[1];
    }
    return 300;
  };

  const fetchExpensesAndIncome = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Toastify({
          text: "Token não encontrado! Faça login.",
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "linear-gradient(to right, #e63946, #ff6b6b)",
        }).showToast();
        return;
      }

      const expensesResponse = await axios.get("https://pi-02-sem-2024.onrender.com/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const expenses = expensesResponse.data;
      const groupedExpenses = Array(12).fill(0);

      expenses.forEach((expense) => {
        const expenseMonth = new Date(expense.date).getMonth();
        groupedExpenses[expenseMonth] += expense.amount;
      });

      setMonthlyExpenses(groupedExpenses);
      setCurrentMonthExpenses(groupedExpenses[new Date().getMonth()] || 0);

      const incomeResponse = await axios.get("https://pi-02-sem-2024.onrender.com/incomes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const income = incomeResponse.data;
      const groupedIncome = Array(12).fill(0);

      income.forEach((incomeItem) => {
        const incomeMonth = new Date(incomeItem.date).getMonth();
        groupedIncome[incomeMonth] += incomeItem.amount;
      });

      setTotalIncome(groupedIncome);
      setCurrentMonthIncome(groupedIncome[new Date().getMonth()] || 0);
    } catch (error) {
      Toastify({
        text: "Erro ao buscar dados, tente novamente.",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #e63946, #ff6b6b)",
      }).showToast();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedMeta = loadMetaFromCookies();
    setMeta(Number(savedMeta));
    fetchExpensesAndIncome();
  }, []);

  const handleSaveGoal = () => {
    MySwal.fire({
      title: "Definir Nova Meta",
      input: "number",
      inputLabel: "Digite o novo valor da meta mensal (R$)",
      inputPlaceholder: "Exemplo: 300",
      showCancelButton: true,
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value || isNaN(value) || value <= 0) {
          return "Por favor, insira um valor numérico válido!";
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newMeta = Number(result.value);
        setMeta(newMeta);
        saveMetaToCookies(newMeta);
        Toastify({
          text: "Nova meta definida com sucesso!",
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();
      }
    });
  };

  const barChartData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    datasets: [
      {
        label: "Total de Gastos (R$)",
        data: monthlyExpenses,
        backgroundColor: "rgba(108, 99, 255, 0.6)",
        borderColor: "rgba(108, 99, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Gastos", "Receitas"],
    datasets: [
      {
        data: [currentMonthExpenses || 0, currentMonthIncome || 0],
        backgroundColor: ["rgba(108, 99, 255, 0.6)", "rgba(75, 192, 192, 0.6)"],
        borderColor: ["rgba(108, 99, 255, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Header_Home />
      <main className="main">
        <div className="charts-container">
          <div className="section">
            <h2>GASTOS DO ANO</h2>
            {loading ? (
              <p>Carregando dados...</p>
            ) : (
              <div className="box" style={{ width: "350px", height: "250px" }}>
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        ticks: { font: { size: 10 } },
                      },
                      y: {
                        ticks: { font: { size: 10 } },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
          <div className="section">
            <h2>GASTOS E RECEITAS DO MÊS</h2>
            {loading ? (
              <p>Carregando dados...</p>
            ) : (
              <div className="box" style={{ width: "300px", height: "250px" }}>
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="meta-help">
          <div className="meta">
            <h3>META MENSAL</h3>
            <button className="save-goal" onClick={handleSaveGoal}>
              Guardar R$ {meta},00
            </button>
          </div>
          <div className="help">
            <div className="dica">
              <p>
                Precisa de ajuda?
                <br />
                Consulte nossas dicas
              </p>
              <div className="piggy-bank">
                <img src="/img/pig.png" alt="Mascote" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainContent;

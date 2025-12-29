import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [executions, setExecutions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/increment');
      const data = await res.json();
      setExecutions(data.data || []);
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Line chart: Total executions over time
  const lineData = {
    labels: executions.map(e => new Date(e.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Total Executions',
      data: executions.map((_, i) => i + 1),
      borderColor: 'blue',
      backgroundColor: 'lightblue',
      fill: false
    }]
  };

  // Bar chart: Executions by country
  const countries = [...new Set(executions.map(e => e.country))];
  const counts = countries.map(c => executions.filter(e => e.country === c).length);
  const barData = {
    labels: countries,
    datasets: [{
      label: 'Executions per Country',
      data: counts,
      backgroundColor: 'rgba(75, 192, 192, 0.5)'
    }]
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Roblox Script Executions Dashboard</h1>
      <h2>Total Executions Over Time</h2>
      <Line data={lineData} />
      <h2>Executions by Country</h2>
      <Bar data={barData} />
    </div>
  );
                                }

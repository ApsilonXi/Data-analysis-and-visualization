import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

// Импортируем адаптер для работы с датами
import 'chartjs-adapter-date-fns';

// Регистрация всех необходимых компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const SalesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);

  // Функция обработки загрузки файла
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const parsedData = result.data;
          generateChartData(parsedData);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  // Функция генерации данных для графика
  const generateChartData = (data) => {
    // Группируем данные по маркетплейсам
    const marketplaces = [...new Set(data.map(item => item["Маркетплейс"]))];
    const datasets = marketplaces.map((marketplace, index) => {
      const marketplaceData = data.filter(item => item["Маркетплейс"] === marketplace);
      return {
        label: marketplace,
        data: marketplaceData.map(item => ({ x: item["Дата"], y: Number(item["Количество продаж"]) })),
        borderColor: `hsl(${index * 100}, 70%, 50%)`, // Уникальный цвет для каждого маркетплейса
        fill: false,
      };
    });

    setChartData({
      datasets,
    });
  };

  // Очистка старого графика, если новый график загружается
  useEffect(() => {
    if (chartData && chartInstance) {
      chartInstance.destroy();  // Уничтожаем старый график перед созданием нового
    }
  }, [chartData, chartInstance]);

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Загрузите CSV с данными</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      
      {chartData && (
        <div className="mt-8">
          <h3 className="text-xl mb-4">График продаж</h3>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Динамика продаж по маркетплейсам',
                },
                tooltip: {
                  callbacks: {
                    label: function(tooltipItem) {
                      return `${tooltipItem.raw.y} продаж`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'day',
                    tooltipFormat: 'll',
                  },
                  title: {
                    display: true,
                    text: 'Дата',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Количество продаж',
                  },
                },
              },
            }}
            getChartInstance={(chart) => setChartInstance(chart)}  // Сохраняем экземпляр графика
          />
        </div>
      )}
    </div>
  );
};

export default SalesChart;

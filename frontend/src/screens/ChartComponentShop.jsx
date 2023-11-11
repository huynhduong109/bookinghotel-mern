import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-plugin-datalabels";

function ChartComponentShop({ arrData, name }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const groupedDay = arrData?.reduce((result, order) => {
      const day = order?.day;
      const totalData = order?.total;
      result[day] = (result[day] || 0) + totalData;
      return result;
    }, {});

    const sumData = Object.keys(groupedDay).map((day) => ({
      day: day,
      totalData: groupedDay[day],
    }));

    const canvas = document.getElementById("acquisitions");
    const context = canvas.getContext("2d");
    const existingChart = chartRef.current;

    if (existingChart) {
      existingChart.destroy(); // Hủy bỏ biểu đồ hiện tại trên thẻ <canvas>
    }

    const newChart = new Chart(context, {
      type: "bar",
      data: {
        labels: sumData?.map((row) => row.day),
        datasets: [
          {
            label: name,
            data: sumData?.map((row) => row.totalData),
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            display: true,
            color: "white",
            font: {
              weight: "bold",
            },
          },
        },
      },
    });

    chartRef.current = newChart; // Lưu trữ đối tượng biểu đồ mới trong tham chiếu

    return () => {
      newChart.destroy(); // Hủy bỏ biểu đồ khi component bị hủy
    };
  }, [arrData]);

  return (
    <>
      <h1>Biểu đồ thống kê {name}</h1>
      <div style={{ width: "800px" }}>
        <canvas id="acquisitions"></canvas>
      </div>
    </>
  );
}

export default ChartComponentShop;
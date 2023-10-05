import { Card } from "primereact/card";
import { Chart } from 'primereact/chart'
import { VendaPorMes } from "../../models/dashboard";
import { useEffect, useState } from "react";
import { MESES } from "../../util/money/meses";
import RotaAutenticada from "../rotaautenticada";

interface DashboardProps {
  produtos?: number;
  clientes?: number;
  vendas?: number;
  vendasPorMes?: VendaPorMes[];
}

const Dashboard: React.FC<DashboardProps> = ({
  produtos,
  clientes,
  vendas,
  vendasPorMes,
}) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const carregaDadosGrafico = () => {
    const labels: string[] = vendasPorMes?.map((vm) => MESES[vm.mes - 1]);
    const valores = vendasPorMes?.map((vm) => vm.valor);

    const dadosGrafico = {
      labels: labels,
      datasets: [
        {
          label: "Valor Mensal",
          backgroundColor: "#008000",
          data: valores,
        },
      ],
    };

    const options = {
      plugins: {
          legend: {
            fontColor: "white",
              labels: {
                  usePointStyle: true,
                  fontColor: "white"
              }
          }
      }
  };

    setChartData(dadosGrafico);
    setChartOptions(options);
  };

  useEffect(carregaDadosGrafico, []);

  const produtoCardStyle = {
    background: "red",
    color: "white",
  };

  const clienteCardStyle = {
    background: "blue",
    color: "white",
  };

  const vendaCardStyle = {
    background: "green",
    color: "white",
  };

  return (
    <RotaAutenticada>
      <div className="p-fluid">
        <div className="p-grid">
          <div className="p-col">
            <Card title="Produtos" style={produtoCardStyle}>
              <p className="p-m-0">{produtos}</p>
            </Card>
          </div>
          <div className="p-col">
            <Card title="Clientes" style={clienteCardStyle}>
              <p className="p-m-0">{clientes}</p>
            </Card>
          </div>
          <div className="p-col">
            <Card title="Vendas" style={vendaCardStyle}>
              <p className="p-m-0">{vendas}</p>
            </Card>
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col">
            <Chart
              type="bar"
              data={chartData}
              options={chartOptions}
              style={{ position: "relative", width: "100%", height: "50%" }}
            />
          </div>
        </div>
      </div>
    </RotaAutenticada>
  );
};

export default Dashboard;

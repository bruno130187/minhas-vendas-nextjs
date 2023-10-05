import Head from "next/head";
import Layout from "../pages/components/layout";
import Dashboard from "./components/dashboard";
import { DashboardData } from "./models/dashboard";
import { useDashboardService } from "./services/dashboard.service";
import RotaAutenticada from "./components/rotaautenticada";

const Home: React.FC = (props: any) => {
  return (
    <RotaAutenticada>
      <Head>
        <title>Vendas APP</title>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>
      <Layout titulo="Dashboard">
        <Dashboard
          produtos={props.dashboard.produtos}
          clientes={props.dashboard.clientes}
          vendas={props.dashboard.vendas}
          vendasPorMes={props.dashboard.vendasPorMes}
        />
      </Layout>
    </RotaAutenticada>
  );
};

export async function getStaticProps(context) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const serviceDashboard = useDashboardService();
  const dashboard: DashboardData = await serviceDashboard.get();

  return {
    props: {
      dashboard,
    },
  };
}

export default Home;

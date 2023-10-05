import { useState } from "react";
import "bulma/css/bulma.css";
import "./components/common/loader/loader.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primeflex/primeflex.css";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../styles/themeConfig";
import { InputSwitch } from 'primereact/inputswitch';
import { Provider } from "next-auth/client";

function MyApp({ Component, pageProps }) {

  const [theme, setTheme] = useState("dark");
  const [toggle, setToggle] = useState(false);

  const toggleTheme = () => {
    theme == 'light' ? setTheme('dark') : setTheme('light');
    toggle == false ? setToggle(true) : setToggle(false);
  }

  return (
    <Provider session={pageProps.session}>
      <ThemeProvider theme={theme == 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <InputSwitch checked={toggle} onChange={toggleTheme} className="p-2 p-inputswitch-sm" />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp;

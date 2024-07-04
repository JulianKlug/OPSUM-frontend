import Footer from "./components/Footer.js";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import MainPredictionArea from "./components/MainPredictionArea";


const appTheme = createMuiTheme({
  palette: {
      primary: {
        main: "#darkgray"
      },
      secondary: {
        main: '#1976D2'
      }
  }
});


function App() {
  return (
    <div className="App">
        <ThemeProvider theme={appTheme}>
            <MainPredictionArea />
            <Footer/>
        </ThemeProvider>
    </div>
  );
}

export default App;
import { SiteLayout } from "~/components/site";
import { ThemeProvider } from "~/theme";

//================================================

function App() {
  return (
    <ThemeProvider>
      <SiteLayout></SiteLayout>
    </ThemeProvider>
  );
}

export default App;

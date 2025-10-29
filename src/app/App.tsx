import { SiteLayout } from "~/components/site";
import { ThemeProvider } from "~/theme";

import { HomePage } from "./home";

//================================================

function App() {
  return (
    <ThemeProvider>
      <SiteLayout>
        <HomePage />
      </SiteLayout>
    </ThemeProvider>
  );
}

export default App;

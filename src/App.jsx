// import Header from "./components/Header";

import { Toaster } from "react-hot-toast";
import Main from "./components/Main";

function App() {
  return (
    <>
      <Main />
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 2000,
          },
          error: {
            duration: 4000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-1)",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </>
  );
}

export default App;

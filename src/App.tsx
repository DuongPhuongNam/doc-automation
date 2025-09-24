import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UploadFile from "./app/components/UploadFile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/">
        <div className="App">
          <UploadFile />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
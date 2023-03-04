import { Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext"

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { AdminRoom } from "./pages/AdminRoom";


function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes> //faz abrir somente a primeira página que for acessada
          <Route path="/" element={<Home />} /> //cada página é um Route diferente
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="/admins/rooms/:id" element={<AdminRoom />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;

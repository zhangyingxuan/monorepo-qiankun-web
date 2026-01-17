import { BrowserRouter, Routes, Route } from "react-router-dom";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import Home from "./pages/Home";
import UserList from "./pages/UserList";
import "./App.css";

const basename = qiankunWindow.__POWERED_BY_QIANKUN__ ? "/user" : "/";

function App() {
  return (
    <BrowserRouter basename={basename}>
      <div className="user-app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<UserList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

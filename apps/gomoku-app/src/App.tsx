import React from "react";
import Gomoku from "./components/Gomoku";
import "./App.css";

/**
 * 五子棋应用主组件
 */ const App: React.FC = () => {
  return (
    <div className="gomoku-app">
      <Gomoku />
    </div>
  );
};

export default App;

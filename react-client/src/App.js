import React from "react";
import "./components/header/header";
import "./App.css";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
// import Home from "./components/home/home";
import Game from "./components/game/game";
function App() {
  return (
    
    <div className="App">
      <title>React TTT</title>

      
        <Header></Header>
        <div className="container-fluid">
        <Game></Game></div>
        <Footer></Footer>
      
    </div>
  );
}

export default App;

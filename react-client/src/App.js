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
      <meta property="og:title" content="__OG_TITLE__" />
    <meta property="og:description" content="__OG_DESCRIPTION__" />
      <title>React TTT</title>

      
        <Header></Header>
        <div className="container-fluid">
        <Game></Game></div>
        <Footer></Footer>
      
    </div>
  );
}

export default App;

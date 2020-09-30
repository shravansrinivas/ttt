import React from "react";

import icon from '../../images/logo.png';
function Header() {
  return (
    // <header className="header-style">
    //   <p style={{ textAlign: "left" }}>
    //     <img src="/images/tic-tac-toe.png" alt=""></img>
    //     React TTT Game
    //     <p style={{ float: "right" }}>
    //       {"\t|\t"}
    //       {/*  eslint-disable-next-line */}
    //       <a target="_blank" href="https://github.com/shravansrinivas/ttt">
    //         View Code
    //       </a>
    //       {"\t|\t"} 
    //       {/*  eslint-disable-next-line */}
    //       <a
    //         target="_blank"
    //         href="https://github.com/shravansrinivas/ttt#readme"
    //       >
    //         View Docs
    //       </a>
    //     </p>
    //   </p>
    // </header>
    <header>
        <nav className="navbar navbar-expand-dark navbar-dark bg-dark">
        <ul className="nav nav-pills nav-fill">
  <li className="nav-item">
    <a className="navbar-brand" href="http://tttreact.herokuapp.com/"><img src={icon} alt=""></img> React TicTacToe</a>
  </li>
  <li className="nav-item">
    <a className="nav-link" href="https://github.com/shravansrinivas/ttt">View Source Code</a>
  </li>
  <li className="nav-item">
    <a className="nav-link" href="https://github.com/shravansrinivas/ttt#tic-tac-toe-game">View Documentation</a>
  </li>

</ul></nav>
    </header>
  );
}

export default Header;

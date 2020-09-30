import React from "react";

function Header() {
  return (
    <header className="header-style">
      <h3 style={{ textAlign: "left" }}>
        <img src="/images/tic-tac-toe.png" alt=""></img>
        React TTT Game
        <p style={{ float: "right" }}>
          {"\t|\t"}
          {/*  eslint-disable-next-line */}
          <a target="_blank" href="https://github.com/shravansrinivas/ttt">
            View Source Code
          </a>
          {"\t|\t"} 
          {/*  eslint-disable-next-line */}
          <a
            target="_blank"
            href="https://github.com/shravansrinivas/ttt#readme"
          >
            View Documentation
          </a>
        </p>
      </h3>
    </header>
  );
}

export default Header;

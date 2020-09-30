import React from 'react'

function Header(){
    return (<header className="header-style">
        <h2 style={{"text-align":"left"}}>
    <img src="/images/tic-tac-toe.png" alt=""></img>
    React TTT Game
    <h4 style={{"float":"right"}}>
        {/*  eslint-disable-next-line */}
        {"\t|\t"}<a target="_blank" href="https://github.com/shravansrinivas/ttt">View Source Code</a>
        {/*  eslint-disable-next-line */}
        {"\t|\t"} <a target="_blank" href="https://github.com/shravansrinivas/ttt#readme">View Documentation</a>
    </h4>
</h2>
    </header>)
}

export default Header;
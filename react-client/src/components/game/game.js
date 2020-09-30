import React, { Component } from "react";
const axios = require("axios");

// eslint-disable-next-line
const dotenv = require("dotenv").config();

// let URL_BASE= process.env.REACT_APP_BACKEND_URL_BASE;
let URL_BASE = "/api/";

class Game extends Component {
  constructor() {
    super();
    this.joinGame = this.joinGame.bind(this);
    this.goHome = this.goHome.bind(this);
    this.createNewGame = this.createNewGame.bind(this);
    this.playVsCPU = this.playVsCPU.bind(this);
    this.state = {
      cpuPlayer: "X",
      gameLevel: "hard",
      bgArray: Array(9).fill(""),
      cpuPlayerInput: "X",
      cpuPlaying: false,
      // cpuTeam: 'O',
      joinGameInput: "O",
      createGameInput: "X",

      player: "",
      gameId: "",
      winner: undefined,
      totalMoves: 0,
      gameStatus: "In Progress",
      mode: "home",
      loading: true,
      gameType: "-",
      currentTurn: "",
      // joiningPlayer: "O",
      gameOver: false,
      boxes: Array(9).fill(""),
      check: true,
    };
    this.gameData = {
      boxes: Array(9).fill(""),
      totalMoves: 0,
    };
  }
  componentDidMount() {
    this.setState({ loading: false });
  }

  componentDidUpdate() {
    let self = this;
    //if(this.state.gameOver){this.checkGameCompletion(); this.setState({check:false})}
    if (
      self.state.mode === "game" &&
      self.state.currentTurn !== self.state.player &&
      this.state.check === true &&
      this.state.gameType === "vsPlayer"
    ) {
      setInterval(this.pollTillChance(), 500);
    }
    //  else if (
    //   self.state.gameType === "vsCPU" &&
    //   ((self.state.totalMoves % 2 === 0 && self.state.cpuPlayer === "X") ||
    //     (self.state.totalMoves % 2 !== 0 && self.state.cpuPlayer === "O")) &&
    //   !self.state.gameOver &&
    //   self.state.currentTurn !== self.state.cpuPlayer
    // ) {
    //   setTimeout(() => self.cpuMove(), 500);
    // }
  }

  playVsCPU() {
    this.setState({ loading: true });

    var self = this;
    self.setState({ cpuPlaying: true, player: self.state.cpuPlayerInput });
    axios
      .post(URL_BASE + "games/", {
        gameType: "vsCPU",
        currentTurn: "X",
        gameLevel: self.state.gameLevel,
        cpuPlayer: self.state.cpuPlayerInput,
      })
      .then(function (response) {
        console.log(response.data);
        self.gameData.boxes = response.data.boxes;
        self.setState({
          gameType: response.data.gameType,
          gameId: response.data.gameId,
          currentTurn: response.data.currentTurn,
          boxes: response.data.boxes,
          mode: "game",
          gameLevel: self.state.gameLevel,
        });
        self.setState({ loading: false });

        if (self.state.player === "O") self.cpuMove();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  createNewGame() {
    this.setState({ loading: true });

    var self = this;
    this.setState({ player: self.state.createGameInput });
    axios
      .post(URL_BASE + "games/", {
        gameType: "vsPlayer",
        currentTurn: "X",
        gameLevel: "notCPU",
        cpuPlayer: "notCPUGame",
      })
      .then(function (response) {
        console.log(response.data);
        self.gameData.boxes = response.data.boxes;
        // console.log(self.gameData.boxes);
        self.setState({
          gameType: response.data.gameType,
          gameId: response.data.gameId,
          currentTurn: response.data.currentTurn,
          boxes: response.data.boxes,
          mode: "game",
        });
        self.setState({ loading: false });
      })
      .catch(function (error) {
        console.log(error);
        self.setState({ loading: false });
      });
  }

  getGameData(id) {
    let self = this;
    axios
      .get(URL_BASE + "games/" + id)
      .then(function (response) {
        console.log(response.data[0].boxes);

        if (response.data.length === 1) {
          self.gameData.boxes = response.data[0].boxes;
          self.gameData.totalMoves = response.data[0].totalMoves;
          self.setState({
            gameLevel: response.data[0].gameLevel,
            gameId: response.data[0].gameId,
            boxes: response.data[0].boxes,
            player:
              response.data[0].gameType === "vsCPU"
                ? response.data[0].cpuPlayer
                : self.state.joinGameInput,
            gameStatus: response.data[0].gameStatus,
            winner: response.data[0].winner,
            gameOver: response.data[0].gameOver,
            gameType: response.data[0].gameType,
            currentTurn: response.data[0].currentTurn,
            cpuPlayer: response.data[0].cpuPlayer,
            mode: "game",
            totalMoves: response.data[0].totalMoves,
            cpuPlaying: response.data[0].gameType === "vsCPU",
          });
          if (response.data[0].gameOver) {
            alert("This game is already over!");
            self.checkGameCompletion();
            if (
              self.state.gameType === "vsCPU" &&
              self.state.currentTurn !== self.state.player
            ) {
              self.cpuMove();
            }
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Invalid Game ID, Please check again :)");
      });
  }

  handleChange = (e) => {
    this.setState({ gameId: e.target.value });
    console.log(e.target.value);
  };

  handleCpuPlayerChange = (e) => {
    this.setState({ cpuPlayerInput: e.target.value });
    console.log(e.target.value);
  };
  handleGameLevel = (e) => {
    this.setState({ gameLevel: e.target.value });
    console.log(e.target.value);
  };
  handleCreatePlayerChange = (e) => {
    this.setState({ createGameInput: e.target.value });
    console.log(e.target.value);
  };
  handleJoiningPlayerChange = (e) => {
    this.setState({ joinGameInput: e.target.value });
    console.log(e.target.value);
  };
  joinGame() {
    setTimeout(() => {
      this.setState({ loading: true });
      if (this.state.gameId.length !== 5) {
        alert("Game ID must be of length 5 characters!");
        this.setState({ loading: false });
        return;
      }
      
      let self = this;
      this.getGameData(self.state.gameId);
      if (this.state.gameOver) this.checkGameCompletion();

      if (
        self.state.joinGameInput !== self.state.player &&
        self.state.gameType === "vsCPU"
      ) {
        alert(
          `This is a Vs CPU game and You had joined as ${self.state.cpuPlayer} before.\nSo your role will be set to ${self.state.cpuPlayer}. Happy Playing:)`
        );
      }

      console.log(this.state.gameId, this.state.joinRole);
      self.setState({ loading: false });
    }, 300);
  }
  checkWin() {}
  checkGameCompletion() {
    var winningCombo = [
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];
    for (let i = 0; i < winningCombo.length; i++) {
      var currentState = this.state.boxes;

      if (
        currentState[winningCombo[i][0]] === currentState[winningCombo[i][1]] &&
        currentState[winningCombo[i][1]] === currentState[winningCombo[i][2]] &&
        currentState[winningCombo[i][2]] !== ""
      ) {
        // if (currentState[winningCombo[i][0]])
        //{
        console.log(winningCombo[i]);
        let temp = Array(9).fill("");
        winningCombo[i].forEach((x) => {
          temp[x] = "black";
        });
        this.setState({
          bgArray: temp,
          winner: currentState[winningCombo[i][0]],
          gameOver: true,
          gameStatus:
            "GameOver-Match Won by " + currentState[winningCombo[i][0]],
        });
        //    break;
        //}
      }
    }
    if (this.gameData.totalMoves === 9) {
      let temp = Array(9).fill("");
      this.setState({
        bgArray: temp,
        winner: "draw",
        gameOver: true,
        gameStatus: "GameOver-Match Drawn!",
      });
    }
    if (this.state.gameOver) return true;
    else return false;
  }

  updateAfterClick() {
    var self = this;
    axios.patch(URL_BASE + "games/" + self.state.gameId, {
      winner: self.state.winner,

      boxes: self.state.boxes,
      gameOver: self.state.gameOver,
      totalMoves: self.state.totalMoves,
      gameStatus: self.state.gameStatus,
      currentTurn: self.state.currentTurn === "X" ? "O" : "X",
      gameLevel: self.state.gameLevel,
      cpuPlayer: self.state.cpuPlayer,
    });
  }
  cpuMoveDone() {
    var self = this;
    axios.patch(URL_BASE + "games/" + self.state.gameId, {
      winner: self.state.winner,

      boxes: self.state.boxes,
      gameOver: self.state.gameOver,
      totalMoves: self.state.totalMoves,
      gameStatus: self.state.gameStatus,
      currentTurn: self.state.cpuPlayer,
      gameLevel: self.state.gameLevel,
      cpuPlayer: self.state.cpuPlayer,
    });
    if (this.state.cpuPlaying) {
      this.setState({ currentTurn: this.state.player });
    }
  }

  pollTillChance() {
    var self = this;
    setTimeout(() => {
      axios
        .get(URL_BASE + "games/" + self.state.gameId)
        .then(function (response) {
          console.log(response.data);
          let res = response.data[0];
          self.gameData.boxes = res.boxes;
          self.gameData.totalMoves = res.totalMoves;
          self.setState({
            currentTurn: res.currentTurn,
            winner: res.winner,
            gameStatus: res.gameStatus,
            gameOver: res.gameOver,
            boxes: res.boxes,
            totalMoves: res.totalMoves,
          });
          self.gameData.boxes = res.boxes;
          if (self.state.gameOver) self.checkGameCompletion();
        })
        .catch(function (error) {
          console.log(error);
        });
      if (self.state.gameOver) {
        if (this.checkGameCompletion()) this.setState({ check: false });
      }
    }, 1000);
  }

  boxClick(square) {
    setTimeout(() => {
      if (this.state.gameOver) {
        alert("Game is already over! Start a new one :)");
        return;
      }
      let sqrNum = square.dataset.square;

      //    console.log(this.gameData.boxes);
      if (
        this.gameData.boxes[sqrNum] === "" &&
        this.state.player === this.state.currentTurn
      ) {
        //square.innerText = this.state.currentTurn;
        this.gameData.boxes[sqrNum] = this.state.currentTurn;
        console.log(this.gameData.boxes);
        this.setState({
          boxes: this.gameData.boxes,
          //currentTurn: this.state.currentTurn === "X" ? "O" : "X",
        });
        this.gameData.totalMoves += 1;
        console.log(this.gameData.totalMoves);
        this.setState({ totalMoves: this.gameData.totalMoves });

        if (this.checkGameCompletion()) {
          // alert(this.state.gameStatus);
        }

        this.updateAfterClick();
        this.setState({
          //boxes: this.gameData.boxes,
          currentTurn: this.state.currentTurn === "X" ? "O" : "X",
        });
        this.checkGameCompletion();
        if (this.state.gameType === "vsCPU" && this.state.gameOver === false)
          setTimeout(() => {
            this.cpuMove();
          }, 200);
      }
    }, 500);
  }

  hasMovesLeft(mat) {
    // If it has an empty space, keep playing
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (mat[i][j] === "") return true;
      }
    }

    return false;
  }
  evaluate(mat, depth) {
    // Check every row
    for (let i = 0; i < 3; i++) {
      if (
        mat[i][0] === mat[i][1] &&
        mat[i][0] === mat[i][2] &&
        mat[i][1] === mat[i][2]
      ) {
        if (mat[i][0] === "O") return 100 - depth;
        if (mat[i][0] === "X") return depth - 100;
      }
    }

    // Check every col
    for (let j = 0; j < 3; j++) {
      if (
        mat[0][j] === mat[1][j] &&
        mat[0][j] === mat[2][j] &&
        mat[1][j] === mat[2][j]
      ) {
        if (mat[0][j] === "O") return 100 - depth;
        if (mat[0][j] === "X") return depth - 100;
      }
    }

    // Check the diagonals
    if (
      mat[0][0] === mat[1][1] &&
      mat[0][0] === mat[2][2] &&
      mat[1][1] === mat[2][2]
    ) {
      if (mat[0][0] === "O") return 100 - depth;
      if (mat[0][0] === "X") return depth - 100;
    }

    if (
      mat[0][2] === mat[1][1] &&
      mat[0][2] === mat[2][0] &&
      mat[1][1] === mat[2][0]
    ) {
      if (mat[0][2] === "O") return 100 - depth;
      if (mat[0][2] === "X") return depth - 100;
    }

    // If the game hasn't finished yet
    return 0;
  }
  minmax(mat, depth, get_max) {
    if (this.hasMovesLeft(mat) === false) {
      return this.evaluate(mat, depth);
    }

    let val = this.evaluate(mat, depth);

    if (val !== 0) return val;

    if (get_max) {
      let best = -Infinity;

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (mat[i][j] === "") {
            mat[i][j] = "O";
            best = Math.max(best, this.minmax(mat, depth + 1, !get_max));
            mat[i][j] = "";
          }
        }
      }

      return best;
    } else {
      let best = Infinity;

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (mat[i][j] === "") {
            mat[i][j] = "X";
            best = Math.min(best, this.minmax(mat, depth + 1, !get_max));
            mat[i][j] = "";
          }
        }
      }

      return best;
    }
  }
  arrayToMat(squares) {
    let mat = [];
    let k = 0;

    for (let i = 0; i < 3; i++) {
      mat[i] = [];
      for (let j = 0; j < 3; j++) mat[i][j] = squares[k++];
    }

    return mat;
  }
  find_best_move(boxes) {
    let mat = this.arrayToMat(boxes);
    let val,
      row = -1,
      col = -1,
      best = -Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (mat[i][j] === "") {
          mat[i][j] = "O";
          val = this.minmax(mat, -100, false);
          mat[i][j] = "";

          if (val > best) {
            best = val;
            row = i;
            col = j;
          }
        }
      }
    }

    return 3 * row + col;
  }
  copyToClipboard = (e) => {
    this.textArea.select();
    document.execCommand('copy');
  
    e.target.focus();
    this.setState({ copySuccess: 'Copied!' });
  };
  bestCpuMove() {
    let temp = this.state.boxes;
    let i = this.find_best_move(temp);
    console.log(i);
    temp[i] = this.state.player === "X" ? "O" : "X";
    console.log("before:", this.gameData.totalMoves);
    let tm = this.gameData.totalMoves + 1;
    console.log("after:", tm);
    this.setState({
      currentTurn: this.state.player === "X" ? "X" : "O",
      totalMoves: tm,
      boxes: temp,
    });
    this.gameData.boxes = temp;
    this.gameData.totalMoves = this.state.totalMoves;
    console.log("Total moves:", this.state.totalMoves);
  }

  randomCpuMove() {
    let temp = this.state.boxes;
    console.log("before:", this.gameData.totalMoves);
    let tm = this.gameData.totalMoves + 1;
    console.log("after:", tm);
    while (true) {
      let i = Math.floor(Math.random() * 9);
      if (temp[i] === "") {
        temp[i] = this.state.player === "X" ? "O" : "X";
        console.log(temp);
        this.setState({
          currentTurn: this.state.player === "X" ? "X" : "O",
          totalMoves: tm,
          boxes: temp,
        });
        this.gameData.boxes = temp;
        this.gameData.totalMoves = this.state.totalMoves;
        console.log("Total moves:", this.state.totalMoves);
        break;
      }
    }
  }
  // easyCpuMove() {
  //   let temp = this.state.boxes;
  //   for (let i = 0; i < temp.length; i++) {
  //     if (temp[i] === "") {
  //       temp[i] = this.state.player === "X" ? "O" : "X";
  //       console.log(temp);
  //       this.setState({
  //         currentTurn: this.state.player === "X" ? "X" : "O",
  //         totalMoves: this.gameData.totalMoves++,
  //         boxes: temp,
  //       });
  //       this.gameData.boxes = temp;
  //       this.gameData.totalMoves = this.state.totalMoves;
  //       break;
  //     }
  //   }
  // }
  cpuMove() {
    switch (this.state.gameLevel.toLowerCase()) {
      // case "easy":
      //   this.easyCpuMove();
      //   this.checkGameCompletion();
      //   this.updateAfterClick();
      //   break;
      case "easy":
        this.randomCpuMove();
        this.checkGameCompletion();
        //this.updateAfterClick();
        this.cpuMoveDone();
        break;
      case "hard":
        this.bestCpuMove();
        this.checkGameCompletion();
        //this.updateAfterClick();
        this.cpuMoveDone();
        break;
      default:
        console.log("none");
    }
  }
  resetState() {
    setTimeout(() => {
      this.setState({ loading: true });
      this.setState({
        cpuPlayer: "X",
        gameLevel: "hard",
        bgArray: Array(9).fill(""),
        cpuPlayerInput: "X",
        cpuPlaying: false,
        // cpuTeam: 'O',
        joinGameInput: "O",
        createGameInput: "X",

        player: "",
        gameId: "",
        winner: undefined,
        totalMoves: 0,
        gameStatus: "In Progress",
        mode: "home",
        loading: false,
        gameType: "-",
        currentTurn: "",
        // joiningPlayer: "O",
        gameOver: false,
        boxes: Array(9).fill(""),
        check: true,
      });
      this.gameData = {
        boxes: Array(9).fill(""),
        totalMoves: 0,
      };
      this.setState({ loading: false });
    }, 1000);
  }
  goHome() {
    if (window.confirm("Stop game and go home?")) {
      this.setState({ loading: true });

      this.resetState();
      this.setState({ loading: false });
    } else {
      return;
    }
  }
  handleRadioChange = (event) => {
    console.log(event.target.value);
    this.setState({
      gameLevel: event.target.value,
    });
  };
  render() {
    if (this.state.mode === "home")
      return (
        <div className="container-fluid app-main-content" id="home">
          {this.state.loading && (
            <div className="loading-cust">Loading&#8230;</div>
          )}
          <div className="home-box">
            <div className="jumbotron  bg-primary text-white jumbotron-fluid">
              <div className="container">
                <h2 className="text-center">
                  <u className="game-time">Game Time!</u>
                </h2>
                <div className="row">
                  <div className="col-12 col-sm-5 col-md-5  text-center start-new-game">
                    <h4>Start New Game</h4>
                    <div className="row start-game-options">
                      <div className="col-12 col-sm-6 col-md-6">
                        <div className="form-group">
                          <label htmlFor="exampleFormControlSelect1">
                            Vs CPU - Play As
                          </label>

                          {/* <select
                            className="form-control form-control-sm"
                            value={this.state.gameLevel}
                            onChange={this.handleGameLevel}
                            id="exampleFormControlSelect1"
                          >
                            <option>Easy</option>
                            {/* <option>Medium</option> }
                            <option>Hard</option>
                          </select> */}
                          <select
                            className="form-control form-control-sm"
                            value={this.state.cpuPlayerInput}
                            onChange={this.handleCpuPlayerChange}
                            id="exampleFormControlSelect1"
                          >
                            <option>X</option>
                            <option>O</option>
                          </select>
                          <br></br>
                          <div className="form-group">
                            <h6>Game Level:</h6>
                            <input
                              type="radio"
                              name="radio"
                              value="easy"
                              className="k-radio"
                              checked={this.state.gameLevel === "easy"}
                              onChange={this.handleRadioChange}
                            />
                            <label>Easy</label> {"\t"}
                            <input
                              type="radio"
                              name="radio"
                              value="hard"
                              className="k-radio"
                              checked={this.state.gameLevel === "hard"}
                              onChange={this.handleRadioChange}
                            />
                            <label> Hard</label>
                          </div>
                        </div>
                        <button
                          className="btn btn-lg btn-info"
                          onClick={this.playVsCPU}
                        >
                          Start Game Vs CPU
                        </button>
                      </div>

                      <div className="col-12 col-sm-6 col-md-6">
                        <div className="form-group">
                          <label htmlFor="exampleFormControlSelect1">
                            Vs Player - Start Game As
                          </label>
                          <select
                            className="form-control form-control-sm"
                            value={this.state.createGameInput}
                            onChange={this.handleCreatePlayerChange}
                            id="exampleFormControlSelect1"
                          >
                            <option>X</option>
                            <option>O</option>
                          </select>
                        </div>
                        <button
                          className="btn btn-lg btn-info"
                          onClick={this.createNewGame}
                        >
                          Start Game Vs Player
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-2 col-md-2 text-center"></div>
                  <div className="col-12 col-sm-5 col-md-5 join-existing-game text-center">
                    <h4>Join Existing Game</h4>
                    <div className="form-group">
                      <label>Game Id</label>

                      <input
                        type="text"
                        className="form-control form-control-sm text-center"
                        value={this.state.gameId}
                        maxLength="5"
                        minLength="5"
                        onChange={this.handleChange}
                        placeholder="Enter the 5 character game ID to join"
                      ></input>
                      <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1">
                          Join As
                        </label>
                        <select
                          className="form-control form-control-sm"
                          value={this.state.joinGameInput}
                          onChange={this.handleJoiningPlayerChange}
                        >
                          <option>X</option>
                          <option>O</option>
                        </select>
                      </div>
                      <button
                        className="btn btn-lg btn-success"
                        onClick={this.joinGame}
                      >
                        Join Game
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    else
      return (
        <React.Fragment>
          <div className="row text-center justify-content-center">
            <div className="col-12 col-sm-12 col-md-12 ">
              <button
                className="btn btn-danger"
                onClick={this.goHome}
                value="Home"
              >
                <img
                  src="https://img.icons8.com/material-sharp/20/ffffff/home.png"
                  alt=""
                />{" "}
                Home
              </button>
            </div>
          </div>
          <div className="row app-main-content" id="game">
            {this.state.loading && (
              <div className="loading-cust">Loading&#8230;</div>
            )}
            <div className="col-12 col-sm-2 col-md-2" id="side-nav-left">
              <div className="justify-content-center">
                {!this.state.gameOver && (
                  <div id="turn" className="side-nav-body">
                    {this.state.player === this.state.currentTurn
                      ? "Your Turn"
                      : this.state.gameType === "vsPlayer"
                      ? "Opponent's turn"
                      : "CPU's Turn"}{" "}
                    <img
                      style={{
                        width: "48px",
                        height: "48px",
                        position: "absolute",
                      }}
                      src={
                        this.state.player === this.state.currentTurn
                          ? "https://img.icons8.com/color/64/000000/player-male.png"
                          : "https://img.icons8.com/nolan/64/clock.png"
                      }
                      alt=""
                    />
                    <br></br>
                    {this.state.player === this.state.currentTurn
                      ? "You can play now:)"
                      : this.state.gameType === "vsPlayer"
                      ? "Wait till they play:)"
                      : "Wait till it plays:)"}
                  </div>
                )}
                {this.state.gameOver && (
                  <div id="gameOver" className="side-nav-body">
                    {this.state.player === this.state.winner
                      ? "Game Over\nYou won :)"
                      : this.state.winner === "draw"
                      ? "Game Over\nMatch drawn :/"
                      : "Game Over\nYou lost :("}
                  </div>
                )}
                {/*   <div className="side-nav-head">
                  <h3>Game Status</h3>
                </div>
                <div className="side-nav-body">{this.state.gameStatus}</div>
              </div>
              <div className="text-center ">
                <div className="side-nav-head">
                  <h3>Total Moves</h3>
                </div>
                <div className="side-nav-body">{this.gameData.totalMoves}</div>
              </div>

              <div className="text-center ">
                <div className="side-nav-head">
                  <h3>Winner</h3>
                </div>
                <div className="side-nav-body">
                  {this.state.gameOver ? this.state.winner.toUpperCase() : "-"}
                </div>*/}
              </div>
            </div>
            <div className="col-12 col-sm-8 col-md-8">
              <div
                className="game justify-content-center"
                id="game"
                onClick={(e) => this.boxClick(e.target)}
              >
                {/* {this.state.boxes.map(box=>{
                  return (<div className="square" data-square={this.state.boxes.indexOf(box)} style={{backgroundColor: this.state.bgArray[this.state.boxes.indexOf(box)]}}>{box}</div> )
                })} */}
                <div
                  className="square"
                  data-square="0"
                  style={{
                    backgroundColor: this.state.bgArray[0],
                    color:
                      this.state.bgArray[0] === "black" ? "green" : "black",
                    textDecoration:
                      this.state.bgArray[0] === "black"
                        ? "strikethrough"
                        : "none",
                    cursor:
                      this.state.boxes[0] === "" ? "pointer" : "not-allowed",
                  }}
                >
                  {this.state.boxes[0]}
                </div>
                <div
                  className="square"
                  data-square="1"
                  style={{
                    backgroundColor: this.state.bgArray[1],
                    color:
                      this.state.bgArray[1] === "black" ? "green" : "black",
                    textDecoration:
                      this.state.bgArray[1] === "black"
                        ? "strikethrough"
                        : "none",
                    cursor:
                      this.state.boxes[1] === "" ? "pointer" : "not-allowed",
                  }}
                >
                  {this.state.boxes[1]}
                </div>
                <div
                  className="square"
                  data-square="2"
                  style={{
                    backgroundColor: this.state.bgArray[2],
                    color:
                      this.state.bgArray[2] === "black" ? "green" : "black",
                    textDecoration:
                      this.state.bgArray[2] === "black"
                        ? "strikethrough"
                        : "none",
                    cursor:
                      this.state.boxes[2] === "" ? "pointer" : "not-allowed",
                  }}
                >
                  {this.state.boxes[2]}
                </div>
                <div
                  className="square"
                  data-square="3"
                  style={{
                    backgroundColor: this.state.bgArray[3],
                    color:
                      this.state.bgArray[3] === "black" ? "green" : "black",
                    textDecoration:
                      this.state.bgArray[3] === "black"
                        ? "strikethrough"
                        : "none",
                    cursor:
                      this.state.boxes[3] === "" ? "pointer" : "not-allowed",
                  }}
                >
                  {this.state.boxes[3]}
                </div>
                <div
                  className="square"
                  data-square="4"
                  style={{
                    backgroundColor: this.state.bgArray[4],
                    color:
                      this.state.bgArray[4] === "black" ? "green" : "black",
                    textDecoration:
                      this.state.bgArray[4] === "black"
                        ? "strikethrough"
                        : "none",
                    cursor:
                      this.state.boxes[4] === "" ? "pointer" : "not-allowed",
                  }}
                >
                  {this.state.boxes[4]}
                </div>
                <div
                  className="square"
                  data-square="5"
                  style={{
                    backgroundColor: this.state.bgArray[5],
                    color:
                      this.state.bgArray[5] === "black" ? "green" : "black",
                    textDecoration:
                      this.state.bgArray[5] === "black"
                        ? "strikethrough"
                        : "none",
                    cursor:
                      this.state.boxes[5] === "" ? "pointer" : "not-allowed",
                  }}
                >
                  {this.state.boxes[5]}
                </div>
                <div
                  className="square"
                  data-square="6"
                  style={{
                    backgroundColor: this.state.bgArray[6],
                    color:
                      this.state.bgArray[6] === "black" ? "green" : "black",
                    textDecoration:
                      this.state.bgArray[6] === "black"
                        ? "strikethrough"
                        : "none",
                    cursor:
                      this.state.boxes[6] === "" ? "pointer" : "not-allowed",
                  }}
                >
                  {this.state.boxes[6]}
                </div>
                <div
                  className="square"
                  data-square="7"
                  style={{
                    backgroundColor: this.state.bgArray[7],
                    color:
                      this.state.bgArray[7] === "black" ? "green" : "black",
                    textDecoration:
                      this.state.bgArray[7] === "black"
                        ? "strikethrough"
                        : "none",
                    cursor:
                      this.state.boxes[7] === "" ? "pointer" : "not-allowed",
                  }}
                >
                  {this.state.boxes[7]}
                </div>
                <div
                  className="square"
                  data-square="8"
                  style={{
                    backgroundColor: this.state.bgArray[8],
                    color:
                      this.state.bgArray[8] === "black" ? "green" : "black",
                    textDecoration:
                      this.state.bgArray[8] === "black"
                        ? "strikethrough"
                        : "none",
                    cursor:
                      this.state.boxes[8] === "" ? "pointer" : "not-allowed",
                  }}
                >
                  {this.state.boxes[8]}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-2 col-md-2 col-lg-2  justify-content-center">
            <div className="row">
            <div className="col-12" id="side-nav-right">
              <div className="text-center ">
                <div class="card text-white bg-primary text-center">
                  <div class="card-header">
                    Game ID{" "}
                    {this.state.gameType === "vsPlayer" &&
                      "- Share with a friend"}
                  </div>
                  <div class="card-body">
                    <h5  class="card-title" onClick={this.copyToClipboard}><textarea rows="10" cols='1'
            ref={(textarea) => this.textArea = textarea}
            value={this.state.gameId}
          /><div class="text-center clicker"><button onClick={this.copyToClipboard} className="btn btn-sm">Click to copy <img src="https://img.icons8.com/carbon-copy/24/000000/copy.png" alt=""/></button></div></h5>
                    
                  </div>
                </div>
                <br></br>
                <div class="card text-white bg-info text-center">
                  <div class="card-header">Playing As</div>
                  <div class="card-body">
                    <h5 class="card-title">
                      {this.state.player}{" "}
                      {this.state.gameType === "vsCPU"
                        ? " against CPU"
                        : ` against ${this.state.player === "X" ? "O" : "X"}`}
                    </h5>
                  </div>
                </div>

                {this.state.gameType === "vsCPU" && (
                  <React.Fragment><br></br>
                    <div class="card text-white bg-danger text-center">

                      <div class="card-header">Difficulty Level</div>
                      <div class="card-body">
                        <h5 class="card-title">
                          {this.state.gameLevel.toUpperCase()}
                        </h5>
                      </div>
                    </div>
                    </React.Fragment>
                )}
              </div>
            </div></div></div>
            {/* <div className="col-12 col-sm-6 col-md-6" id="side-nav-right">
              <div className="text-center ">
                <div className="side-nav-head">
                  <h3>Current Turn</h3>
                </div>
                <div className="side-nav-body">
                  {this.state.gameOver ? "-" : this.state.currentTurn}
                </div>
              </div>

              <div className="text-center ">
                <div className="side-nav-head">
                  <h3>Remaining Moves till Draw</h3>
                </div>
                <div className="side-nav-body">
                  {this.state.gameOver ? "-" : 9 - this.gameData.totalMoves}
                </div>
              </div>
              <div className="text-center ">
                <div className="side-nav-head">
                  <h3>Game ID - Game Type</h3>
                </div>
                <div className="side-nav-body">
                  {this.state.gameId} - {this.state.gameType}
                </div>
              </div>
            </div> */}
          </div>
          
        </React.Fragment>
      );
  }
}

export default Game;

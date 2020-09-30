import React, { Component } from "react";

class Home extends Component {
  constructor() {
    super();
    this.joinGame = this.joinGame.bind(this);
    this.state = {
      gameId: "",
      joinRole: "O"
    };
  }
  handleChange = (e) => {
    this.setState({ gameId: e.target.value });
  };
  handleRoleChange = (e)=>{
    this.setState({ joinRole: e.target.value });
  }
  joinGame(){
      if(this.state.gameId.length!==5){
          alert('Game ID must be of length 5 characters!');
          return;
      }
      console.log(this.state.gameId,this.state.joinRole)
  }
  render() {
    return (
      <div className="container">
        <div className="home-box">
          <div className="jumbotron jumbotron-fluid">
            <div className="container">
              <h2 className="text-center">
                <u>Game Time!</u>
              </h2>
              <div className="row">
                <div className="col-6  text-center">
                  <h4>Start New Game</h4>
                  <div className="row start-game-options">
                    <div className="col-6">
                      <button className="btn btn-md btn-info">Vs CPU</button>
                    </div>
                    <div className="col-6">
                      <button className="btn btn-md btn-warning">
                        Vs Player
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-6  text-center">
                  <h4>Join Existing Game</h4>
                  <div className="form-group">
                    <label>Game Id</label>
                    <div>
                        <label>Join As:</label>
                      <select value={this.state.joinRole} onChange={this.handleRoleChange}>
                        <option value="X">X</option>
                        <option value="O">O</option>
                      </select>
                    </div>{" "}
                    <input
                      type="text"
                      className="form-control form-control-sm text-center"
                      value={this.state.gameId}
                      maxLength="5"
                      minLength="5"
                      onChange={this.handleChange}
                      placeholder="Enter the 5 character game ID to join"
                    ></input>
                    <br></br>
                    <button className="btn btn-md btn-success" onClick={this.joinGame}>
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
  }
}
export default Home;

const express = require("express");
let Game = require("../models/Game");
const router = express.Router();
const shortid = require("shortid");

//GET all games method
router.get("", async (req, res) => {
  let allGames = await Game.find();
  try {
    console.log("Response received: Game");
    res.json(allGames);
  } catch (err) {
    res.json({ message: err });
  }
});

//GET game by ID method
router.get("/:id", async (req, res) => {
  let games = await Game.find({ gameId: req.params.id })
    .then((data) => res.json(data))
    .catch((err) => res.json({ errorMessage: err }));
});

//POST game method
router.post("", async (req, res) => {
  let gameToPost = new Game({
    gameId: shortid.generate().substr(0, 5).toUpperCase(),
    gameType: req.body.gameType,
    currentTurn: req.body.currentTurn,
    boxes: Array(9).fill(""),
    gameOver: false,
    totalMoves: 0,
    gameLevel: req.body.gameLevel,
    cpuPlayer: req.body.cpuPlayer,
    xWins: 0,
    oWins: 0,
    trigger: false,
    creator: req.body.creator,
  });

  let game = await gameToPost
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.send({ errorMessage: err });
    });
});

// Set restart trigger
router.put("/setTrigger/:id", async (req, res) => {
  const updateGameData = await Game.updateOne(
    { gameId: req.params.id },
    {
      trigger: true,
    }
  )
    .then((data) => {
      //res.json(data);
      console.log(data);
      res.send("Triggered successfully");
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});
// Set restart trigger
router.put("/resetTrigger/:id", async (req, res) => {
  const updateGameData = await Game.updateOne(
    { gameId: req.params.id },
    {
      trigger: false,
    }
  )
    .then((data) => {
      //res.json(data);
      console.log(data);
      res.send("Trigger reset successful");
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

//PATCH game data by ID after move
router.put("/:id", async (req, res) => {
  const updateGameData = await Game.updateOne(
    { gameId: req.params.id },
    {
      gameStatus: req.body.gameStatus,
      boxes: req.body.boxes,
      winner: req.body.winner,
      currentTurn: req.body.currentTurn,
      gameOver: req.body.gameOver,
      totalMoves: req.body.totalMoves,
      gameLevel: req.body.gameLevel,
      cpuPlayer: req.body.cpuPlayer,
      xWins: req.body.xWins,
      oWins: req.body.oWins,
      creator: req.body.creator,
    }
  )
    .then((data) => {
      //res.json(data);
      console.log(data);
      res.send("Update Done");
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

module.exports = router;

const mongoose=require('mongoose');

const SampleSchema=mongoose.Schema({
    gameId: {
        type: String,
        required: true,
        unique: true,
        maxlength: 5,
        minLength: 5
    },
    gameType:{
        type: String,
        required: true
    },
    currentTurn:{
        type: String,
        required: true,
    },
   gameOver:{
        type: Boolean,
        required: true
   },
    boxes: [String],
    gameStatus:{
        type: String,
        default: 'InProgress'
    },
    gameLevel:{
        type: String,
        default: "notCPU"
    },
    cpuPlayer:{
        type: String,
        required: true
    },
    winner: {
        type: String,
        default: undefined
    },
    totalMoves:{
        type: Number,
        default: 0,
        required: true
    },
    xWins:{
        type: Number,
        default: 0,
        required: true
    },
    oWins:{
        type: Number,
        default: 0,
        required: true
    }
});

module.exports = mongoose.model('Game', SampleSchema);
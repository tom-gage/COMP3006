const assert = require('chai').assert;
const WS = require('../app/ws/WS');
const ActiveGame = require('../app/objects/ActiveGame');

describe('hooks', function () {
    let activeGame;
    ACTIVE_GAMES = [];

    beforeEach(function () {
        activeGame = new ActiveGame('123', 'P1ID', 'P2ID');
        activeGame.player1SocketID = '123';
        activeGame.player2SocketID = '456';
        ACTIVE_GAMES.push(activeGame);
    });

    describe('WS.sendEventToPlayers()', async function () {
        it('should send a ws message to the players in a game', async function () {


        });
    });







});
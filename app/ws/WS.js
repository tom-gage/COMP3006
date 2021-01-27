let DB = require('../db/DB');
let User = DB.getUserModel();

module.exports = function(socket, io) {
    //on connection
    console.log("Websocket connection established...");

    //on join request
    socket.on('joinRequest', async function(msg) {
        console.log('client join request received, id is: ' + msg);

        handleJoinRequest(JSON.parse(msg));
    });

    //on move request
    socket.on('moveRequest', async function (msg) {
        console.log('move request received: ');
        console.log(msg);

        let moveRequest = JSON.parse(msg);

        await handleMoveRequest(moveRequest);
    });

    //on message
    socket.on('sentMessage', async function (msg) {
        console.log('message received: ');
        console.log(msg);

        let message = JSON.parse(msg);

        await handleMessage(message);
    });

    socket.on('disconnect', function() {
        console.log('Got disconnect!');

        pruneEmptyActiveGames(findActiveGameByWSID(socket.id), socket.id);
    });

    //functions
    async function handleMessage(message){
        let targetGame = findActiveGame(message.gameCode);
        if(targetGame){
            targetGame.messages.push(message.playerID + ': ' + message.messageBody);
            sendEventToPlayers(targetGame, 'updateMessages', JSON.stringify(targetGame.messages));


            //FOR CHEATERS
            if(message.messageBody === 'cheat'){
                targetGame.initialiseCheatBoardState();
                handleMoveRequest({
                    gameCode : targetGame.code,
                    playerID : 1,
                    currentPos : '',
                    requestedPos : ''
                })
            }
        }
    }

    async function handleMoveRequest(moveRequest){
        let targetGame = findActiveGame(moveRequest.gameCode);

        if(targetGame){
            targetGame.makeMove(moveRequest.currentPos, moveRequest.requestedPos, moveRequest.playerID);

            sendEventToPlayers(targetGame,'updateBoard', targetGame.getBoardStateAsHTML());
            sendEventToPlayers(targetGame,'updateTurnDisplay', targetGame.getCurrentTurnAsHTML());
            sendEventToPlayers(targetGame, 'updateScores', targetGame.getScoresAsHTML());

            console.log('sending board update...');
            console.log('sending to (player1): ' + targetGame.player1SocketID);
            console.log('sending to (player2): ' + targetGame.player2SocketID);

            //check for win/loss condition
            if(targetGame.gameOver){
                console.log(targetGame.winningTeam + ' team won!');

                if(targetGame.winningTeam === 'Red'){
                    await updatePlayerWins(targetGame.player1ID, targetGame.player2ID);
                } else if(targetGame.winningTeam === 'Blue'){
                    await updatePlayerWins(targetGame.player2ID, targetGame.player1ID);
                }

                sendEventToPlayers(targetGame,'updateGameMessage', targetGame.winningTeam + ' team won!');
                sendEventToPlayers(targetGame,'updateTurnDisplay', 'GAME OVER! ' + targetGame.winningTeam + ' team won!');

                deleteActiveGame(targetGame);
            }
        }
    }

    function sendEventToPlayers(targetGame, event, msg){
        io.to(targetGame.player1SocketID).emit(event, msg);
        io.to(targetGame.player2SocketID).emit(event, msg);
    }


    function handleJoinRequest(joinRequest) {
        let targetGame = findActiveGame(joinRequest.gameCode);

        console.log('joining player id: ' + joinRequest.playerID);
        console.log('target game player1 id: ' + targetGame.player1ID);
        console.log('target game player2 id: ' + targetGame.player2ID);

        if(targetGame){
            if(joinRequest.playerID === targetGame.player1ID){
                targetGame.player1SocketID = joinRequest.socketID;

            } else if(joinRequest.playerID === targetGame.player2ID){
                targetGame.player2SocketID = joinRequest.socketID;
            }

            console.log('sending initial board update...');
            sendEventToPlayers(targetGame, 'updateBoard', targetGame.getBoardStateAsHTML());
            sendEventToPlayers(targetGame, 'updateTurnDisplay', targetGame.getCurrentTurnAsHTML());
            sendEventToPlayers(targetGame, 'updateScores', targetGame.getScoresAsHTML());

            io.to(targetGame.player1SocketID).emit('updateTeamStatus', 'You are on Red Team.');
            io.to(targetGame.player2SocketID).emit('updateTeamStatus', 'You are on Blue Team.');

            sendEventToPlayers(targetGame, 'updateMessages', JSON.stringify(targetGame.messages));
        }
    }

    function pruneEmptyActiveGames(targetGame, WSID) {
        if(targetGame){//if target game exists
            if (targetGame.player1SocketID === WSID){
                targetGame.player1SocketID = '';
                targetGame.player1ID = '';
            } else if(targetGame.player2SocketID === WSID){//if disconnecting websocket id matches a player's websocket id, prune it
                targetGame.player2SocketID = '';
                targetGame.player2ID = '';
            }

            if(targetGame.player1SocketID === '' && targetGame.player2SocketID === ''){//if game has no players, delete it
                deleteActiveGame(targetGame);
            }
        }
    }

    function findActiveGameByWSID(WSID) {
        let targetGame = null;

        targetGame = ACTIVE_GAMES.find(function (ActiveGame, index) {
            return ActiveGame.player1SocketID.toString() === WSID.toString() || ActiveGame.player2SocketID.toString() === WSID.toString();
        });

        console.log('found game by WS: ' + targetGame);

        return targetGame;
    }

    function findActiveGame(gameCode){
        let targetGame = null;
        // console.log('finding active game...');
        targetGame = ACTIVE_GAMES.find(function (ActiveGame, index) {
            return ActiveGame.code.toString() === gameCode.toString();
        });

        return targetGame;
    }

    function deleteActiveGame(updateGame){
        ACTIVE_GAMES.forEach(function (activeGame, index) {//for each game in ACTIVE_GAMES
            if(activeGame.code.toString() === updateGame.code.toString()){//if there's an active game with a code matching the submitted code
                ACTIVE_GAMES.splice(index, 1);
            }
        });
    }


    async function updatePlayerWins(winningPlayer, losingPlayer){
        console.log('a player won, updating database...');
        console.log('adding win:' + winningPlayer);
        console.log('adding loss:' + losingPlayer);

        await User.updateOne(
            {
                username : winningPlayer,
            },
            {
                $inc : { wins : 1}
            });

        await User.updateOne(
            {
                username : losingPlayer,
            },
            {
                $inc : { losses : 1}
            });

        await User.find({}, function (err, users) {
            global.USERS = users;
        });
    }

};
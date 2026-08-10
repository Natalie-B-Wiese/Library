console.log("JS connected!");

const GameController = (() => {
    function _createPlayer(name, symbol) {
        return {name: name, symbol: symbol}
    }

    const board = (() => {
        const rows=3;
        const columns=3;
        const board=[];

        const getBoard = () => board;

        // Create a 2d array that will represent the state of the game board
        // Row 0 is top, and column 0 is left
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }

        function _tileEmpty(column, row) {
            return board[row][column].getPlayer() == null;
        }

        function tryPlacePlayer(column, row, player) {
            //ensure it can place it first, if successful then do it
            if (_tileEmpty(column, row)) {
                board[row][column].setPlayer(player);
                return true;
            }
            else
            {
                return false;
            }
        }

        const printBoard=() => {
            const boardWithCellValues = board.map((row) =>
                row.map((cell) =>
                    cell.getPlayer() ? cell.getPlayer().symbol : ' ')
            );
            console.log(boardWithCellValues);
        }

        function Cell()
        {
            let player=null;

            const getPlayer = () => player;

            function setPlayer(newPlayer) {
                player = newPlayer;
            }

            return { setPlayer, getPlayer };
        }

        return { getBoard, printBoard, tryPlacePlayer };

    })();

    const players=[_createPlayer("Player 1", "X"), _createPlayer("Player 2", "O")];
    let activePlayer = players[0];

    const _switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const _printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    _printNewRound();

    const playRound = (column, row) => {
        // Drop a token for the current player
        console.log(
            `Placing ${getActivePlayer().symbol} into column ${column} row ${row}...`
        );
        
        if (!board.tryPlacePlayer(column, row, getActivePlayer())) { return; }

        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */

        // Switch player turn
        _switchPlayerTurn();
        _printNewRound();
    };


    return {
        playRound,
        getActivePlayer
    }

})();

GameController.playRound(0, 0);

// this does nothing since the cell is already occuppied
GameController.playRound(0, 0);

GameController.playRound(1, 0);

// If you only need a single instance of something (e.g. the gameboard, the displayController etc.) then wrap the factory inside an IIFE (module pattern) so it cannot be reused to create additional instances.
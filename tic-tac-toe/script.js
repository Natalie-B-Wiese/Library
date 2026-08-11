console.log("JS connected!");

export const GameController = (() => {
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

        // returns a player if the player has won in the row, otherwise returns nil
        function _rowWinner(row) {
            let rowWinner=board[row][0].getPlayer();

            for (let col=1; col<columns; col++) {
                if (rowWinner!=board[row][col].getPlayer()) { return null; }

                rowWinner=board[row][col].getPlayer();
            }

            return rowWinner;
        }

        // returns a player if the player has won in the column, otherwise returns nil
        function _columnWinner(column) {
            let columnWinner=board[0][column].getPlayer();

            for (let row=1; row<rows; row++) {
                if (columnWinner!=board[row][column].getPlayer()) { return null; }

                columnWinner=board[row][column].getPlayer();
            }

            return columnWinner;
        }

        /* returns a winner if a player has completed a row */
        function _rowsWinner() {
            let currentRowWinner;

            for (let row=0; row<rows; row++) {
                currentRowWinner=_rowWinner(row);
                if (currentRowWinner!=null) {return currentRowWinner;}
            }

            return null;
        }

        /* returns a winner if a player has completed a column */
        function _columnsWinner() {
            let currentColWinner;

            for (let col=0; col<columns; col++) {
                currentColWinner=_columnWinner(col);
                if (currentColWinner!=null) {return currentColWinner;}
            }

            return null;
        }

        // top left to bottom right (negative slope)
        function _negativeDiagonalWinner() {
            let row=rows-1;
            let column=0;
            let currentDiagonalWinner=board[row][column].getPlayer();

            // there are the same number of rows as columns
            for (let i=1; i<rows; i++) {
                row-=1;
                column+=1;

                if (currentDiagonalWinner!=board[row][column].getPlayer()) { return null; }

                currentDiagonalWinner=board[row][column].getPlayer();
            }

            return currentDiagonalWinner;

        }

        // bottom left to top right (positive slope)
        function _positiveDiagonalWinner() {
            let row=0;
            let column=0;
            let currentDiagonalWinner=board[row][column].getPlayer();

            // there are the same number of rows as columns
            for (let i=1; i<rows; i++) {
                row+=1;
                column+=1;
                
                if (currentDiagonalWinner!=board[row][column].getPlayer()) { return null; }

                currentDiagonalWinner=board[row][column].getPlayer();
            }

            return currentDiagonalWinner;

        }

        function winner() {
            return _rowsWinner() || _columnsWinner() || _positiveDiagonalWinner() || _negativeDiagonalWinner();
        }

        function _isFull() {
            return board.flat().every(cell => cell.isFull()); 
        }

        function isGameOver() {
            return _isFull() || !!winner();
        }

        function _tileEmpty(column, row) {
            return !board[row][column].isFull();
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

            const isFull = () => {
                return player!=null;
            }

            return { setPlayer, getPlayer, isFull };
        }

        return { getBoard, printBoard, tryPlacePlayer, winner, isGameOver };

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
        getActivePlayer,

        //used by tests:
        getBoard: board.getBoard,
        winner: board.winner,
        isGameOver: board.isGameOver
    }

})();

// If you only need a single instance of something (e.g. the gameboard, the displayController etc.) then wrap the factory inside an IIFE (module pattern) so it cannot be reused to create additional instances.
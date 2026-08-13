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

        resetBoard();

        function resetBoard() {
            // Create a 2d array that will represent the state of the game board
            // Row 0 is top, and column 0 is left
            for (let i = 0; i < rows; i++) {
                board[i] = [];
                for (let j = 0; j < columns; j++) {
                    board[i].push(Cell());
                }
            }
        }

        

        // returns a player if the player has won in the row, otherwise returns nil
        function _rowWinner(row) {
            let tiles=[]
            tiles.push([row, 0])

            let rowWinner=board[row][0].getPlayer();
            if (rowWinner==null) { return null; }

            for (let col=1; col<columns; col++) {
                if (rowWinner!=board[row][col].getPlayer()) { return null; }

                rowWinner=board[row][col].getPlayer();
                tiles.push([row, col]);
            }

            return tiles;
        }

        // returns a player if the player has won in the column, otherwise returns nil
        function _columnWinner(column) {
            let tiles=[]
            tiles.push([0, column])

            let columnWinner=board[0][column].getPlayer();
            if (columnWinner==null) { return null; }

            for (let row=1; row<rows; row++) {
                if (columnWinner!=board[row][column].getPlayer()) { return null; }

                columnWinner=board[row][column].getPlayer();
                tiles.push([row, column]);
            }

            return tiles;
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

            let tiles=[]
            tiles.push([row, column])

            let currentDiagonalWinner=board[row][column].getPlayer();
            if (currentDiagonalWinner==null) { return null; }

            // there are the same number of rows as columns
            for (let i=1; i<rows; i++) {
                row-=1;
                column+=1;

                if (currentDiagonalWinner!=board[row][column].getPlayer()) { return null; }

                currentDiagonalWinner=board[row][column].getPlayer();
                tiles.push([row, column])
            }

            return tiles;

        }

        // bottom left to top right (positive slope)
        function _positiveDiagonalWinner() {
            let row=0;
            let column=0;
            let currentDiagonalWinner=board[row][column].getPlayer();
            if (currentDiagonalWinner==null) { return null; }

            let tiles=[]
            tiles.push([row, column])

            // there are the same number of rows as columns
            for (let i=1; i<rows; i++) {
                row+=1;
                column+=1;

                if (currentDiagonalWinner!=board[row][column].getPlayer()) { return null; }

                currentDiagonalWinner=board[row][column].getPlayer();
                tiles.push([row, column])
            }

            return tiles;

        }

        function winner() {
            const possibleWinner=winningCells()
            const [row, column] = possibleWinner ? possibleWinner[0] : [];
            return possibleWinner ? board[row][column].getPlayer() : null
        }

        function winningCells() {
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

        function to_s()
        {
            return board.map((row) =>
                row.map((cell) =>
                    cell.getSymbol())
            );
        }

        const printBoard=() => {
            console.log(to_s());
        }

        function Cell()
        {
            let player=null;

            const getPlayer = () => player;

            const getSymbol = () => {
                return isFull() ? player.symbol : '';
            }

            function setPlayer(newPlayer) {
                player = newPlayer;
            }

            const isFull = () => {
                return player!=null;
            }

            return { setPlayer, getPlayer, isFull, getSymbol };
        }

        return { getBoard, resetBoard, printBoard, tryPlacePlayer, winner, winningCells, isGameOver };

    })();

    const restartGame = () => {
        board.resetBoard();
        activePlayer=players[0];
    }

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

        // Switch player turn
        _switchPlayerTurn();
        _printNewRound();
    };


    return {
        playRound,
        getActivePlayer,
        winner: board.winner,
        winningCells: board.winningCells,
        isGameOver: board.isGameOver,
        restartGame,

        //used by tests:
        getBoard: board.getBoard
    }

})();

export const DisplayController = (() => {
    const playerTurnDiv = document.querySelector("#turn");
    const boardDiv = document.querySelector("#board");
    const restartButton=document.querySelector("#restart");

    restartButton.addEventListener("click", clickHandlerRestart);

    function clickHandlerRestart(e) {
        GameController.restartGame();

        updateScreen();
    }

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = GameController.getBoard();
        const activePlayer = GameController.getActivePlayer();

        const winningCells=GameController.winningCells();
        const winner=GameController.winner();
        const gameOver=GameController.isGameOver();

        // Display the winner's name once there is one, otherwise the active player's turn
        playerTurnDiv.textContent = winner ? `${winner.name} wins!` : `${activePlayer.name}'s turn...`;

        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                // Anything clickable should be a button!!
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                if (winningCells?.some(([row, column]) => row === rowIndex && column === columnIndex))
                {
                    cellButton.classList.add("cell--line");
                }

                // Create a data attribute to identify the column
                // This makes it easier to pass into our `playRound` function
                cellButton.dataset.column = columnIndex;
                cellButton.dataset.row = rowIndex;

                if (cell.isFull() || gameOver)
                {
                    cellButton.disabled=true;
                }

                cellButton.textContent = cell.getSymbol();
                boardDiv.appendChild(cellButton);
            });
        });
    };

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        // Make sure I've clicked a cell and not the gaps in between
        if (!selectedColumn || !selectedRow) return;

        GameController.playRound(selectedColumn, selectedRow);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Initial render
    updateScreen();

})();
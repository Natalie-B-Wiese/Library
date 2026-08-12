import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const indexHtmlPath = path.resolve(process.cwd(), "index.html");

let GameController;

beforeEach(async () => {
    vi.resetModules();

    const indexHtml = readFileSync(indexHtmlPath, "utf-8");
    document.body.innerHTML = indexHtml.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];

    // Importing script.js also runs DisplayController's IIFE as a side effect,
    // which renders the board and wires up the click handler used below.
    ({ GameController } = await import("./script.js"));
});

// Clicks the board button for the given row/column, mirroring a real user click.
function clickCell(row, column) {
    document.querySelector(`#board button[data-row="${row}"][data-column="${column}"]`).click();
}

// Coordinates are [row, column] pairs, matching the board's board[row][column] indexing.
function expectSameCells(actualCells, expectedCells) {
    const normalize = (cells) => cells.map((cell) => JSON.stringify(cell)).sort();

    expect(normalize(actualCells)).toEqual(normalize(expectedCells));
}

// Plays moves so playerOne completes the top row (row 0): (0,0) (0,1) (0,2)
function completeTopRow() {
    const topRow = 0;
    const otherRow = 1;
    const leftColumn = 0;
    const middleColumn = 1;
    const rightColumn = 2;

    const playerOne = GameController.getActivePlayer();
    GameController.playRound(leftColumn, topRow); // playerOne
    GameController.playRound(leftColumn, otherRow); // playerTwo
    GameController.playRound(middleColumn, topRow); // playerOne
    GameController.playRound(middleColumn, otherRow); // playerTwo
    GameController.playRound(rightColumn, topRow); // playerOne completes the top row

    return playerOne;
}

// Plays moves so playerTwo completes the top row (row 0): (0,0) (0,1) (0,2)
function completeTopRowAsSecondPlayer() {
    const topRow = 0;
    const otherRow = 1;
    const bystanderRow = 2;
    const leftColumn = 0;
    const middleColumn = 1;
    const rightColumn = 2;

    GameController.playRound(leftColumn, bystanderRow); // playerOne
    const playerTwo = GameController.getActivePlayer();
    GameController.playRound(leftColumn, topRow); // playerTwo
    GameController.playRound(middleColumn, bystanderRow); // playerOne
    GameController.playRound(middleColumn, topRow); // playerTwo
    GameController.playRound(rightColumn, otherRow); // playerOne, no win yet
    GameController.playRound(rightColumn, topRow); // playerTwo completes the top row

    return playerTwo;
}

// Plays moves so playerOne completes the left column (column 0): (0,0) (1,0) (2,0)
function completeLeftColumn() {
    const leftColumn = 0;
    const otherColumn = 1;
    const topRow = 0;
    const middleRow = 1;
    const bottomRow = 2;

    const playerOne = GameController.getActivePlayer();
    GameController.playRound(leftColumn, topRow); // playerOne
    GameController.playRound(otherColumn, topRow); // playerTwo
    GameController.playRound(leftColumn, middleRow); // playerOne
    GameController.playRound(otherColumn, middleRow); // playerTwo
    GameController.playRound(leftColumn, bottomRow); // playerOne completes the left column

    return playerOne;
}

// Plays moves so playerOne completes the top-left to bottom-right diagonal: (0,0) (1,1) (2,2)
function completeTopLeftToBottomRightDiagonal() {
    const leftColumn = 0;
    const middleColumn = 1;
    const rightColumn = 2;
    const topRow = 0;
    const middleRow = 1;
    const bottomRow = 2;

    const playerOne = GameController.getActivePlayer();
    GameController.playRound(leftColumn, topRow); // playerOne
    GameController.playRound(middleColumn, topRow); // playerTwo
    GameController.playRound(middleColumn, middleRow); // playerOne
    GameController.playRound(leftColumn, middleRow); // playerTwo
    GameController.playRound(rightColumn, bottomRow); // playerOne completes the diagonal

    return playerOne;
}

// Plays moves so playerOne completes the top-right to bottom-left diagonal: (0,2) (1,1) (2,0)
function completeTopRightToBottomLeftDiagonal() {
    const leftColumn = 0;
    const middleColumn = 1;
    const rightColumn = 2;
    const topRow = 0;
    const middleRow = 1;
    const bottomRow = 2;

    const playerOne = GameController.getActivePlayer();
    GameController.playRound(rightColumn, topRow); // playerOne
    GameController.playRound(leftColumn, topRow); // playerTwo
    GameController.playRound(middleColumn, middleRow); // playerOne
    GameController.playRound(middleColumn, topRow); // playerTwo
    GameController.playRound(leftColumn, bottomRow); // playerOne completes the diagonal

    return playerOne;
}

describe("GameController.playRound", () => {
    it("places the active player's symbol in the target cell and switches turn", () => {
        const column = 0;
        const row = 0;
        const startingPlayer = GameController.getActivePlayer();

        GameController.playRound(column, row);

        expect(GameController.getBoard()[row][column].getPlayer()).toBe(startingPlayer);
        expect(GameController.getActivePlayer()).not.toBe(startingPlayer);
    });

    it("places the second player's symbol in the target cell and switches turn back", () => {
        const firstColumn = 0;
        const firstRow = 0;
        const secondColumn = 1;
        const secondRow = 0;

        GameController.playRound(firstColumn, firstRow);
        const secondPlayer = GameController.getActivePlayer();

        GameController.playRound(secondColumn, secondRow);

        expect(GameController.getBoard()[secondRow][secondColumn].getPlayer()).toBe(secondPlayer);
        expect(GameController.getActivePlayer()).not.toBe(secondPlayer);
    });

    it("does not switch the active player when the cell is already occupied", () => {
        const column = 0;
        const row = 0;

        GameController.playRound(column, row);
        const activePlayer = GameController.getActivePlayer();

        GameController.playRound(column, row);

        expect(GameController.getActivePlayer()).toBe(activePlayer);
    });
});

describe("GameController.winner", () => {
    it("returns null when no one has won yet", () => {
        const column = 0;
        const row = 0;

        GameController.playRound(column, row);

        expect(GameController.winner()).toBeNull();
    });

    it("returns the winning player when they occupy a full row", () => {
        const playerOne = completeTopRow();

        expect(GameController.winner()).toBe(playerOne);
    });

    it("returns the winning player when they occupy a full column", () => {
        const playerOne = completeLeftColumn();

        expect(GameController.winner()).toBe(playerOne);
    });

    it("returns the winning player when they occupy the top-left to bottom-right diagonal", () => {
        const playerOne = completeTopLeftToBottomRightDiagonal();

        expect(GameController.winner()).toBe(playerOne);
    });

    it("returns the winning player when they occupy the top-right to bottom-left diagonal", () => {
        const playerOne = completeTopRightToBottomLeftDiagonal();

        expect(GameController.winner()).toBe(playerOne);
    });

    it("returns the winning player when the second player wins", () => {
        const playerTwo = completeTopRowAsSecondPlayer();

        expect(GameController.winner()).toBe(playerTwo);
    });
});

describe("GameController.winningCells", () => {
    it("returns null when no one has won yet", () => {
        const column = 0;
        const row = 0;

        GameController.playRound(column, row);

        expect(GameController.winningCells()).toBeNull();
    });

    it("returns null when the board is empty", () => {
        expect(GameController.winningCells()).toBeNull();
    });

    it("returns the three cells of the completed row", () => {
        completeTopRow();

        expectSameCells(GameController.winningCells(), [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
    });

    it("returns the three cells of the completed column", () => {
        completeLeftColumn();

        expectSameCells(GameController.winningCells(), [
            [0, 0],
            [1, 0],
            [2, 0],
        ]);
    });

    it("returns the three cells of the completed top-left to bottom-right diagonal", () => {
        completeTopLeftToBottomRightDiagonal();

        expectSameCells(GameController.winningCells(), [
            [0, 0],
            [1, 1],
            [2, 2],
        ]);
    });

    it("returns the three cells of the completed top-right to bottom-left diagonal", () => {
        completeTopRightToBottomLeftDiagonal();

        expectSameCells(GameController.winningCells(), [
            [0, 2],
            [1, 1],
            [2, 0],
        ]);
    });

    it("returns the three cells of the completed row when the second player wins", () => {
        completeTopRowAsSecondPlayer();

        expectSameCells(GameController.winningCells(), [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
    });
});

describe("DisplayController", () => {
    it("does not add the winning-line class to any cell before there is a winner", () => {
        clickCell(0, 0);

        const markedCells = document.querySelectorAll("#board button.cell--line");

        expect(markedCells).toHaveLength(0);
    });

    it("adds the winning-line class to exactly the three cells of the completed row", () => {
        // Mirrors completeTopRow(), but via clicks so the board re-renders through DisplayController.
        clickCell(0, 0); // playerOne
        clickCell(1, 0); // playerTwo
        clickCell(0, 1); // playerOne
        clickCell(1, 1); // playerTwo
        clickCell(0, 2); // playerOne completes the top row

        const markedCells = [...document.querySelectorAll("#board button.cell--line")].map(
            (button) => [Number(button.dataset.row), Number(button.dataset.column)]
        );

        expectSameCells(markedCells, [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
    });

    it("does not add the winning-line class to cells outside the completed row", () => {
        clickCell(0, 0); // playerOne
        clickCell(1, 0); // playerTwo
        clickCell(0, 1); // playerOne
        clickCell(1, 1); // playerTwo
        clickCell(0, 2); // playerOne completes the top row

        const bystanderCell = document.querySelector('#board button[data-row="2"][data-column="2"]');

        expect(bystanderCell.classList.contains("cell--line")).toBe(false);
    });

    it("displays the active player's turn when there is no winner", () => {
        clickCell(0, 0); // playerOne moves, turn switches to playerTwo
        const activePlayer = GameController.getActivePlayer();

        const playerTurnDiv = document.querySelector("#turn");

        expect(playerTurnDiv.textContent).toContain(activePlayer.name);
    });

    it("displays the next player's turn after switching", () => {
        clickCell(0, 0); // playerOne
        clickCell(1, 0); // playerTwo, turn switches back to playerOne
        const activePlayer = GameController.getActivePlayer();

        const playerTurnDiv = document.querySelector("#turn");

        expect(playerTurnDiv.textContent).toContain(activePlayer.name);
    });

    it("displays the winning player's name instead of a turn once there is a winner", () => {
        // Mirrors completeTopRow(), but via clicks so the board re-renders through DisplayController.
        const playerOne = GameController.getActivePlayer();
        clickCell(0, 0); // playerOne
        clickCell(1, 0); // playerTwo
        clickCell(0, 1); // playerOne
        clickCell(1, 1); // playerTwo
        clickCell(0, 2); // playerOne completes the top row

        const playerTurnDiv = document.querySelector("#turn");

        expect(playerTurnDiv.textContent).toContain(playerOne.name);
        expect(playerTurnDiv.textContent).not.toContain("turn");
    });
});

describe("Cell.getSymbol", () => {
    it("returns '' when the cell has no player", () => {
        const column = 0;
        const row = 0;

        expect(GameController.getBoard()[row][column].getSymbol()).toBe("");
    });

    it("returns 'X' when the cell's player has the 'X' symbol", () => {
        const column = 0;
        const row = 0;
        const startingPlayer = GameController.getActivePlayer();

        GameController.playRound(column, row);

        expect(startingPlayer.symbol).toBe("X");
        expect(GameController.getBoard()[row][column].getSymbol()).toBe("X");
    });

    it("returns 'O' when the cell's player has the 'O' symbol", () => {
        const firstColumn = 0;
        const firstRow = 0;
        const secondColumn = 1;
        const secondRow = 0;

        GameController.playRound(firstColumn, firstRow); // playerOne (X)
        const secondPlayer = GameController.getActivePlayer();
        GameController.playRound(secondColumn, secondRow); // playerTwo (O)

        expect(secondPlayer.symbol).toBe("O");
        expect(GameController.getBoard()[secondRow][secondColumn].getSymbol()).toBe("O");
    });
});

describe("GameController.isGameOver", () => {
    it("returns false when the board is empty", () => {
        expect(GameController.isGameOver()).toBe(false);
    });

    it("returns false when only some cells are occupied and no one has won", () => {
        GameController.playRound(0, 0);
        GameController.playRound(1, 0);

        expect(GameController.isGameOver()).toBe(false);
    });

    it("returns true when a player has won before the board is full", () => {
        completeTopRow();

        expect(GameController.isGameOver()).toBe(true);
    });

    it("returns true when every cell is occupied even without a winner", () => {
        GameController.playRound(0, 0); // playerOne
        GameController.playRound(1, 0); // playerTwo
        GameController.playRound(2, 0); // playerOne
        GameController.playRound(1, 1); // playerTwo
        GameController.playRound(0, 1); // playerOne
        GameController.playRound(2, 1); // playerTwo
        GameController.playRound(1, 2); // playerOne
        GameController.playRound(0, 2); // playerTwo
        GameController.playRound(2, 2); // playerOne

        expect(GameController.isGameOver()).toBe(true);
    });
});

import { describe, it, expect, beforeEach, vi } from "vitest";

let GameController;

beforeEach(async () => {
    vi.resetModules();
    ({ GameController } = await import("./script.js"));
});

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
        const topRow = 0;
        const leftColumn = 0;
        const middleColumn = 1;
        const rightColumn = 2;
        const otherRow = 1;

        const playerOne = GameController.getActivePlayer();
        GameController.playRound(leftColumn, topRow); // playerOne
        GameController.playRound(leftColumn, otherRow); // playerTwo
        GameController.playRound(middleColumn, topRow); // playerOne
        GameController.playRound(middleColumn, otherRow); // playerTwo
        GameController.playRound(rightColumn, topRow); // playerOne completes the top row

        expect(GameController.winner()).toBe(playerOne);
    });

    it("returns the winning player when they occupy a full column", () => {
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

        expect(GameController.winner()).toBe(playerOne);
    });

    it("returns the winning player when they occupy the top-left to bottom-right diagonal", () => {
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

        expect(GameController.winner()).toBe(playerOne);
    });

    it("returns the winning player when they occupy the top-right to bottom-left diagonal", () => {
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

        expect(GameController.winner()).toBe(playerOne);
    });

    it("returns the winning player when the second player wins", () => {
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

        expect(GameController.winner()).toBe(playerTwo);
    });
});

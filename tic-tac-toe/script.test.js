import { describe, it, expect, beforeEach, vi } from "vitest";

describe("GameController.playRound", () => {
    let GameController;

    beforeEach(async () => {
        vi.resetModules();
        ({ GameController } = await import("./script.js"));
    });

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

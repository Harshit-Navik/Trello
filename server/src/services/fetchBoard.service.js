import { Board } from "../models/board.model.js"

export const fetchBoard = async (boardId) => {
    return Board.findById(boardId).lean();
}


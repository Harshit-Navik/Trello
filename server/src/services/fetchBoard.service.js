import { Board } from "../models/board.model.js"
import { ApiError } from "../utils/ApiError.js";

export const fetchBoard = async (boardId) => {
    const board = await Board.findById(boardId).lean();
    if(!board) throw new ApiError(404, "Board doesn't exists");

    return board;
}


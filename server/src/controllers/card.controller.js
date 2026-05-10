import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Card } from "../models/card.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCard = asyncHandler(async (req, res) => {
    // fetch user details 
    const { listId } = req.params;
})
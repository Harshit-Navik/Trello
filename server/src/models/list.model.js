import mongoose from "mongoose";

const listSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },

    position: {
        type: Number,
        required: true
    }

}, { timestamps: true })


export const List = mongoose.model("List", listSchema);
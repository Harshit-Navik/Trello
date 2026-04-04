import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    }

}, { timestamps: true })


export const Board = mongoose.model("Board", boardSchema);
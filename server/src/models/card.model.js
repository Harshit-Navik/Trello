import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({ 

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    position: {
        type: Number,
        required: true,
    },

    listId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
        required: true
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

} , { timestamps : true })


export const Card = mongoose.model("Card" , cardSchema);
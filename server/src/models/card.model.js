import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({ 

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
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
    }

} , { timestamps : true })


export const Card = mongoose.model("Card" , cardSchema);
import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    members: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member"
        },

        joinedAt: {
            type: Date,
            default: Date.now
        }
    }]

}, { timestamps: true })

export const Organization = mongoose.model("Organization", organizationSchema)
import { Schema, model } from "mongoose";

interface ITicket {
    creator: string;
    channelId: string;
    createdAt: Date;
    category: string;
    ticketId: string;
}

const ticketSchema = new Schema<ITicket>({
    creator: {
        required: true,
        type: String
    },
    channelId: {
        required: true,
        type: String
    },
    category: {
        required: true,
        type: String
    },
    createdAt: {
        required: true,
        type: Date,
        default: Date.now
    },
    ticketId: {
        required: true,
        type: String
    }
})

export const Ticket = model<ITicket>("tickets", ticketSchema)
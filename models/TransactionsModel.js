import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // required: true
    },
    txnType: { type: String, required: true }, // Income or expense
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date },

}, { timestamps: true });

const TransactionsModel = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default TransactionsModel;
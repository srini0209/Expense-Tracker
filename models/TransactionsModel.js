import mongoose from "mongoose";

const transcationSchema = new mongoose.Schema({
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
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date }
});

const TransactionsModel = mongoose.models.Transaction || mongoose.model('Transaction', transcationSchema);

export default TransactionsModel;
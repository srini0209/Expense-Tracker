import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // required: true
    },
    type: { type: String, required: true },
    name: { type: String, required: true },

}, { timestamps: true })

const CategoriesModel = mongoose.models.Categories || mongoose.model('Categories', categorySchema);

export default CategoriesModel;
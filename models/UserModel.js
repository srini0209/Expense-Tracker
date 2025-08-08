import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date }

})

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;
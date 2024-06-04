import mongoose from "mongoose";

mongoose.pluralize(null);

const usersCollection = "users_index";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true, enum: ["admin", "user", "no-log"], default: "no-log"}
});

export const usersModel = mongoose.model(usersCollection, userSchema);
import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    fullname: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
}

const UserSchema = new Schema({
    fullname: { type: String },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },    
    profilePicture: { type: String },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);


export default model<IUser>('User', UserSchema);
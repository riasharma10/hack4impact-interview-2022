import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IUser extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: string;
  region: string;
  district: string;
  refreshToken: string;
}

/* TASK 7*/

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: false },
  region: { type: String, required: false },
  district: { type: String, required: false },
  refreshToken: { type: String, required: false },
});

const User = mongoose.model<IUser>('User', UserSchema);

export { User, IUser };

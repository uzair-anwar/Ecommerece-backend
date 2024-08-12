import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  image: { type: String },
  stripeId: { type: String },
});

export interface User extends mongoose.Document {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  stripeId: string;
}

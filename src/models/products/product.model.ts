import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  description: { type: String, require: true },
  image: {
    type: [{ type: String }],
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
});

export interface Product extends mongoose.Document {
  name: string;
  price: number;
  description: string;
  images: [];
  userId: string;
}

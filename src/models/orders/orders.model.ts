import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  price: { type: Number, require: true },
  items: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  paymentId: { type: String, require: true },
  cardNo: { type: Number, require: true },
});

export interface Order extends mongoose.Document {
  price: number;
  items: [];
  userId: string;
  paymentId: string;
  cardNo: number;
}

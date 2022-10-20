import * as monoogse from 'mongoose';

export const CoupanSchema = new monoogse.Schema({
  name: { type: String, require: true },
  discount: { type: Number, require: true },
  expireDate: { type: Date, require: true },
});

export interface Coupan extends monoogse.Document {
  name: string;
  discount: number;
  expireDate: Date;
}

import { Schema, model, Document } from 'mongoose';

// Nested Item schema
interface IItem {
  itemname: string;
  amount: number;
}

interface ITransaction extends Document {
  date: Date;
  amount: number;  // This will now store the total amount
  userid: string;
  items: IItem[];  // This will store an array of items
}

const itemSchema = new Schema<IItem>({
  itemname: { type: String, required: true },
  amount: { type: Number, required: true }
});

const transactionSchema = new Schema<ITransaction>({
  date: { type: Date, required: true },
  amount: { type: Number, required: true, default: 0 },  // Default to 0
  userid: { type: String, required: true },
  items: { type: [itemSchema], required: true, default: [] }  // Default to empty array
});

const Transaction = model<ITransaction>('Transaction', transactionSchema);

export default Transaction;

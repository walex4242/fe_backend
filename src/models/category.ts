import mongoose, { Schema, Document } from 'mongoose';
import { IQuestion } from './question';
import { ILevel } from './level'; // Import the Level interface/model

export interface ICategory extends Document {
  name: string;
  questions: IQuestion['_id'][]; // Array of Question ObjectId references
  community: string; // Community identifier
  level: ILevel['_id']; // Reference to Level ObjectId
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // Referencing Question model
  community: { type: String, required: true }, // Community identifier
  level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true }, // Link to Level model
});

export const Category = mongoose.model<ICategory>('Category', CategorySchema);

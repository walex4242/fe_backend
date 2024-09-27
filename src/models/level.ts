import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './category';
import { ICommunity } from './community'; // Import the Community interface/model
import { IQuestion } from './question';

export interface ILevel extends Document {
  name: string;
  categories: ICategory['_id'][]; // Array of Category ObjectId references
  community: ICommunity['_id']; // Reference to the Community model
  questions: IQuestion['_id'][];
}

const LevelSchema: Schema = new Schema({
  name: { type: String, required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Referencing Category model
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  }, // Linking to Community
});

export const Level = mongoose.model<ILevel>('Level', LevelSchema);

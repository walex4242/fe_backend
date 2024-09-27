import mongoose, { Schema, Document } from 'mongoose';
import { ICommunity } from './community';
import { ICategory } from './category';
import { ILevel } from './level';

export interface IQuestion extends Document {
  text: string;
  community: ICommunity['_id']; // Reference to Community
  category: ICategory['_id']; // Reference to Category
  level: ILevel['_id']; // Reference to Level
}

const QuestionSchema: Schema = new Schema({
  text: { type: String, required: true },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',

  }, // Reference to Community
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',

  }, // Reference to Category
  level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level'}, // Reference to Level
});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

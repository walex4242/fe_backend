import mongoose, { Schema, Document } from 'mongoose';
import { ILevel } from './level';
import { ICategory } from './category';
import { IQuestion } from './question';
import { Level } from './level';
import { Category } from './category';
import { Question } from './question';

export interface ICommunity extends Document {
  name: string;
  levels: ILevel['_id'][]; // Array of Level ObjectId references
  categories: ICategory['_id'][]; // Array of Category ObjectId references
  questions: IQuestion['_id'][]; // Array of Question ObjectId references
}

const CommunitySchema: Schema = new Schema({
  name: { type: String, required: true },
  levels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Level' }], // Referencing Level model
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Referencing Category model
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // Referencing Question model
});

// Pre-deleteOne hook to delete related levels, categories, and questions
CommunitySchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next: Function) {
    try {
      const community = this as unknown as ICommunity; // Explicitly cast 'this' to ICommunity

      // Delete related levels
      await Level.deleteMany({ _id: { $in: community.levels } });

      // Delete related categories
      await Category.deleteMany({ _id: { $in: community.categories } });

      // Delete related questions
      await Question.deleteMany({ _id: { $in: community.questions } });

      next();
    } catch (error) {
      next(error);
    }
  },
);

export const Community = mongoose.model<ICommunity>(
  'Community',
  CommunitySchema,
);

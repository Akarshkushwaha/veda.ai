import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IQuestionPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  sections: ISection[];
  totalMarks: number;
  createdAt: Date;
}

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
  marks: { type: Number, required: true }
});

const SectionSchema = new Schema({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true }
});

const QuestionPaperSchema: Schema = new Schema({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  sections: { type: [SectionSchema], required: true },
  totalMarks: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IQuestionPaper>('QuestionPaper', QuestionPaperSchema);

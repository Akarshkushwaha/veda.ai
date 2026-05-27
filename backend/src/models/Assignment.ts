import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  dueDate: Date;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  instructions: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
}

const AssignmentSchema: Schema = new Schema({
  dueDate: { type: Date, required: true },
  questionTypes: { type: [String], required: true },
  numberOfQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  instructions: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], 
    default: 'PENDING' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);

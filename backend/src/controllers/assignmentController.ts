import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import QuestionPaper from '../models/QuestionPaper';
import { generationQueue } from '../queues/generationQueue';

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { dueDate, questionTypes, numberOfQuestions, totalMarks, instructions } = req.body;

    // Validate inputs
    if (!dueDate || !questionTypes || !numberOfQuestions || !totalMarks) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (numberOfQuestions <= 0 || totalMarks <= 0) {
      return res.status(400).json({ error: 'Values must be positive' });
    }

    // Save assignment
    const assignment = new Assignment({
      dueDate,
      questionTypes,
      numberOfQuestions,
      totalMarks,
      instructions,
      status: 'PENDING'
    });

    await assignment.save();

    // Add job to queue
    await generationQueue.add('generatePaper', { assignmentId: assignment._id });

    return res.status(201).json({ 
      message: 'Assignment created and queued for generation', 
      assignmentId: assignment._id 
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listAssignments = async (_req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    return res.status(200).json(assignments);
  } catch (error) {
    console.error('Error listing assignments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Assignment.findByIdAndDelete(id);
    await QuestionPaper.deleteMany({ assignmentId: id });
    return res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const questionPaper = await QuestionPaper.findOne({ assignmentId: id });
    
    return res.status(200).json({
      assignment,
      questionPaper
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

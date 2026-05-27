import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import Assignment from '../models/Assignment';
import QuestionPaper from '../models/QuestionPaper';
import { generateQuestionPaper } from '../services/aiService';
import { io } from '../server';

const connection = new IORedis(process.env.REDIS_URI || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const startWorker = () => {
  const worker = new Worker('generationQueue', async (job) => {
    const { assignmentId } = job.data;
    
    console.log(`Processing job for assignment ${assignmentId}`);
    
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new Error(`Assignment not found: ${assignmentId}`);
    }

    try {
      // Update status to processing
      assignment.status = 'PROCESSING';
      await assignment.save();

      // Emit status update
      io.emit('job_update', { assignmentId, status: 'PROCESSING' });

      // Call AI Service
      const generatedData = await generateQuestionPaper(assignment);

      // Save the generated paper
      const questionPaper = new QuestionPaper({
        assignmentId,
        sections: generatedData.sections,
        totalMarks: assignment.totalMarks
      });
      await questionPaper.save();

      // Update assignment status
      assignment.status = 'COMPLETED';
      await assignment.save();

      // Notify clients
      io.emit('job_complete', { assignmentId, status: 'COMPLETED' });
      
      console.log(`Job completed for assignment ${assignmentId}`);
      
    } catch (error) {
      console.error(`Job failed for assignment ${assignmentId}:`, error);
      assignment.status = 'FAILED';
      await assignment.save();
      io.emit('job_failed', { assignmentId, status: 'FAILED' });
      throw error;
    }
  }, { connection: connection as any });

  worker.on('failed', (job, err) => {
    if (job) {
      console.error(`Job ${job.id} failed with error ${err.message}`);
    }
  });
  
  console.log('BullMQ generation worker started');
};

import { Router } from 'express';
import { createAssignment, getAssignment, listAssignments, deleteAssignment } from '../controllers/assignmentController';

const router = Router();

// GET /api/assignments
// Lists all assignments
router.get('/', listAssignments);

// POST /api/assignments
// Request body contains assignment details
router.post('/', createAssignment);

// GET /api/assignments/:id
// Fetches the generated assignment (question paper)
router.get('/:id', getAssignment);

// DELETE /api/assignments/:id
// Deletes an assignment and its question paper
router.delete('/:id', deleteAssignment);

export default router;

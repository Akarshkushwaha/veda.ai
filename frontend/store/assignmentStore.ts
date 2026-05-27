import { create } from 'zustand';

export interface QuestionTypeRow {
  id: string;
  type: string;
  count: number;
  marks: number;
}

interface AssignmentState {
  dueDate: string;
  questionTypeRows: QuestionTypeRow[];
  instructions: string;
  isSubmitting: boolean;

  setDueDate: (val: string) => void;
  setInstructions: (val: string) => void;
  setSubmitting: (val: boolean) => void;

  addQuestionTypeRow: () => void;
  removeQuestionTypeRow: (id: string) => void;
  updateQuestionTypeRow: (id: string, field: keyof QuestionTypeRow, value: string | number) => void;

  getTotalQuestions: () => number;
  getTotalMarks: () => number;

  reset: () => void;
}

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Answer Questions',
  'True/False',
  'Fill in the Blanks',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'Match the Following',
  'Case Study Questions',
];

let rowIdCounter = 0;
const makeId = () => `row-${++rowIdCounter}`;

const defaultRows: QuestionTypeRow[] = [
  { id: makeId(), type: 'Multiple Choice Questions', count: 4, marks: 1 },
  { id: makeId(), type: 'Short Questions', count: 3, marks: 2 },
];

export { QUESTION_TYPE_OPTIONS };

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  dueDate: '',
  questionTypeRows: [...defaultRows],
  instructions: '',
  isSubmitting: false,

  setDueDate: (val) => set({ dueDate: val }),
  setInstructions: (val) => set({ instructions: val }),
  setSubmitting: (val) => set({ isSubmitting: val }),

  addQuestionTypeRow: () =>
    set((state) => ({
      questionTypeRows: [
        ...state.questionTypeRows,
        { id: makeId(), type: 'Short Questions', count: 5, marks: 2 },
      ],
    })),

  removeQuestionTypeRow: (id) =>
    set((state) => ({
      questionTypeRows: state.questionTypeRows.filter((r) => r.id !== id),
    })),

  updateQuestionTypeRow: (id, field, value) =>
    set((state) => ({
      questionTypeRows: state.questionTypeRows.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    })),

  getTotalQuestions: () => {
    return get().questionTypeRows.reduce((sum, r) => sum + r.count, 0);
  },
  getTotalMarks: () => {
    return get().questionTypeRows.reduce((sum, r) => sum + r.count * r.marks, 0);
  },

  reset: () =>
    set({
      dueDate: '',
      questionTypeRows: [...defaultRows],
      instructions: '',
      isSubmitting: false,
    }),
}));

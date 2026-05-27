'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  ChevronDown,
  X,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  Mic,
} from 'lucide-react';
import { useAssignmentStore, QUESTION_TYPE_OPTIONS } from '../../store/assignmentStore';
import styles from './page.module.css';

export default function CreateAssignment() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    dueDate,
    questionTypeRows,
    instructions,
    isSubmitting,
    setDueDate,
    setInstructions,
    setSubmitting,
    addQuestionTypeRow,
    removeQuestionTypeRow,
    updateQuestionTypeRow,
    getTotalQuestions,
    getTotalMarks,
  } = useAssignmentStore();

  const [uploading, setUploading] = React.useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setInstructions(instructions ? `${instructions}\n\n[Extracted from ${file.name}]:\n${data.text}` : `[Extracted from ${file.name}]:\n${data.text}`);
        alert('File content extracted and added to Additional Information!');
      } else {
        alert(data.error || 'Failed to upload file');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file. Make sure backend is running.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (questionTypeRows.length === 0) {
      alert('Please add at least one question type.');
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dueDate,
          questionTypes: questionTypeRows.map((r) => r.type),
          numberOfQuestions: getTotalQuestions(),
          totalMarks: getTotalMarks(),
          instructions,
          questionTypeRows,
        }),
      });

      const data = await res.json();
      if (res.ok && data.assignmentId) {
        router.push(`/generating?id=${data.assignmentId}`);
      } else {
        alert(data.error || 'Failed to create assignment');
        setSubmitting(false);
      }
    } catch {
      alert('An error occurred. Please make sure the backend is running.');
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderTop}>
          <div className={styles.statusDot}></div>
          <h1 className={styles.pageTitle}>Create Assignment</h1>
        </div>
        <p className={styles.pageSubtitle}>Set up a new assignment for your students</p>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={`${styles.progressSegment} ${styles.active}`}></div>
        <div className={styles.progressSegment}></div>
      </div>

      {/* Form Card */}
      <div className={styles.formCard}>
        <h2 className={styles.sectionTitle}>Assignment Details</h2>
        <p className={styles.sectionSubtitle}>Basic information about your assignment</p>

        {/* Upload Zone */}
        <div className={styles.uploadZone} onClick={() => !uploading && fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} hidden accept=".pdf,.txt,text/plain,application/pdf" onChange={handleFileUpload} />
          <div className={styles.uploadIcon}>
            <Upload size={28} />
          </div>
          <p className={styles.uploadText}>
            {uploading ? 'Extracting text...' : 'Choose a file or drag & drop it here'}
          </p>
          <p className={styles.uploadHint}>PDF, TXT up to 10MB</p>
          <button className={styles.browseBtn} type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} disabled={uploading}>
            {uploading ? 'Extracting...' : 'Browse Files'}
          </button>
        </div>
        <p className={styles.uploadCaption}>Upload your preferred document (PDF or Text) for reference</p>

        {/* Due Date */}
        <label className={styles.fieldLabel}>Due Date</label>
        <input
          type="date"
          className={styles.dateInput}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="DD-MM-YYYY"
        />

        {/* Question Type Table */}
        <div className={styles.qtHeader}>
          <span className={styles.qtHeaderLabel}>Question Type</span>
          <span className={styles.qtHeaderSub}>No. of Questions</span>
          <span className={styles.qtHeaderSub}>Marks</span>
          <span style={{ width: 28 }}></span>
        </div>

        {questionTypeRows.map((row) => (
          <div key={row.id} className={styles.qtRow}>
            <div className={styles.qtSelectWrapper}>
              <select
                className={styles.qtSelect}
                value={row.type}
                onChange={(e) => updateQuestionTypeRow(row.id, 'type', e.target.value)}
              >
                {QUESTION_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className={styles.qtSelectChevron}>
                <ChevronDown size={16} />
              </span>
            </div>

            {/* Count Stepper */}
            <div className={styles.stepper}>
              <button
                className={styles.stepperBtn}
                type="button"
                onClick={() => updateQuestionTypeRow(row.id, 'count', Math.max(1, row.count - 1))}
              >
                <Minus size={14} />
              </button>
              <div className={styles.stepperValue}>{row.count}</div>
              <button
                className={styles.stepperBtn}
                type="button"
                onClick={() => updateQuestionTypeRow(row.id, 'count', row.count + 1)}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Marks Stepper */}
            <div className={styles.stepper}>
              <button
                className={styles.stepperBtn}
                type="button"
                onClick={() => updateQuestionTypeRow(row.id, 'marks', Math.max(1, row.marks - 1))}
              >
                <Minus size={14} />
              </button>
              <div className={styles.stepperValue}>{row.marks}</div>
              <button
                className={styles.stepperBtn}
                type="button"
                onClick={() => updateQuestionTypeRow(row.id, 'marks', row.marks + 1)}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              className={styles.qtRemoveBtn}
              type="button"
              onClick={() => removeQuestionTypeRow(row.id)}
            >
              <X size={16} />
            </button>
          </div>
        ))}

        <button className={styles.addTypeBtn} type="button" onClick={addQuestionTypeRow}>
          <span className={styles.addTypeIcon}>
            <Plus size={14} />
          </span>
          Add Question Type
        </button>

        {/* Totals */}
        <div className={styles.totals}>
          <div>Total Questions : <span>{getTotalQuestions()}</span></div>
          <div>Total Marks : <span>{getTotalMarks()}</span></div>
        </div>

        {/* Additional Information */}
        <div className={styles.additionalSection}>
          <label className={styles.fieldLabel}>Additional Information (For better output)</label>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
            <span className={styles.micIcon}>
              <Mic size={18} />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={styles.bottomBar}>
        <button className={styles.prevBtn} type="button" onClick={() => router.back()}>
          <ArrowLeft size={16} />
          Previous
        </button>
        <button
          className={styles.nextBtn}
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Next'}
          <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}

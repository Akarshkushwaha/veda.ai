'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Download } from 'lucide-react';
import styles from './page.module.css';

interface Question {
  questionText: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
  answer?: string;
  _id?: string;
}

interface Section {
  title: string;
  sectionLabel?: string;
  instruction: string;
  questions: Question[];
  _id?: string;
}

interface QuestionPaper {
  sections: Section[];
  totalMarks: number;
  schoolName?: string;
  subject?: string;
  className?: string;
  timeAllowed?: string;
}

export default function AssessmentView() {
  const params = useParams();
  const [data, setData] = useState<{ assignment: any; questionPaper: QuestionPaper } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/assignments/${params.id}`);
        const result = await res.json();
        if (res.ok) {
          setData(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return <div className={styles.loading}>Loading assessment...</div>;
  }

  if (!data || !data.questionPaper) {
    return <div className={styles.loading}>Assessment not found or still processing.</div>;
  }

  const qp = data.questionPaper;
  const schoolName = qp.schoolName || 'Delhi Public School, Sector-4, Bokaro';
  const subject = qp.subject || 'English';
  const className = qp.className || '5th';
  const timeAllowed = qp.timeAllowed || '45 minutes';

  // Flatten all questions for numbering
  let globalQNum = 0;

  return (
    <>
      {/* Dark Banner */}
      <div className={styles.banner}>
        <p className={styles.bannerText}>
          Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
        </p>
        <button className={styles.downloadBtn} onClick={handleDownload}>
          <Download size={16} />
          Download as PDF
        </button>
      </div>

      {/* Question Paper */}
      <div className={styles.paper}>
        <div className={styles.paperHeader}>
          <h1 className={styles.schoolName}>{schoolName}</h1>
          <p className={styles.subject}>Subject: {subject}</p>
          <p className={styles.className}>Class: {className}</p>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>Time Allowed: {timeAllowed}</span>
          <span className={styles.metaItem}>Maximum Marks: {qp.totalMarks}</span>
        </div>

        <p className={styles.generalInstruction}>All questions are compulsory unless stated otherwise.</p>

        <div className={styles.studentInfo}>
          <div className={styles.studentLine}>
            Name: <span className={styles.underline}>&nbsp;</span>
          </div>
          <div className={styles.studentLine}>
            Roll Number: <span className={styles.underline}>&nbsp;</span>
          </div>
          <div className={styles.studentLine}>
            Class: {className} Section: <span className={styles.underline}>&nbsp;</span>
          </div>
        </div>

        {qp.sections.map((section, sIdx) => (
          <div key={section._id || sIdx}>
            <h2 className={styles.sectionHeader}>
              {section.sectionLabel || `Section ${String.fromCharCode(65 + sIdx)}`}
            </h2>
            <h3 className={styles.sectionType}>{section.title}</h3>
            <p className={styles.sectionInstruction}>{section.instruction}</p>

            <div className={styles.questionList}>
              {section.questions.map((q, qIdx) => {
                globalQNum++;
                return (
                  <div key={q._id || qIdx} className={styles.questionItem}>
                    <span className={styles.questionNumber}>{globalQNum}.</span>
                    <span className={styles.questionText}>
                      [{q.difficulty}] {q.questionText} [{q.marks} Marks]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <p className={styles.endMarker}>End of Question Paper</p>

        {/* Answer Key */}
        <div className={styles.answerKeySection}>
          <h2 className={styles.answerKeyTitle}>Answer Key:</h2>
          {(() => {
            let ansNum = 0;
            return qp.sections.map((section, sIdx) =>
              section.questions.map((q, qIdx) => {
                ansNum++;
                if (!q.answer) return null;
                return (
                  <div key={`ans-${sIdx}-${qIdx}`} className={styles.answerItem}>
                    <span className={styles.answerNumber}>{ansNum}.</span>
                    <span className={styles.answerText}>{q.answer}</span>
                  </div>
                );
              })
            );
          })()}
        </div>
      </div>
    </>
  );
}

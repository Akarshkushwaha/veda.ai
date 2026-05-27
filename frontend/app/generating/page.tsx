'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';
import styles from './page.module.css';

function GeneratingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('id');
  const [status, setStatus] = useState('Initializing AI Job...');

  useEffect(() => {
    if (!assignmentId) {
      router.push('/');
      return;
    }

    const socket = io('http://localhost:5000');

    socket.on('job_update', (data) => {
      if (data.assignmentId === assignmentId) {
        setStatus('AI is structuring your question paper...');
      }
    });

    socket.on('job_complete', (data) => {
      if (data.assignmentId === assignmentId) {
        setStatus('Completed! Redirecting...');
        setTimeout(() => {
          router.push(`/assessment/${assignmentId}`);
        }, 1000);
      }
    });

    socket.on('job_failed', (data) => {
      if (data.assignmentId === assignmentId) {
        setStatus('Job failed. Please try again.');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [assignmentId, router]);

  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <h1 className={styles.title}>Generating Assessment</h1>
      <p className={styles.message}>{status}</p>
    </div>
  );
}

export default function Generating() {
  return (
    <React.Suspense fallback={<div className={styles.container}>Loading...</div>}>
      <GeneratingContent />
    </React.Suspense>
  );
}

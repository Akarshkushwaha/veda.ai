'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import styles from '../layout.module.css';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getHeaderTitle = () => {
    if (pathname.startsWith('/assessment')) return 'Create New';
    if (pathname.startsWith('/create') || pathname.startsWith('/generating')) return 'Assignment';
    return 'Assignment';
  };

  return (
    <div className={styles.layoutWrapper}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header title={getHeaderTitle()} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

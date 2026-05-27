'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, ChevronDown, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Assignment' }: HeaderProps) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbIcon}>
            <LayoutGrid size={16} />
          </span>
          {title}
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.notifBtn}>
          <Bell size={20} />
          <span className={styles.notifDot}></span>
        </button>
        <div className={styles.profile}>
          <div className={styles.profileAvatar}>
            <Image src="/avatar.png" alt="Profile" width={32} height={32} style={{ objectFit: 'cover' }} />
          </div>
          <span className={styles.profileName}>John Doe</span>
          <span className={styles.chevron}>
            <ChevronDown size={16} />
          </span>
        </div>
      </div>
    </header>
  );
}

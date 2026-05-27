'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutGrid,
  Users,
  FileText,
  Monitor,
  PieChart,
  Settings,
  Sparkles,
} from 'lucide-react';
import styles from './Sidebar.module.css';
import Image from 'next/image';

const navItems = [
  { label: 'Home', icon: LayoutGrid, href: '/home' },
  { label: 'My Groups', icon: Users, href: '/groups' },
  { label: 'Assignments', icon: FileText, href: '/' },
  { label: "AI Teacher's Toolkit", icon: Monitor, href: '/toolkit' },
  { label: 'My Library', icon: PieChart, href: '/library' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname.startsWith('/create') || pathname.startsWith('/generating');
    }
    if (href === '/toolkit') {
      return pathname === '/toolkit' || pathname.startsWith('/assessment');
    }
    return pathname === href;
  };

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="VedaAI Logo" width={36} height={36} className={styles.logoIcon} />
          <span className={styles.logoText}>VedaAI</span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.label} href={item.href}>
              <div className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}>
                <span className={styles.navIcon}>
                  <Icon size={18} />
                </span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={styles.bottomSection}>
        <div className={styles.settingsItem}>
          <span className={styles.navIcon}>
            <Settings size={18} />
          </span>
          Settings
        </div>

        <div className={styles.profileCard}>
          <div className={styles.profileAvatar}>
            <Image src="/avatar.svg" alt="Profile" width={40} height={40} style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Delhi Public School</span>
            <span className={styles.profileSub}>Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

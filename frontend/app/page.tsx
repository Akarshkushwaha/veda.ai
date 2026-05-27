'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter, MoreVertical, Plus } from 'lucide-react';
import styles from './page.module.css';

interface AssignmentItem {
  _id: string;
  title?: string;
  instructions?: string;
  createdAt: string;
  dueDate: string;
  status: string;
}

export default function Home() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/assignments`);
        if (res.ok) {
          const data = await res.json();
          setAssignments(Array.isArray(data) ? data : []);
        }
      } catch {
        // Backend may be down - show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/assignments/${id}`, { method: 'DELETE' });
      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch {
      // ignore
    }
    setMenuOpen(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  };

  const filteredAssignments = assignments.filter((a) => {
    const title = a.title || a.instructions || 'Quiz on Electricity';
    return title.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>;
  }

  // Empty state
  if (assignments.length === 0) {
    return (
      <div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}>
            <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="110" cy="110" r="110" fill="#f1f5f9"/>
              <rect x="60" y="40" width="80" height="100" rx="8" fill="white" />
              <rect x="75" y="60" width="50" height="8" rx="4" fill="#1e293b" />
              <rect x="75" y="80" width="40" height="8" rx="4" fill="#cbd5e1" />
              <rect x="75" y="100" width="50" height="8" rx="4" fill="#cbd5e1" />
              <rect x="75" y="120" width="30" height="8" rx="4" fill="#cbd5e1" />
              <path d="M40 80 Q 20 60 40 40 T 60 60" stroke="#1e293b" strokeWidth="4" fill="none" />
              <circle cx="125" cy="125" r="40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="8" />
              <path d="M155 155 L180 180" stroke="#cbd5e1" strokeWidth="16" strokeLinecap="round" />
              <path d="M110 110 L140 140 M140 110 L110 140" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
              <circle cx="170" cy="60" r="5" fill="#94a3b8" />
              <rect x="180" y="55" width="20" height="10" rx="5" fill="#cbd5e1" />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>No assignments yet</h2>
          <p className={styles.emptyText}>
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and let AI
            assist with grading.
          </p>
          <Link href="/create">
            <button className={styles.createFirstBtn}>
              <Plus size={18} />
              Create Your First Assignment
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Filled state
  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderTop}>
          <div className={styles.statusDot}></div>
          <h1 className={styles.pageTitle}>Assignments</h1>
        </div>
        <p className={styles.pageSubtitle}>Manage and create assignments for your classes.</p>
      </div>

      <div className={styles.toolbar}>
        <button className={styles.filterBtn}>
          <Filter size={16} />
          Filter By
        </button>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>
            <Search size={16} />
          </span>
          <input
            className={styles.searchInput}
            placeholder="Search Assignment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.cardsGrid}>
        {filteredAssignments.map((a) => {
          const title = a.title || a.instructions?.slice(0, 40) || 'Quiz on Electricity';
          return (
            <div key={a._id} className={styles.card}>
              <h3 className={styles.cardTitle}>{title}</h3>

              <button
                className={styles.moreBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(menuOpen === a._id ? null : a._id);
                }}
              >
                <MoreVertical size={18} />
              </button>

              {menuOpen === a._id && (
                <div className={styles.contextMenu}>
                  <div
                    className={styles.contextMenuItem}
                    onClick={() => {
                      setMenuOpen(null);
                      router.push(`/assessment/${a._id}`);
                    }}
                  >
                    View Assignment
                  </div>
                  <div
                    className={styles.contextMenuItemDanger}
                    onClick={() => handleDelete(a._id)}
                  >
                    Delete
                  </div>
                </div>
              )}

              <div className={styles.cardFooter}>
                <span className={styles.cardDate}>
                  <span className={styles.cardDateLabel}>Assigned on</span> : {formatDate(a.createdAt)}
                </span>
                {a.dueDate && (
                  <span className={styles.cardDate}>
                    <span className={styles.cardDateLabel}>Due</span> : {formatDate(a.dueDate)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Link href="/create">
        <button className={styles.floatingCreateBtn}>
          <Plus size={18} />
          Create Assignment
        </button>
      </Link>
    </div>
  );
}

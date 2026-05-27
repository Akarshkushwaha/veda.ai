import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>404 - Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Could not find requested resource</p>
      <Link href="/" style={{ padding: '8px 16px', background: 'var(--bg-dark)', color: 'white', borderRadius: 'var(--radius-full)' }}>
        Return Home
      </Link>
    </div>
  );
}

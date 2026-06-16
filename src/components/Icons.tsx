import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

export const Ic = {
  search: (p: P) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  ),
  heart: (p: P) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M12 20.5S3.5 14.8 3.5 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 1.9c0 5.9-8.5 11.6-8.5 11.6Z" />
    </svg>
  ),
  heartFill: (p: P) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...p}>
      <path d="M12 20.5S3.5 14.8 3.5 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 1.9c0 5.9-8.5 11.6-8.5 11.6Z" />
    </svg>
  ),
  bag: (p: P) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M6 8h12l-.9 11.2a1.6 1.6 0 0 1-1.6 1.5H8.5a1.6 1.6 0 0 1-1.6-1.5L6 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  ),
  user: (p: P) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  ),
  close: (p: P) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ),
  arrow: (p: P) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  ),
  eye: (p: P) => (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  ),
  menu: (p: P) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  phone: (p: P) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M6.5 3.5 9 4l1 4-2 1.5a11 11 0 0 0 5 5L14.5 14l4 1 .5 2.5a2 2 0 0 1-2 2.3A15 15 0 0 1 4 5.5a2 2 0 0 1 2.5-2Z" />
    </svg>
  ),
};

export default Ic;

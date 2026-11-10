/**
 * oicons — extra hand-drawn SVG icons in the lucide stroke style, for the
 * crew lineup and the promise beats. Same grammar as mcptoolkit3/icons3.
 */
import React from "react";
import { C } from "../upgrade/utheme";

type P = { size?: number; color?: string; sw?: number };
const I: React.FC<P & { children: React.ReactNode }> = ({ size = 48, color = C.accent, sw = 1.7, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const ChartIcon: React.FC<P> = (p) => (
  <I {...p}>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M7 15l4-6 4 3 5-8" />
  </I>
);

export const EyeIcon: React.FC<P> = (p) => (
  <I {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </I>
);

export const CompassIcon: React.FC<P> = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36Z" />
  </I>
);

export const ScaleIcon: React.FC<P> = (p) => (
  <I {...p}>
    <path d="M12 3v18" />
    <path d="M4 21h16" />
    <path d="m5 7 3-2 3 2" />
    <path d="m13 7 3-2 3 2" />
    <path d="M5 7l-2.5 6a3.5 3.5 0 0 0 7 0L7 7" />
    <path d="M13 7l-2.5 6a3.5 3.5 0 0 0 7 0L15 7" />
    <path d="M7 5h10" />
  </I>
);

export const SealIcon: React.FC<P> = (p) => (
  <I {...p}>
    <circle cx="12" cy="11" r="7" />
    <path d="M8.5 4.5 9 8" />
    <path d="M15.5 4.5 15 8" />
    <path d="M9 17.5 7.5 22l4.5-2.5L16.5 22 15 17.5" />
    <path d="M9 11h6" />
    <path d="M12 8v6" />
  </I>
);

export const PersonIcon: React.FC<P> = (p) => (
  <I {...p}>
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
  </I>
);

export const DocIcon: React.FC<P> = (p) => (
  <I {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h8" />
    <path d="M8 9h3" />
  </I>
);

export const SparkIcon: React.FC<P> = (p) => (
  <I {...p}>
    <path d="M12 2v6" />
    <path d="M12 16v6" />
    <path d="M2 12h6" />
    <path d="M16 12h6" />
    <path d="m4.9 4.9 4.2 4.2" />
    <path d="m14.9 14.9 4.2 4.2" />
    <path d="m4.9 19.1 4.2-4.2" />
    <path d="m14.9 9.1 4.2-4.2" />
  </I>
);

/**
 * aicons — extra hand-drawn SVG icons for the agentic-api film, same lucide
 * stroke style as mcptoolkit3/icons3 (2.5 px strokes on a 24 viewBox).
 */
import React from "react";
import { C } from "../upgrade/utheme";

type P = { size?: number; color?: string; sw?: number };
const I: React.FC<P & { children: React.ReactNode }> = ({ size = 48, color = C.accent, sw = 1.7, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const DoorIcon: React.FC<P> = (p) => (
  <I {...p}>
    <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
    <path d="M2 21h20" />
    <path d="M9 12h.01" />
  </I>
);

export const CoinIcon: React.FC<P> = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.8 9.2c-.6-1.3-4.2-1.8-4.2.4 0 2 5 1.6 5 4.2 0 2.2-4.2 1.8-4.9.2" />
    <path d="M12 6.5v1.4" />
    <path d="M12 16.1v1.4" />
  </I>
);

export const CalcIcon: React.FC<P> = (p) => (
  <I {...p}>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M8 6h8" />
    <path d="M8 11h.01M12 11h.01M16 11h.01" />
    <path d="M8 15h.01M12 15h.01M16 15h.01" />
    <path d="M8 19h.01M12 19h.01M16 19h.01" />
  </I>
);

export const ReceiptIcon: React.FC<P> = (p) => (
  <I {...p}>
    <path d="M4 3v18l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V3l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
    <path d="M8 8h8" />
    <path d="M8 12h8" />
    <path d="M8 16h5" />
  </I>
);

export const TurnstileIcon: React.FC<P> = (p) => (
  <I {...p}>
    <path d="M12 4v16" />
    <path d="M12 8l7 4" />
    <path d="M12 8l-7 4" />
    <path d="M12 8V4" />
    <path d="M5 21h14" />
  </I>
);

export const ThreadIcon: React.FC<P> = (p) => (
  <I {...p}>
    <circle cx="5" cy="12" r="2.5" />
    <circle cx="12" cy="6" r="2.5" />
    <circle cx="19" cy="14" r="2.5" />
    <path d="M7 10.5 10 7.5" />
    <path d="M14 7.5 17 12" />
  </I>
);

export const PersonIcon: React.FC<P> = (p) => (
  <I {...p}>
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21v-1a8 7 0 0 1 16 0v1" />
  </I>
);

export const CodeIcon: React.FC<P> = (p) => (
  <I {...p}>
    <path d="M8 6 2 12l6 6" />
    <path d="m16 6 6 6-6 6" />
  </I>
);

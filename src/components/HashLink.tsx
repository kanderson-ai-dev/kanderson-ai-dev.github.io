// A router <Link> for hash targets — prevents the browser's native anchor
// jump from racing React's scroll path (Part C). When the link points at the
// hash already in the URL, the router produces no location change and
// ScrollManager never re-runs, so the scroll happens here instead
// (same-page repeated clicks).
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { scrollToId } from '../hooks/useHashScroll';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string; // '#id' on this page, or '/es#id' / '/#id' across routes
  children: ReactNode;
  onNavigate?: () => void;
};

export const HashLink = ({ to, children, onNavigate, onClick, ...rest }: Props) => {
  const { pathname, hash } = useLocation();
  return (
    <Link
      to={to}
      {...rest}
      onClick={(e) => {
        const [path, id] = to.split('#');
        const samePage = (!path || path === pathname) && !!id;
        if (samePage && hash === `#${id}` && document.getElementById(id)) {
          e.preventDefault();
          scrollToId(id);
        }
        onNavigate?.();
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
};

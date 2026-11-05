'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Logo } from '@kishanscaler/ssx-ui';
import { X } from '@phosphor-icons/react';

import './apply-modal.css';

/** The CTAs that open it: any link or button reading "Apply", "Apply now", "Start application" or
 *  "Start your application" (the minimal page's top bar and sign-up card). */
const APPLY_CTA = /^\s*(apply now\b|apply\s*$|start (your )?application\b)/i;

/**
 * The live site's apply step as a full-page modal (the final page, 2026-10-28, the user's ask: "as on
 * scaler.com/school-of-business"), for visualisation only: the bar with the logo and a close, the
 * cohort's photo under a green wash at the left (Cohort 2026, the programme, "Admission Portal"), and
 * the sign-in form at the right. The form is a mock: its fields take typing but nothing is sent, and
 * "Get OTP" stays disabled. Any Apply now on the page opens it; the close, Esc or the browser's back
 * (no) closes it. Phones: the photo a short band over the form.
 */
export function ApplyModal() {
  const [open, setOpen] = React.useState(false);
  const [wa, setWa] = React.useState(true);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const back = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>('a, button');
      if (!el || el.closest('.am') || el.hasAttribute('data-no-modal') || !APPLY_CTA.test(el.textContent ?? '')) return;
      e.preventDefault();
      back.current = el;
      setOpen(true);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return setOpen(false);
      // keep Tab inside the dialog (it is modal)
      if (e.key !== 'Tab') return;
      const box = document.querySelector<HTMLElement>('.am');
      const all = box ? [...box.querySelectorAll<HTMLElement>('button:not([disabled]), input, a[href]')] : [];
      if (!all.length) return;
      const first = all[0];
      const last = all[all.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      back.current?.focus();
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div className="am" role="dialog" aria-modal="true" aria-labelledby="am-title" data-brand="ssb" data-theme="light">
      <header className="am-bar">
        <Logo brand="ssb" size="md" decorative />
        <button ref={closeRef} type="button" className="am-close" aria-label="Close" onClick={() => setOpen(false)}>
          <X weight="regular" aria-hidden="true" />
        </button>
      </header>
      <div className="am-body">
        <aside className="am-photo">
          {/* eslint-disable-next-line @next/next/no-img-element -- fills its box */}
          <img src="/media/cohort-group.webp" alt="" decoding="async" />
          <div className="am-photo-copy">
            <p className="am-k">Cohort 2026</p>
            <p className="am-prog">PGP in Management &amp; Tech</p>
            <p className="am-portal">Admission Portal</p>
          </div>
        </aside>
        <form className="am-form" onSubmit={(e) => e.preventDefault()} noValidate>
          <h2 id="am-title" className="am-title">
            Login or Create an account
          </h2>
          <p className="am-sub">Enter your details to proceed</p>
          <input className="am-input" type="email" placeholder="Enter Email Address" aria-label="Email address" autoComplete="off" />
          <div className="am-phone">
            <span className="am-cc">+91</span>
            <input className="am-input" type="tel" placeholder="Enter Mobile Number" aria-label="Mobile number" autoComplete="off" />
          </div>
          <label className="am-wa">
            <span>Connect on WhatsApp</span>
            <button type="button" role="switch" aria-checked={wa} className="am-switch" onClick={() => setWa((v) => !v)}>
              <span />
            </button>
          </label>
          <p className="am-note">By confirming I wish to receive updates and confirmation via WhatsApp</p>
          <div className="am-foot">
            <button type="submit" className="am-otp" disabled>
              Get OTP
            </button>
            <p className="am-terms">
              By creating an account I have read and agree to <span>Scaler&rsquo;s Terms</span> and <span>Privacy Policy</span>
            </p>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

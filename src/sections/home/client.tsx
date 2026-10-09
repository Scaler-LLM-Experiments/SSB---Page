'use client';
/**
 * The browser-side pieces of the home page: the SSB navbar, the curriculum (it reads
 * the browser as it starts, so it renders there only) and the SSB footer the page lifts off.
 */
import * as React from 'react';
import dynamic from 'next/dynamic';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SsbFooter } from '@/sections/site/Footer';
import { SsbNavbar } from '@/sections/site/Navbar';

export const Curriculum = dynamic(() => import('@/sections/curriculum/SsbCurriculum'), { ssr: false });

export function FooterShell({ children }: { children: React.ReactNode }) {
  // no "Your next step" banner above the footer: the footer has the same two actions
  return (
    <SsbFooter showCta={false} variant="green">
      {children}
    </SsbFooter>
  );
}

/**
 * Keeps the sections' scroll entrances honest. Each one is measured once, when the page
 * first lays out; the curriculum arrives after that (it renders in the browser only) and
 * pushes everything under it down by thousands of pixels, so those entrances would play at
 * their old positions, off screen, long before the visitor lands on the section. Whenever
 * the page's height changes, the positions are measured again.
 */
export function ScrollRefresh() {
  React.useEffect(() => {
    let last = document.documentElement.scrollHeight;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = document.documentElement.scrollHeight;
        if (h === last) return;
        last = h;
        ScrollTrigger.refresh();
      });
    });
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return null;
}

/** The SSB navbar as the home page's nav: dark over the hero, turned light by the hero's motion. */
export function HomeNav() {
  return <SsbNavbar heroNav themeToggle={false} />;
}

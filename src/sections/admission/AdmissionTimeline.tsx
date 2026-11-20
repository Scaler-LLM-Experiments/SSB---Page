'use client';

import * as React from 'react';
import { Button, Container, Logo, Section } from '@kishanscaler/ssx-ui';
import { CalendarDots, CheckCircle, User, VideoCamera } from '@phosphor-icons/react/ssr';

import type { AdmissionStepContent } from '@/content/admission';
import { Header } from '@/sections/deck/DeckSections';
import { CtaIcon } from '@/sections/hero/CtaIcon';
import '@/sections/admissions/admissions-v4.css';
import '@/sections/curriculum/curriculum-rail.css';
import { ADMISSION_ICONS } from './icons';
import './admission.css';

/**
 * The admission steps as one timeline (2026-11-11, after SST's admission page, the user's pick: "easy
 * to follow through"). At the left, held in view: the page's section header and the steps as the
 * home page's rail items (`cr-item`, the step on screen marked; a click scrolls to it). At the right,
 * one column: a line down the steps' numbers that fills in the brand green as the page scrolls (a
 * transform, so nothing reflows), each step its number, name, one line and one card (`ad4-card`).
 * Inside every card the same order (2026-11-11, the user's ask): title, points, then a box if needed,
 * then the action. Step 1's card: its three groups side by side, each under its icon, a rule between
 * them. Steps 2 to 4: an illustration beside the card, drawn in CSS on the home page's AI product
 * panel (`dk-product-art`): the application with its video essay, the interview invite, the SSB student
 * ID on its lanyard. Each title carries its step's timing in the brand green. Phones: one column, the
 * header above, no side list, the illustration over the copy.
 */
export function AdmissionTimeline({
  head,
  steps,
}: {
  head: { eyebrow?: string; title: string; sub?: string };
  steps: AdmissionStepContent[];
}) {
  const list = React.useRef<HTMLOListElement>(null);
  const fill = React.useRef<HTMLSpanElement>(null);
  const [active, setActive] = React.useState(0);

  // the step on screen: the last whose top has passed 45% of the window; the line fills to that point
  React.useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const ol = list.current;
      if (!ol) return;
      const at = window.innerHeight * 0.45;
      let now = 0;
      ol.querySelectorAll<HTMLElement>(':scope > li').forEach((el, i) => {
        if (el.getBoundingClientRect().top <= at) now = i;
      });
      setActive(now);
      const track = ol.parentElement?.querySelector<HTMLElement>('.adm-tl-track');
      if (track && fill.current) {
        const r = track.getBoundingClientRect();
        const p = r.height ? Math.min(1, Math.max(0, (at - r.top) / r.height)) : 0;
        fill.current.style.transform = `scaleY(${p})`;
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  const go = (id: string) => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <Section id="adm-steps" density="roomy" aria-labelledby="adm-steps-title" className="adm-steps">
      <Container>
        <div className="adm-tl-grid">
          <div className="adm-tl-aside">
            <Header id="adm-steps" eyebrow={head.eyebrow} title={head.title} sub={head.sub} />
            <ul className="adm-index" aria-label="Steps">
              {steps.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="cr-item"
                    data-pillar=""
                    aria-current={i === active ? 'true' : undefined}
                    onClick={() => go(s.id)}
                  >
                    <span className="cr-num" aria-hidden="true">
                      {s.num}
                    </span>
                    <span className="cr-text">
                      <span className="cr-label">{s.label}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="adm-tl">
            <span className="adm-tl-track" aria-hidden="true">
              <span ref={fill} className="adm-tl-fill" />
            </span>
            <ol ref={list} className="adm-tl-list">
              {steps.map((s, i) => (
                <li
                  key={s.id}
                  id={s.id}
                  className="adm-tl-step"
                  data-state={i < active ? 'done' : i === active ? 'current' : 'next'}
                >
                  <span className="adm-tl-marker" aria-hidden="true">
                    {s.num}
                  </span>
                  <div className="adm-tl-body">
                    <h3 className="adm-tl-title">
                      <span className="sr-only">Step {s.num}: </span>
                      <StepTitle text={s.title} />
                    </h3>
                    <p className="adm-tl-lede">{s.lede}</p>
                    <StepCard step={s} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** "Lead|tail": the tail (the step's timing) in the brand green. */
function StepTitle({ text }: { text: string }) {
  const i = text.indexOf('|');
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i).trim()} <span className="adm-tl-accent">{text.slice(i + 1).trim()}</span>
    </>
  );
}

function StepCard({ step }: { step: AdmissionStepContent }) {
  return (
    <article className="ad4-card adm-card" data-art={step.art ? '' : undefined}>
      {step.art ? <StepArt art={step.art} /> : null}
      <div className="adm-card-body">
        <div className="adm-groups" data-count={step.groups.length}>
          {step.groups.map((g) => {
            const Icon = g.icon ? ADMISSION_ICONS[g.icon] : null;
            return (
              <div key={g.title} className="adm-group">
                {Icon ? (
                  <span className="adm-group-icon" aria-hidden="true">
                    <Icon weight="duotone" />
                  </span>
                ) : null}
                <h4 className="adm-card-title">{g.title}</h4>
                <ul className="adm-points">
                  {g.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        {step.note ? <p className="adm-note">{step.note}</p> : null}
        {step.cta ? (
          <div className="adm-cta-row">
            <Button asChild size="md" variant="primary">
              <a href={step.cta.href}>
                {step.cta.label}
                <CtaIcon icon="arrow" />
              </a>
            </Button>
            {step.cta.aside ? (
              <p className="adm-cta-aside">
                {step.cta.aside.label} <b>{step.cta.aside.date}</b>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

/** The card's head: the SSB logo on the deep green, and what the card is. */
function ObjHead({ tag }: { tag?: string }) {
  return (
    <span className="adm-obj-head">
      <Logo brand="ssb" size="sm" tone="mono" surface="dark" />
      {tag ? <span className="adm-obj-tag">{tag}</span> : null}
    </span>
  );
}

/** The step's illustration on the home page's AI product panel (deck.css `dk-product-art`), each a
 *  small white card of the school's, slightly turned: the application, the interview invite, the ID. */
function StepArt({ art }: { art: NonNullable<AdmissionStepContent['art']> }) {
  return (
    <div className="dk-product-art adm-art" data-kind={art} aria-hidden="true">
      {art === 'application' ? (
        <span className="adm-obj adm-app">
          <ObjHead tag="Application" />
          <span className="adm-obj-rows">
            <span className="adm-obj-row" data-done="">
              <CheckCircle weight="fill" />
              Profile
            </span>
            <span className="adm-obj-row" data-done="">
              <CheckCircle weight="fill" />
              Application fee
            </span>
            <span className="adm-obj-row adm-obj-rec">
              <VideoCamera weight="duotone" />
              Video essay
              <span className="adm-rec">REC</span>
            </span>
          </span>
          <span className="adm-obj-btn">Submit</span>
        </span>
      ) : art === 'interview' ? (
        <span className="adm-obj adm-invite">
          <ObjHead tag="Interview" />
          <span className="adm-obj-body">
            <span className="adm-obj-tile">
              <CalendarDots weight="duotone" />
            </span>
            <span className="adm-obj-lines">
              <b>Industry leaders round</b>
              <span>With a case study</span>
            </span>
          </span>
          <span className="adm-obj-foot">
            <span className="adm-obj-faces">
              <span>
                <User weight="fill" />
              </span>
              <span>
                <User weight="fill" />
              </span>
              <span>
                <User weight="fill" />
              </span>
            </span>
            <span className="adm-obj-btn">Accept</span>
          </span>
        </span>
      ) : (
        <span className="adm-id">
          <span className="adm-id-strap" />
          <span className="adm-obj adm-id-card">
            <ObjHead />
            <span className="adm-obj-body">
              <span className="adm-obj-tile">
                <User weight="duotone" />
              </span>
              <span className="adm-obj-lines">
                <b>Future leader</b>
                <span>PGP student</span>
              </span>
            </span>
            <span className="adm-id-code" />
          </span>
        </span>
      )}
    </div>
  );
}

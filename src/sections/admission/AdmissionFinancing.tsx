import * as React from 'react';
import { Container, Section } from '@kishanscaler/ssx-ui';

import type { admissionFinancing } from '@/content/admission';
import { Header } from '@/sections/deck/DeckSections';
import '@/sections/deck/deck-career.css';
import './admission.css';

/**
 * Financing (2026-11-11, the user's asks: no "if you need a student loan" line; the banks centre
 * stage; text at the left, the logos at the right). The page's section header and the three pointers
 * (the admissions list's green squares) at the left; the four partners' logos large, two by two on the
 * career prep's cards (`dcp-stat`), at the right. Phones: the logos under the text.
 */
export function AdmissionFinancing({ content: c }: { content: typeof admissionFinancing }) {
  return (
    <Section id="financing" density="roomy" aria-labelledby="financing-title" className="adm-fin">
      <Container>
        <div className="adm-fin-grid">
          <div className="adm-fin-copy">
            <Header id="financing" eyebrow={c.eyebrow} title={c.title} />
            <ul className="adm-points adm-fin-points">
              {c.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <ul className="adm-fin-logos" aria-label="Banking partners">
            {c.logos.map((l) => (
              <li key={l.name} className="dcp-stat">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={l.src}
                  alt={l.name}
                  width={l.width}
                  height={l.height}
                  loading="lazy"
                  decoding="async"
                  style={{ '--w': l.width, '--h': l.height } as React.CSSProperties}
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

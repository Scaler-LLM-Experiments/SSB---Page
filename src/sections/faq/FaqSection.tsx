'use client';

import * as React from 'react';
import { Accordion, Container, Heading, Link, Section, Text } from '@kishanscaler/ssx-ui';

import { faqs as defaultFaqs, type Faq } from '@/content/admissions';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';

/** `faqs` replaces the questions (the deck variant, /v7, adds the Outcomes Report). A link is set inside
 *  its answer where the answer names it, otherwise as "See the … section above." */
export function FaqSection({ faqs = defaultFaqs }: { faqs?: Faq[] } = {}) {
  const sectionRef = React.useRef<HTMLElement>(null);
  // Same header entrance as Faculty; the questions fade up as a block.
  useSectionEntrance(sectionRef, { decks: [] });

  return (
    <Section ref={sectionRef} density="roomy" aria-labelledby="faq-title">
      <Container>
        <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <div data-enter="header" className="flex flex-col gap-3 self-start md:sticky md:top-24">
            <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
              FAQ
            </Heading>
            <Heading as="h2" size="display" id="faq-title" data-enter="headline">
              Questions, answered. <span className="h-tail">For candidates and parents.</span>
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              What applicants ask most, answered.
            </Text>
          </div>

          <div data-enter="block" className="min-w-0">
            <Accordion
              type="single"
              collapsible
              defaultValue="faq-0"
              items={faqs.map((f, i) => ({
                value: `faq-${i}`,
                title: f.question,
                content: (
                  <Text tone="secondary">
                    {f.link && f.answer.includes(f.link.label) ? (
                      <>
                        {f.answer.slice(0, f.answer.indexOf(f.link.label))}
                        <Link href={f.link.href}>{f.link.label}</Link>
                        {f.answer.slice(f.answer.indexOf(f.link.label) + f.link.label.length)}
                      </>
                    ) : f.link ? (
                      <>
                        See the <Link href={f.link.href}>{f.link.label}</Link> section above.
                      </>
                    ) : (
                      f.answer
                    )}
                  </Text>
                ),
              }))}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

'use client';

import * as React from 'react';
import { Accordion, Container, Heading, Link, Section, Text } from '@kishanscaler/ssx-ui';

import { faqs } from '@/content/admissions';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';

export function FaqSection() {
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
              Frequently Asked Questions
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              Answers to what applicants ask most about the degree, eligibility, the programme and the
              internship.
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
                    {f.link ? (
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

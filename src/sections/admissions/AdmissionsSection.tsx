'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  Section,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@kishanscaler/ssx-ui';

import {
  admissionSteps,
  admissionsCtas,
  eligibility,
  fastTrack,
  feeColumns,
  feeRows,
  scholarships,
} from '@/content/admissions';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import './admissions.css';

/** A plain card: its title, then its content (the fee table). */
function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card as="li" className="adm-card">
      <CardBody className="gap-4 p-5 sm:p-6">
        <div className="flex items-baseline gap-3" data-part="title">
          <Heading as="h3" size="3">
            {title}
          </Heading>
        </div>
        <div data-part="description">{children}</div>
      </CardBody>
    </Card>
  );
}

export function AdmissionsSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  // Same entrance as Faculty: the header, then the four cards wiped open in turn.
  useSectionEntrance(sectionRef, { decks: ['.adm-card'] });

  return (
    <Section ref={sectionRef} id="admissions" density="roomy" aria-labelledby="admissions-title">
      <Container>
        <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          {/* Left: the title and the two CTAs. Stays in view while the steps scroll. */}
          <div data-enter="header" className="flex flex-col gap-3 self-start md:sticky md:top-24">
            <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
              Admissions
            </Heading>
            <Heading as="h2" size="display" id="admissions-title" data-enter="headline">
              Admission Process, Fees and Eligibility
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              Who can apply, how selection works, what the programme costs, and the scholarships on offer.
            </Text>
            {/* Eligibility: a plain card, on the left above the two CTAs (the team's
                ask, 2026-10-07). */}
            <Card as="div" className="mt-5" data-enter="sub">
              <CardBody className="gap-3 p-5 sm:p-6">
                <Heading as="h3" size="3">
                  Eligibility
                </Heading>
                <Text tone="secondary">{eligibility}</Text>
              </CardBody>
            </Card>
            <div data-enter="controls" className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href={admissionsCtas.primary.href}>{admissionsCtas.primary.label}</a>
              </Button>
              <Button asChild variant="secondary">
                <a href={admissionsCtas.secondary.href}>{admissionsCtas.secondary.label}</a>
              </Button>
            </div>
          </div>

          {/* Right: the process, the fees and the scholarships, in the deck's order. */}
          <ol className="flex min-w-0 list-none flex-col gap-4 p-0">
            {/* The process, on the scholarship artwork (the team's layout, 2026-10-07): the drawing
                fills the card, the student at its right; a dark frosted panel at its left carries the
                title, the steps in order and the fast-track route. */}
            <li className="adm-card adm-frame">
              <div className="adm-ground adm-process">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/admissions/scholarships.webp" alt="" width={1671} height={941} loading="lazy" decoding="async" data-part="photo" />
                <div className="adm-process__panel">
                  <Heading as="h3" size="3" data-part="title">
                    Admissions process
                  </Heading>
                  <ol className="adm-process__steps" data-part="description">
                    {admissionSteps.map((step, i) => (
                      <li key={step}>
                        <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div className="adm-process__fast" data-part="description">
                    <span className="adm-glass__label">Fast-track</span>
                    <Text size="sm">{fastTrack}</Text>
                  </div>
                </div>
              </div>
            </li>

            <Step title="Programme fee">
              <div className="adm-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {feeColumns.map((c) => (
                        <TableHead key={c}>{c}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeRows.map((r) => (
                      <TableRow key={r.intake}>
                        <TableCell>{r.intake}</TableCell>
                        <TableCell className="whitespace-nowrap">{r.deadline}</TableCell>
                        <TableCell className="whitespace-nowrap">{r.application}</TableCell>
                        <TableCell className="whitespace-nowrap">{r.course}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Phones: one row per intake, the course fee alongside; the
                  application fee is the same for every intake, so it's said once. */}
              <ul className="adm-intakes">
                {feeRows.map((r) => (
                  <li key={r.intake}>
                    <div>
                      <Text as="span" className="block font-medium">
                        {r.intake}
                      </Text>
                      <Text as="span" size="sm" tone="secondary">
                        Deadline {r.deadline}
                      </Text>
                    </div>
                    <Text as="span" className="font-semibold whitespace-nowrap">
                      {r.course}
                    </Text>
                  </li>
                ))}
              </ul>
              <Text size="sm" tone="secondary" className="adm-intakes-note">
                Application fee: {feeRows[0].application} for every intake.
              </Text>
            </Step>

            {/* Scholarships, in the career prep showcase's form (the team's ask, 2026-10-07): the
                card's edge as the fee card's, the artwork filling it, and on a frosted green bar at
                its foot the figure large ("up to 100%") beside what it is, in white. */}
            <li className="adm-card adm-frame">
              <div className="adm-ground adm-scholar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/admissions/scholarships.webp" alt="" width={1671} height={941} loading="lazy" decoding="async" data-part="photo" />
                <div className="adm-scholar__bar adm-glass">
                  <p className="adm-scholar__figure" data-part="title">
                    <span>Up to</span>100%
                  </p>
                  <div className="adm-scholar__copy" data-part="description">
                    <Heading as="h3" size="3">
                      Scholarships
                    </Heading>
                    <Text size="sm">{scholarships}</Text>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </Container>
    </Section>
  );
}

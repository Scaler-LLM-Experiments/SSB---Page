'use client';

import * as React from 'react';
import {
  Badge,
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

/** One numbered block: "01", its title, then its content. */
function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <Card as="li" className="adm-card">
      <CardBody className="gap-4 p-5 sm:p-6">
        <div className="flex items-baseline gap-3" data-part="title">
          <span className="type-label font-semibold text-content-brand">{n}</span>
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
            <div data-enter="controls" className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href={admissionsCtas.primary.href}>{admissionsCtas.primary.label}</a>
              </Button>
              <Button asChild variant="secondary">
                <a href={admissionsCtas.secondary.href}>{admissionsCtas.secondary.label}</a>
              </Button>
            </div>
          </div>

          {/* Right: the four steps of the deck, in its order. */}
          <ol className="flex min-w-0 list-none flex-col gap-4 p-0">
            <Step n="01" title="Eligibility">
              <Text tone="secondary">{eligibility}</Text>
            </Step>

            <Step n="02" title="Admissions process">
              <ol className="adm-steps">
                {admissionSteps.map((step, i) => (
                  <li key={step}>
                    <span className="adm-steps__n" aria-hidden="true">
                      {i + 1}
                    </span>
                    <Text as="span">{step}</Text>
                  </li>
                ))}
              </ol>
              <div className="adm-fasttrack">
                <Badge tone="brand">Fast-track</Badge>
                <Text size="sm" tone="secondary">
                  {fastTrack}
                </Text>
              </div>
            </Step>

            <Step n="03" title="Programme fee">
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

            <Step n="04" title="Scholarships">
              <Text tone="secondary">{scholarships}</Text>
            </Step>
          </ol>
        </div>
      </Container>
    </Section>
  );
}

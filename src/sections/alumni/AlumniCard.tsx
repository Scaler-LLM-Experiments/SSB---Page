import { BriefcaseIcon, TriangleIcon } from '@phosphor-icons/react';
import { Card, Heading, Text } from '@kishanscaler/ssx-ui';

import type { Alumnus } from '@/content/alumni';

/**
 * Alumni card: photo on the left; on the right the name, then the role now
 * (company mark in a tile), a rising marker, and the role before SSB
 * (briefcase in a tile). data-part marks what the section entrance animates.
 */
export function AlumniCard({ alumnus: a, priority = false }: { alumnus: Alumnus; priority?: boolean }) {
  return (
    <Card as="article" className="alumni-card">
      <div className="alumni-card__photo">
        <img
          src={`/alumni/${a.photo}.webp`}
          alt=""
          width={480}
          height={600}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          data-part="photo"
        />
      </div>
      <div className="alumni-card__body">
        <Heading as="h3" size="3" data-part="title">
          {a.name}
        </Heading>
        <div className="alumni-card__path" data-part="description">
          <div className="alumni-card__step">
            <span className="alumni-card__tile" data-fill={a.company.fill || undefined}>
              <img src={a.company.src} alt="" loading="lazy" />
            </span>
            <Text size="sm">
              {a.role} at {a.company.name}
            </Text>
          </div>
          <span className="alumni-card__rise" aria-hidden="true">
            <TriangleIcon weight="duotone" />
          </span>
          <div className="alumni-card__step">
            <span className="alumni-card__tile" aria-hidden="true">
              <BriefcaseIcon />
            </span>
            <div>
              <Text size="sm" tone="secondary" className="alumni-card__label">
                Pre SSB
              </Text>
              <Text size="sm">{a.before}</Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

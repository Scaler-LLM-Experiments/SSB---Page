import { Button, Card, CardBody, CardMedia, Divider, Heading, Text } from '@kishanscaler/ssx-ui';

import type { LabStartup } from '@/content/innovation-lab';

/**
 * Startup card: banner edge to edge, name, founders, a dashed rule, the
 * description, and Know more pinned to the bottom. Lives in the Innovation Lab row. data-part marks what the section entrance animates.
 */
export function StartupCard({ startup: s }: { startup: LabStartup }) {
  return (
    <Card as="article" className="h-full bg-surface-subtle">
      <CardMedia
        src={`/startups/${s.image}`}
        alt=""
        className="sil-banner"
        style={{ aspectRatio: '1133 / 542' }}
      />
      <CardBody className="sil-card__body flex grow flex-col gap-0 p-4 sm:p-5">
        <Heading as="h4" size="3" className="sil-card__title" data-part="title">
          {s.name}
        </Heading>
        <Text size="sm" tone="secondary" className="sil-card__meta mt-1" data-part="description">
          {s.founders}
        </Text>
        <Divider className="sil-rule my-4" />
        <Text size="sm" tone="secondary" className="sil-card__meta" data-part="description">
          {s.description}
        </Text>
        <div className="mt-auto pt-5" data-part="action">
          <Button asChild variant="secondary" className="w-full border-border-inert">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Know more about ${s.name} (opens in a new tab)`}
            >
              Know more
            </a>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

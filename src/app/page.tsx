import { Container, Heading, Link, Section, Stack, Text } from '@kishanscaler/ssx-ui';

/** Every home page variation, newest first. Each renders the same content from `src/content/home.ts`. */
const variations = [
  {
    href: '/v2',
    name: 'V2: cinematic, black',
    summary:
      'Black page with the video blended into the hero. Scrolling pulls the video to the centre and hardens it into a frame.',
  },
  {
    href: '/v2-stack',
    name: 'V2, terms stacked (experiment)',
    summary: 'The same page, with the curriculum’s term cards stacking as you scroll at every width, as phones show them.',
  },
];

export default function LabIndex() {
  return (
    <main>
      <Section density="roomy">
        <Container width="narrow">
          <Stack gap="8">
            <Stack gap="2">
              <Heading as="h1">SSB home page lab</Heading>
              <Text tone="secondary">Hero variations for review. Check each in light and dark, and on a phone.</Text>
            </Stack>
            <Stack as="ul" gap="6">
              {variations.map((variation) => (
                <Stack as="li" key={variation.href} gap="2">
                  <Link href={variation.href} standalone className="type-h3">
                    {variation.name}
                  </Link>
                  <Text size="sm" tone="secondary">
                    {variation.summary}
                  </Text>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}

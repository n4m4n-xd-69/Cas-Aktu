import { Link } from 'react-router';
import { Container, Heading, Section } from '~/components';

export function ErrorBoundary({ error }: { error: Error }) {
  console.error('Route error:', error);

  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Something went wrong</Heading>
        <p>
          An unexpected error occurred while loading this page. Please try again
          or return to the home page.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: 'var(--space-6)' }}>
            <summary>Error details</summary>
            <pre
              style={{
                padding: 'var(--space-4)',
                background: 'var(--surface-secondary)',
                borderRadius: 'var(--radius-md)',
                overflow: 'auto',
                fontSize: 'var(--text-sm)',
              }}
            >
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
        <p style={{ marginTop: 'var(--space-6)' }}>
          <Link to="/">Return to home page</Link>
        </p>
      </Section>
    </Container>
  );
}

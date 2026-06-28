import { Suspense } from 'react';

import Container from '@/components/layout/Container';

import RegisterPageClient from './RegisterPageClient';

export default function RegisterPage() {
  return (
    <Container>
      <Suspense>
        <RegisterPageClient />
      </Suspense>
    </Container>
  );
}
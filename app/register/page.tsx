import { Suspense } from 'react';

import Container from '@/components/layout/Container';

import { RegisterForm } from './RegisterForm';

export default function RegisterPage() {
  return (
    <Container>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </Container>
  );
}
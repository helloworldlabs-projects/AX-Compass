'use client';

import { useSearchParams } from 'next/navigation';

import { RegisterCompleteView } from './_components/RegisterCompleteView';
import { RegisterForm } from './RegisterForm';

export default function RegisterPageClient() {
  const searchParams = useSearchParams();

  if (searchParams.has('complete')) return <RegisterCompleteView />;
  return <RegisterForm />;
}

import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { currentPrivacy, previousPrivacyVersions } from '@/data/privacy';
import PrivacyPageClient from './PrivacyPageClient';

export default function PrivacyPage() {
  return (
    <Container>
      <div className="max-w-[800px]">
        <div className="flex w-full flex-col gap-6">
          <div className="flex items-start gap-4">
            <Button render={<Link href="/terms" />} variant="gray">이용약관</Button>
            <Button render={<Link href="/privacy" />} variant="dark-blue">개인정보 처리방침</Button>
          </div>
          <div className="h-px w-full bg-gray-100" />
          <PrivacyPageClient
            versions={previousPrivacyVersions}
            currentVersion={currentPrivacy}
          />
        </div>
      </div>
    </Container>
  );
}

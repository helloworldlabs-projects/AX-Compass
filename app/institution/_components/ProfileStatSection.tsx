'use client';

import dynamic from 'next/dynamic';
import Section from '@/components/layout/Section';
import { ProfileTypeStatGuideModal } from '@/components/modals/ProfileTypeStatGuideModal';
import { ProfileResultCard } from '@/components/ui/ProfileResultCard';
import { Button } from '@/components/ui/button';
import { PROFILE_TYPE_LABEL } from '@/constants/profileTypeConfig';
import { ContactRound, HelpCircle, Trophy } from 'lucide-react';
import { useState } from 'react';
import type { InstitutionProfileStats } from '@/types/institution';

const ProfileRadarChart = dynamic(
  () => import('@/components/institution/ProfileRadarChart').then((m) => ({ default: m.ProfileRadarChart })),
);

interface ProfileStatSectionProps {
  profileStats: InstitutionProfileStats;
}

export function ProfileStatSection({ profileStats }: ProfileStatSectionProps) {
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);

  return (
    <Section className="max-w-[700px] shrink-0">
      <ProfileTypeStatGuideModal open={openModal} onClose={() => setOpenModal(false)} />
      <div className="flex w-[700px] items-center justify-between">
        <div className="flex items-center gap-4">
          <ContactRound className="size-10 text-purple-700" />
          <span className="txt-t1">프로필 유형 통계</span>
        </div>
        <HelpCircle
          className="text-special-dark-blue-900 size-9"
          onClick={() => setOpenModal(true)}
        />
      </div>
      <div className="h-[500px] w-[500px]">
        <ProfileRadarChart profileRatios={profileStats.profileRatios} />
      </div>
      <div className="flex items-center justify-center gap-4">
        {profileStats.top3ProfileTypes.map((type, index) => (
          <Button
            key={type}
            className="flex h-fit w-[160px] flex-col gap-2.5 py-5 text-white"
            variant={selectedProfileIndex === index ? 'purple' : 'gray'}
            onClick={() => setSelectedProfileIndex(index)}
          >
            <div className="flex items-center gap-1">
              <Trophy className="size-4.5" />
              <span className="txt-b-bold">{index + 1}순위</span>
            </div>
            <div className="txt-t2">{PROFILE_TYPE_LABEL[type]}</div>
          </Button>
        ))}
      </div>
      {profileStats.top3ProfileTypes.length > 0 && (
        <ProfileResultCard type={profileStats.top3ProfileTypes[selectedProfileIndex]} />
      )}
    </Section>
  );
}

'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PrivacyArticle } from './PrivacyArticle';
import type { PrivacyVersion } from '@/data/privacy/types';

interface Props {
  versions: PrivacyVersion[];
  currentVersion: PrivacyVersion;
}

export default function PrivacyPageClient({ versions, currentVersion }: Props) {
  const [selectedKey, setSelectedKey] = useState<string>(currentVersion.version);

  const displayed = versions.find((v) => v.version === selectedKey) ?? currentVersion;
  const hasSelection = versions.some((v) => v.version === selectedKey);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col">
        <h1 className="txt-t1 text-black">개인정보 처리방침</h1>
      </div>

      <PrivacyArticle privacy={displayed} />

      <div className="flex w-full max-w-[400px] flex-col gap-4">
        <p className="txt-c1-bold text-gray-500">이전 개인정보 처리방침 보기</p>
        <Select
          modal={false}
          value={selectedKey}
          onValueChange={(v) => {
            if (v) setSelectedKey(v);
          }}
        >
          <SelectTrigger
            variant="field"
            className={hasSelection ? 'bg-white text-gray-700' : 'bg-gray-0 text-gray-500'}
          >
            <SelectValue placeholder="이전 개인정보 처리방침을 선택해 주세요.">
              {(value) => versions.find((v) => v.version === value)?.label ?? null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            variant="field"
            alignItemWithTrigger={false}
            sideOffset={6}
            className="z-100"
          >
            {versions.map((v) => (
              <SelectItem key={v.version} variant="field" value={v.version}>
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

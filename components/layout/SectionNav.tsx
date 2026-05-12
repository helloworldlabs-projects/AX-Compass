'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export interface SectionNavItem {
  label: string;
  targetId: string;
}

export interface SectionNavGroup {
  groupLabel?: string;
  items: SectionNavItem[];
  expandButton?: boolean;
  onExpand?: () => void;
}

interface SectionNavProps {
  type?: 'general' | 'result' | 'institution';
  groups: SectionNavGroup[];
}

export default function SectionNav({ type = 'general', groups }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 10;
      if (show !== isVisible) {
        setIsVisible(show);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  const idsKey = groups.flatMap((g) => g.items.map((i) => i.targetId)).join(',');

  useEffect(() => {
    const allItems = groups.flatMap((g) => g.items);
    const observers = allItems.map(({ targetId }) => {
      const el = document.getElementById(targetId);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(targetId);
        },
        { rootMargin: '-64px 0px -80% 0px', threshold: 0 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  function scrollTo(id: string) {
    const element = document.getElementById(id);
    if (!element) return;

    const headerOffset = 120;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }

  return (
    <div
      className={`sticky top-[54px] z-40 mx-auto flex w-full max-w-fit min-w-[360px] items-center justify-between gap-3 overflow-hidden rounded-b-[12px] bg-white shadow lg:top-[66px] ${isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div className="flex w-full flex-1 flex-wrap items-center gap-2.5">
        {groups.map((group, gi) => (
          <div key={gi} className="flex w-fit flex-col items-center">
            {group.groupLabel && (
              <div className="txt-c1-bold bg-special-dark-blue-500 w-full py-1 text-center text-white">
                {group.groupLabel}
              </div>
            )}
            {group.expandButton ? (
              <div className="bg-special-dark-blue-100 px-4 py-3">
                <Button
                  variant={'navy'}
                  size="pill"
                  onClick={group.onExpand}
                  className="txt-c1-bold"
                >
                  펼쳐 보기
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  'flex w-full gap-2 overflow-x-auto px-4 py-3 lg:gap-3',
                  type !== 'general' && 'bg-special-dark-blue-100',
                )}
              >
                {group.items.map(({ label, targetId }) => (
                  <Button
                    key={targetId}
                    type="button"
                    size="pill"
                    onClick={() => scrollTo(targetId)}
                    variant={
                      activeId === targetId ? (type !== 'general' ? 'dark-blue' : 'purple') : 'gray'
                    }
                    className="txt-c1-bold"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

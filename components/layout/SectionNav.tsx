'use client';

import { useState, useEffect, useRef } from 'react';
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

const ACTIVE_OFFSET = 130;

export default function SectionNav({ type = 'general', groups }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(54);
  const navRef = useRef<HTMLDivElement>(null);
  const suppressUntilRef = useRef(0);

  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;
    const observer = new ResizeObserver(([entry]) => setHeaderHeight(entry.contentRect.height));
    observer.observe(header);
    setHeaderHeight(header.getBoundingClientRect().height);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handle = () => setIsVisible(window.scrollY > 10);
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const idsKey = groups.flatMap((g) => g.items.map((i) => i.targetId)).join(',');

  useEffect(() => {
    const allItems = groups.flatMap((g) => g.items);
    if (!allItems.length) return;

    const updateActive = () => {
      if (Date.now() < suppressUntilRef.current) return;
      let current: string | null = null;
      for (const { targetId } of allItems) {
        const el = document.getElementById(targetId);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_OFFSET) {
          current = targetId;
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
    return () => window.removeEventListener('scroll', updateActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  useEffect(() => {
    if (!activeId || !navRef.current) return;
    const activeEl = navRef.current.querySelector<HTMLElement>(`[data-navid="${activeId}"]`);
    if (!activeEl) return;
    const container = activeEl.parentElement;
    if (!container) return;
    const left = activeEl.offsetLeft - (container.offsetWidth - activeEl.offsetWidth) / 2;
    container.scrollTo({ left: Math.max(0, left) });
  }, [activeId]);

  function handleClick(id: string) {
    setActiveId(id);
    suppressUntilRef.current = Date.now() + 100;

    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - ACTIVE_OFFSET;
    window.scrollTo({ top });
  }

  return (
    <div
      data-print-hidden
      ref={navRef}
      style={{ top: headerHeight }}
      className={`fixed right-0 left-0 z-40 mx-auto flex w-full max-w-fit min-w-[360px] items-center justify-between gap-3 overflow-hidden rounded-b-[12px] bg-white shadow transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="flex w-full flex-1 flex-wrap items-center gap-2.5">
        {groups.map((group, gi) => (
          <div
            key={gi}
            className={`flex flex-col items-center ${type === 'institution' ? 'w-fit' : 'w-full'}`}
          >
            {group.groupLabel && (
              <div className="txt-c1-bold bg-special-dark-blue-500 w-full py-1 text-center text-white">
                {group.groupLabel}
              </div>
            )}
            {group.expandButton ? (
              <div className="bg-special-dark-blue-100 px-4 py-3">
                <Button variant="navy" size="pill" onClick={group.onExpand} className="txt-c1-bold">
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
                  <div key={targetId} data-navid={targetId} className="shrink-0">
                    <Button
                      type="button"
                      size="pill"
                      onClick={() => handleClick(targetId)}
                      variant={
                        activeId === targetId
                          ? type !== 'general'
                            ? 'dark-blue'
                            : 'purple'
                          : 'gray'
                      }
                      className="txt-c1-bold"
                    >
                      {label}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

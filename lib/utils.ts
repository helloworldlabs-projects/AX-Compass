import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          txt: [
            'h1',
            'h2',
            't1',
            't2',
            't3',
            'st-bold',
            'st-regular',
            'st2-bold',
            'st2-regular',
            'b-bold',
            'b-regular',
            'c1-bold',
            'c1-regular',
            'c2-bold',
            'c2-regular',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function roundScore(n: number): number {
  return Math.round(n * 10) / 10;
}

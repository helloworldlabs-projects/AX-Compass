export interface CompetencyColor {
  text: string;
  border: string;
  bg: string;
  hex: string;
}

export const COMPETENCY_COLOR_MAP: Record<string, CompetencyColor> = {
  UNDERSTAND: {
    text: 'text-special-pink-500',
    border: 'border-special-pink-500',
    bg: 'bg-special-pink-500/20',
    hex: '#ff5a81',
  },
  USE_AND_APPLY: {
    text: 'text-special-blue-500',
    border: 'border-special-blue-500',
    bg: 'bg-special-blue-500/20',
    hex: '#2e75cc',
  },
  EVALUATE: {
    text: 'text-purple-500',
    border: 'border-purple-500',
    bg: 'bg-purple-500/20',
    hex: '#8b5cff',
  },
  RESPONSIBLE: {
    text: 'text-gray-700',
    border: 'border-gray-700',
    bg: 'bg-gray-700/20',
    hex: '#404040',
  },
};

export const COMPETENCY_NAME_MAP: Record<string, string> = {
  UNDERSTAND: '이해(Understand)',
  USE_AND_APPLY: '활용(Use & Apply)',
  EVALUATE: '평가·개선(Evaluate & Improve)',
  RESPONSIBLE: '책임·거버넌스(Responsible Use)',
};

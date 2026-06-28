'use client';

import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

export type SearchableSelectOption = {
  id: number;
  name: string;
};

type SearchableSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  'aria-label'?: string;
};

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder,
  disabled = false,
  'aria-label': ariaLabel,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const deferredQuery = useDeferredValue(query);

  const filteredOptions = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => option.name.toLowerCase().includes(normalized));
  }, [deferredQuery, options]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    setQuery('');
  }

  function handleSelect(name: string) {
    onValueChange(name);
    close();
    inputRef.current?.blur();
  }

  function handleFocus() {
    if (disabled) return;
    setOpen(true);
    setQuery(value);
  }

  function handleToggle() {
    if (disabled) return;

    if (open) {
      close();
      inputRef.current?.blur();
      return;
    }

    setOpen(true);
    setQuery(value);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        disabled={disabled}
        placeholder={placeholder}
        value={open ? query : value}
        onFocus={handleFocus}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        className={cn(
          'txt-b-regular shadow-elevation h-[41px] w-full rounded-[12px] border-2 border-solid border-transparent py-4 pr-12 pl-4 text-gray-700 lg:h-[54px] lg:rounded-[14px]',
          'placeholder:text-gray-500 focus:border-special-orange-500 focus:bg-white focus:text-black focus:outline-none',
          open && 'border-special-orange-500 bg-white text-black',
          !open && value && 'bg-white text-gray-900',
          !open && !value && 'bg-gray-0',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={open ? '목록 닫기' : '목록 열기'}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'absolute top-1/2 right-4 flex h-[21px] w-[21px] -translate-y-1/2 items-center justify-center rounded lg:h-7 lg:w-7',
          open ? 'bg-special-orange-500 text-white' : 'bg-gray-100 text-gray-700',
        )}
      >
        {open ? (
          <ChevronUp className="size-[21px] lg:size-7" aria-hidden />
        ) : (
          <ChevronDown className="size-[21px] lg:size-7" aria-hidden />
        )}
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="shadow-elevation absolute z-50 mt-1 max-h-[120px] w-full overflow-y-auto overscroll-contain rounded-[12px] bg-white lg:max-h-[140px] lg:rounded-[14px]"
        >
          {filteredOptions.length === 0 ? (
            <li className="txt-c1-regular px-4 py-3 text-center text-gray-500">검색 결과가 없습니다.</li>
          ) : (
            filteredOptions.map((option) => (
              <li key={option.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={value === option.name}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(option.name)}
                  className={cn(
                    'txt-c1-regular flex h-[30px] w-full cursor-pointer items-center justify-center border-b border-gray-100 px-4 py-3 text-gray-500 transition-colors lg:h-[35px]',
                    'hover:bg-special-dark-blue-100 hover:txt-c1-bold',
                    value === option.name && 'bg-special-dark-blue-100 txt-c1-bold',
                  )}
                >
                  {option.name}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

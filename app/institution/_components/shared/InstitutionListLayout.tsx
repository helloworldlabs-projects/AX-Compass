'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, FileDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import Container from '@/components/layout/Container';

interface InstitutionListLayoutProps {
  institutionName: string;
  institutionCode: string;
  totalCount: number;
  completedCount: number;
  countLabel: string;
  searchPlaceholder: string;
  registerPlaceholder: string;
  filterLabel: string;
  onDownload: () => void;
  onSearch: (value: string) => void;
  onRegister: (name: string) => void;
  onRegisterErrorClear: () => void;
  registerError: string;
  onFilterChange: (checked: boolean) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  children: React.ReactNode;
}

export default function InstitutionListLayout({
  institutionName,
  institutionCode,
  totalCount,
  completedCount,
  countLabel,
  searchPlaceholder,
  registerPlaceholder,
  filterLabel,
  onDownload,
  onSearch,
  onRegister,
  onRegisterErrorClear,
  registerError,
  onFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  children,
}: InstitutionListLayoutProps) {
  const router = useRouter();
  const [filterChecked, setFilterChecked] = useState(false);
  const [registerName, setRegisterName] = useState('');

  function handleFilterChange(checked: boolean) {
    setFilterChecked(checked);
    onFilterChange(checked);
  }

  function handleRegisterSubmit() {
    const trimmed = registerName.trim();
    if (!trimmed) {
      onRegisterErrorClear();
      return;
    }
    onRegister(trimmed);
    setRegisterName('');
  }

  function handleRegisterKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleRegisterSubmit();
    }
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Container className="items-start overflow-x-auto">
      <div className="flex w-full min-w-[1620px] flex-col gap-[30px]">
        {/* 페이지 헤더 */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-end gap-4">
              {/* 제목 */}
              <h1 className="txt-t1 flex gap-4 font-bold text-gray-900">
                <span>{institutionName}</span>
                <span>{countLabel}</span>
                <span>리스트</span>
              </h1>
              {/* 기관 코드 */}
              <p className="txt-b-bold text-black">
                <span className="text-purple-700">*</span> 기관 코드:{' '}
                <span className="txt-b-bold text-purple-700">{institutionCode}</span>
              </p>
            </div>

            {/* 통계 */}
            <div className="flex gap-5 text-gray-500">
              <div>
                전체 {countLabel}: {totalCount}
              </div>
              <div>
                완료 {countLabel}: <span className="text-purple-700">{completedCount}</span>
              </div>
            </div>
          </div>
          {/* 뒤로가기 */}
          <button
            type="button"
            onClick={() => router.back()}
            className="txt-b-bold text-special-pink-600 flex cursor-pointer items-center gap-1"
            aria-label="이전 페이지로 이동"
          >
            <span>←</span>
            <span className="underline">뒤로가기</span>
          </button>
        </div>

        {/* 컨트롤 바 */}
        <div className="flex items-end justify-between">
          {/* 좌측: 다운로드 버튼 */}
          <div className="shrink-0">
            <Button
              variant="navy"
              size="pill"
              className="txt-c1-bold"
              onClick={onDownload}
              aria-label="전체 리스트 다운로드"
            >
              전체 리스트 다운
              <FileDown className="size-6" aria-hidden />
            </Button>
          </div>

          <div className="flex items-end gap-[30px]">
            {/* 필터 */}
            <Checkbox
              checked={filterChecked}
              onCheckedChange={(checked) => handleFilterChange(checked === true)}
              label={filterLabel}
              id="filter-checkbox"
              className="size-6!"
            />

            {/* 검색 */}
            <div className="flex-1">
              <Input
                type="search"
                placeholder={searchPlaceholder}
                onChange={onSearch}
                aria-label={searchPlaceholder}
                className="w-[300px]"
              />
            </div>

            {/* 등록 박스 */}
            <div className="flex shrink-0 flex-col gap-3.5 rounded-[12px] border border-purple-800 p-4">
              <span className="txt-c1-bold text-gray-500">* {countLabel} 등록</span>
              <div className="flex items-start gap-6">
                <div className="flex flex-col gap-1">
                  <Input
                    type="text"
                    placeholder={registerPlaceholder}
                    value={registerName}
                    onChange={(v) => {
                      setRegisterName(v);
                      if (registerError) onRegisterErrorClear();
                    }}
                    onKeyDown={handleRegisterKeyDown}
                    aria-label={`${countLabel} 이름 입력`}
                    className="w-[300px]"
                    error={registerError}
                  />
                </div>
                <Button
                  variant="navy"
                  size="default"
                  onClick={handleRegisterSubmit}
                  aria-label={`${countLabel} 추가`}
                  className="h-[54px]"
                  disabled={!registerName.trim()}
                >
                  추가
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 테이블 카드 */}
        <div className="mb-6 overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full min-w-max border-collapse text-left">{children}</table>
        </div>

        {/* 페이지네이션 */}
        {totalPages >= 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none' : ''}
                />
              </PaginationItem>

              {pageNumbers.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                    aria-label={`${page} 페이지`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Container>
  );
}

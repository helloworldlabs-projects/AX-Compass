'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useRegister } from '@/hooks/useRegister';
import InstitutionListLayout from './shared/InstitutionListLayout';
import { getApiErrorDetail } from '@/types/common';

const INSTITUTION_CODE = 'S0000001';

interface Executive {
  id: number;
  name: string;
  currentLevel: string | null;
  currentScore: number | null;
  targetLevel: string | null;
  targetScore: number | null;
  gap: number | null;
  resultCode: string | null;
}

const mockExecutives: Executive[] = [
  {
    id: 1,
    name: '정창렬',
    currentLevel: '도입',
    currentScore: 26,
    targetLevel: '통합',
    targetScore: 76,
    gap: -50,
    resultCode: '7F3K2Q9M',
  },
  {
    id: 2,
    name: '강수민',
    currentLevel: '도입',
    currentScore: 30,
    targetLevel: '활용',
    targetScore: 48,
    gap: -18,
    resultCode: 'Y2CDS41F',
  },
  {
    id: 3,
    name: '변영재',
    currentLevel: null,
    currentScore: null,
    targetLevel: null,
    targetScore: null,
    gap: null,
    resultCode: null,
  },
];

const ITEMS_PER_PAGE = 10;

function cell(value: string | number | null) {
  return value !== null && value !== undefined ? String(value) : '-';
}

export default function ExecutiveListScreen() {
  const [executives, setExecutives] = useState<Executive[]>(mockExecutives);
  const [searchValue, setSearchValue] = useState('');
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { mutate: register } = useRegister();
  const [registerError, setRegisterError] = useState('');

  const completedCount = executives.filter((e) => e.resultCode !== null).length;

  const filtered = executives.filter((e) => {
    const matchesSearch = e.name.includes(searchValue);
    const matchesFilter = filterCompleted ? e.resultCode !== null : true;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  function handleSearch(value: string) {
    setSearchValue(value);
    setCurrentPage(1);
  }

  function handleFilterChange(checked: boolean) {
    setFilterCompleted(checked);
    setCurrentPage(1);
  }

  function handleRegister(name: string) {
    register(
      { safarionCode: INSTITUTION_CODE, name, role: 'EXECUTIVE' },
      {
        onSuccess: () => {
          setExecutives((prev) => [
            ...prev,
            {
              id: Date.now(),
              name,
              currentLevel: null,
              currentScore: null,
              targetLevel: null,
              targetScore: null,
              gap: null,
              resultCode: null,
            },
          ]);
        },
        onError: (error) => {
          const detail = getApiErrorDetail(error);
          setRegisterError(detail ?? '입력한 정보를 다시 확인해 주세요.');
        },
      },
    );
  }

  function handleDelete(id: number) {
    setExecutives((prev) => prev.filter((e) => e.id !== id));
  }

  function handleDownload() {
    // 추후 API 연동 예정
  }

  return (
    <InstitutionListLayout
      institutionName="AX컴퍼스"
      institutionCode={INSTITUTION_CODE}
      totalCount={executives.length}
      completedCount={completedCount}
      countLabel="임원진"
      searchPlaceholder="임원진명으로 검색"
      registerPlaceholder="임원진명을 입력해 주세요."
      filterLabel="검사 완료 임원진만 확인"
      onDownload={handleDownload}
      onSearch={handleSearch}
      onRegister={handleRegister}
      onRegisterErrorClear={() => setRegisterError('')}
      registerError={registerError}
      onFilterChange={handleFilterChange}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    >
      <thead className="border-b border-gray-300">
        <tr className="bg-gray-0 txt-b-bold text-center text-gray-700">
          <th scope="col" className="w-[220px] shrink-0 py-[15px]">
            임원진명
          </th>
          <th scope="col" className="w-[200px] shrink-0 py-[15px]">
            현재 수준
            <br />
            AX 성숙도
          </th>
          <th scope="col" className="w-[200px] shrink-0 py-[15px]">
            현재 수준 점수
            <br />
            (CMS)
          </th>
          <th scope="col" className="py-[15px]">
            목표 수준
            <br />
            AX 성숙도
          </th>
          <th scope="col" className="w-[200px] shrink-0 py-[15px]">
            목표 수준 점수
            <br />
            (TMS)
          </th>
          <th scope="col" className="w-[200px] shrink-0 py-[15px]">
            성숙도 차이
            <br />
            (Gap_MS)
          </th>
          <th scope="col" className="w-[200px] shrink-0 py-[15px]">
            결과 조회 코드
          </th>
          <th scope="col" className="w-[200px] shrink-0 py-[15px]">
            관련 기능
          </th>
        </tr>
      </thead>
      <tbody>
        {paginated.length === 0 ? (
          <tr>
            <td colSpan={8} className="txt-b-bold py-10 text-center text-gray-500">
              임원진 정보가 없습니다.
            </td>
          </tr>
        ) : (
          paginated.map((executive) => (
            <tr
              key={executive.id}
              className="txt-b-regular border-b border-gray-100 text-center text-gray-500 last:border-b-0"
            >
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[220px] shrink-0 px-4 py-3">
                {executive.name}
              </td>
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[200px] shrink-0 px-4 py-3">
                {cell(executive.currentLevel)}
              </td>
              <td className="max-w-[200px] shrink-0 px-4 py-3">{cell(executive.currentScore)}</td>
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[200px] shrink-0 px-4 py-3">
                {cell(executive.targetLevel)}
              </td>
              <td className="max-w-[200px] shrink-0 px-4 py-3">{cell(executive.targetScore)}</td>
              <td className="max-w-[200px] shrink-0 px-4 py-3">{cell(executive.gap)}</td>
              <td className="max-w-[200px] shrink-0 px-4 py-3">{cell(executive.resultCode)}</td>
              <td className="w-[200px] shrink-0 px-4 py-3 text-center lg:px-5 lg:py-4">
                <Button
                  variant="pink"
                  className="h-9 rounded-[12px]!"
                  onClick={() => handleDelete(executive.id)}
                  aria-label={`${executive.name} 삭제`}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </InstitutionListLayout>
  );
}

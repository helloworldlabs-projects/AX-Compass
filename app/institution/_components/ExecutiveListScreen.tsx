'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useDeleteExecutive,
  useDownloadExecutiveExcel,
  useInstitutionExecutives,
  useRegisterMember,
} from '@/hooks/useInstitutionQueries';
import { getApiErrorDetail } from '@/types/common';
import type { ExecutiveListParams } from '@/types/institution';
import InstitutionListLayout from './shared/InstitutionListLayout';
import { toast } from 'sonner';

function cell(value: string | number | null) {
  return value !== null && value !== undefined ? String(value) : '-';
}

export default function ExecutiveListScreen() {
  const [searchValue, setSearchValue] = useState('');
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [registerError, setRegisterError] = useState('');

  const debouncedSearch = useDebounce(searchValue);
  const { mutate: register } = useRegisterMember();
  const { mutate: deleteExecutive } = useDeleteExecutive();
  const { mutate: downloadExcel, isPending: isDownloading } = useDownloadExecutiveExcel();

  const params: ExecutiveListParams = {
    name: debouncedSearch || undefined,
    examCompleted: filterCompleted || undefined,
    page: currentPage,
    size: 10,
  };

  const { data, isLoading } = useInstitutionExecutives(params);

  const executives = data?.executives ?? [];
  const totalPages = data?.pageInfo.totalPages ?? 1;

  function handleSearch(value: string) {
    setSearchValue(value);
    setCurrentPage(0);
  }

  function handleFilterChange(checked: boolean) {
    setFilterCompleted(checked);
    setCurrentPage(0);
  }

  function handleRegister(name: string) {
    register(
      { safarionCode: data?.institutionCode ?? '', name, role: 'EXECUTIVE' },
      {
        onSuccess: () => setCurrentPage(0),
        onError: (error) => {
          const detail = getApiErrorDetail(error);
          setRegisterError(detail ?? '초대에 실패했습니다.');
        },
      },
    );
  }

  function handleDelete(executiveId: number) {
    deleteExecutive(executiveId, {
      onError: (error) => {
        const detail = getApiErrorDetail(error);
        toast.error(detail ?? '삭제에 실패했습니다.');
      },
    });
  }

  function handleDownload() {
    downloadExcel(data?.institutionCode ?? 'S0000000', {
      onError: () => toast.error('다운로드에 실패했습니다.'),
    });
  }

  return (
    <InstitutionListLayout
      institutionName={data?.institutionName ?? ''}
      institutionCode={data?.institutionCode ?? ''}
      totalCount={data?.totalExecutiveCount ?? 0}
      completedCount={data?.examCompletedCount ?? 0}
      countLabel="임원진"
      searchPlaceholder="임원진명으로 검색"
      registerPlaceholder="임원진명을 입력해 주세요."
      filterLabel="검사 완료 임원진만 확인"
      onDownload={handleDownload}
      isDownloading={isDownloading}
      onSearch={handleSearch}
      onRegister={handleRegister}
      onRegisterErrorClear={() => setRegisterError('')}
      registerError={registerError}
      onFilterChange={handleFilterChange}
      currentPage={currentPage + 1}
      totalPages={totalPages}
      onPageChange={(page) => setCurrentPage(page - 1)}
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
        {isLoading ? (
          <tr>
            <td colSpan={8} className="txt-b-bold py-10 text-center text-gray-500">
              불러오는 중...
            </td>
          </tr>
        ) : executives.length === 0 ? (
          <tr>
            <td colSpan={8} className="txt-b-bold py-10 text-center text-gray-500">
              임원진 정보가 없습니다.
            </td>
          </tr>
        ) : (
          executives.map((executive) => (
            <tr
              key={executive.executiveId}
              className="txt-b-regular border-b border-gray-100 text-center text-gray-500 last:border-b-0"
            >
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[220px] shrink-0 px-4 py-3">
                {executive.executiveName}
              </td>
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[200px] shrink-0 px-4 py-3">
                {cell(executive.currentMaturityStage)}
              </td>
              <td className="max-w-[200px] shrink-0 px-4 py-3">{cell(executive.currentScore)}</td>
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[200px] shrink-0 px-4 py-3">
                {cell(executive.targetMaturityStage)}
              </td>
              <td className="max-w-[200px] shrink-0 px-4 py-3">{cell(executive.targetScore)}</td>
              <td className="max-w-[200px] shrink-0 px-4 py-3">{cell(executive.gapMs)}</td>
              <td className="max-w-[200px] shrink-0 px-4 py-3">{cell(executive.resultCode)}</td>
              <td className="w-[200px] shrink-0 px-4 py-3 text-center lg:px-5 lg:py-4">
                <Button
                  variant="pink"
                  className="h-9 rounded-[12px]!"
                  onClick={() => handleDelete(executive.executiveId)}
                  aria-label={`${executive.executiveName} 삭제`}
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

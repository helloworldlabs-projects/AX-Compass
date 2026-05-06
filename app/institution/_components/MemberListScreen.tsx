'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  useInstitutionMembers,
  useRegisterMember,
  useDeleteMember,
  useDownloadMemberExcel,
} from '@/hooks/useInstitutionQueries';
import { useDebounce } from '@/hooks/useDebounce';
import InstitutionListLayout from './shared/InstitutionListLayout';
import { getApiErrorDetail } from '@/types/common';
import type { MemberListParams } from '@/types/institution';
import { INSTITUTION_LEVEL_LABEL_MAP } from '@/constants/levelConfig';
import { toast } from 'sonner';

function cell(value: string | number | null | undefined) {
  return value !== null && value !== undefined ? String(value) : '-';
}

export default function MemberListScreen() {
  const [searchValue, setSearchValue] = useState('');
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // API는 0-indexed

  const debouncedSearch = useDebounce(searchValue);

  const { mutate: register } = useRegisterMember();
  const { mutate: deleteMember, isPending: isDeletePending } = useDeleteMember();
  const { mutate: downloadExcel, isPending: isDownloading } = useDownloadMemberExcel();
  const [registerError, setRegisterError] = useState('');

  const params: MemberListParams = {
    keyword: debouncedSearch || undefined,
    examCompleted: filterCompleted || undefined,
    page: currentPage,
    size: 10,
  };

  const { data, isLoading, isError } = useInstitutionMembers(params);

  const members = data?.members ?? [];
  const pageInfo = data?.pageInfo;
  const totalPages = pageInfo?.totalPages ?? 1;

  function handleSearch(value: string) {
    setSearchValue(value);
    setCurrentPage(0);
  }

  function handleFilterChange(checked: boolean) {
    setFilterCompleted(checked);
    setCurrentPage(0);
  }

  function handleRegister(name: string, department: string) {
    register(
      { safarionCode: data?.institutionCode ?? '', name, department, role: 'MEMBER' },
      {
        onSuccess: () => setCurrentPage(0),
        onError: (error) => {
          const detail = getApiErrorDetail(error);
          setRegisterError(detail ?? '초대에 실패했습니다.');
        },
      },
    );
  }

  function handleDelete(memberId: number) {
    deleteMember(memberId, {
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
      institutionName={data?.institutionName ?? '-'}
      institutionCode={data?.institutionCode ?? '-'}
      totalCount={data?.totalMemberCount ?? 0}
      completedCount={data?.examCompletedCount ?? 0}
      countLabel="구성원"
      searchPlaceholder="구성원명, 소속으로 검색"
      registerPlaceholder="구성원명을 입력해 주세요."
      filterLabel="검사 완료 구성원만 확인"
      onDownload={handleDownload}
      isDownloading={isDownloading}
      onSearch={handleSearch}
      registerError={registerError}
      onRegisterErrorClear={() => setRegisterError('')}
      onRegister={handleRegister}
      onFilterChange={handleFilterChange}
      currentPage={currentPage + 1} // UI는 1-indexed
      totalPages={totalPages}
      onPageChange={(page) => setCurrentPage(page - 1)} // UI → API 변환
    >
      <thead className="border-b border-gray-300">
        <tr className="bg-gray-0 txt-b-bold text-center text-gray-700">
          <th scope="col" className="shrink-0 py-[15px]">
            구성원명
          </th>
          <th scope="col" className="shrink-0 py-[15px]">
            소속
          </th>
          <th scope="col" className="shrink-0 py-[15px]">
            종합 역량 등급
          </th>
          <th scope="col" className="shrink-0 py-[15px]">
            세부 역량 등급
            <br />
            (이해)
          </th>
          <th scope="col" className="shrink-0 py-[15px]">
            세부 역량 등급
            <br />
            (활용)
          </th>
          <th scope="col" className="shrink-0 py-[15px]">
            세부 역량 등급
            <br />
            (평가·개선)
          </th>
          <th scope="col" className="shrink-0 py-[15px]">
            세부 역량 등급
            <br />
            (책임·거버넌스)
          </th>
          <th scope="col" className="shrink-0 py-[15px]">
            프로필 유형
          </th>
          <th scope="col" className="w-[100px] shrink-0 py-[15px]">
            자기 평가 점수
            <br />
            (SE)
          </th>
          <th scope="col" className="w-[100px] shrink-0 py-[15px]">
            상황 판단 점수
            <br />
            (SJ)
          </th>
          <th scope="col" className="w-[100px] shrink-0 py-[15px]">
            행동 빈도 점수
            <br />
            (BH)
          </th>
          <th scope="col" className="shrink-0 py-[15px]">
            결과 조회 코드
          </th>
          <th scope="col" className="w-[120px] shrink-0 py-[15px]">
            관련 기능
          </th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={12} className="txt-b-bold py-10 text-center text-gray-400">
              불러오는 중...
            </td>
          </tr>
        ) : isError ? (
          <tr>
            <td colSpan={12} className="txt-b-bold py-10 text-center text-red-500">
              데이터를 불러오지 못했습니다.
            </td>
          </tr>
        ) : members.length === 0 ? (
          <tr>
            <td colSpan={12} className="txt-b-bold py-10 text-center text-gray-500">
              구성원 정보가 없습니다.
            </td>
          </tr>
        ) : (
          members.map((member) => (
            <tr
              key={member.memberName + (member.resultCode ?? '')}
              className="txt-b-regular border-b border-gray-100 text-center text-gray-500 last:border-b-0"
            >
              <td className="txt-b-bold text-special-dark-blue-500 shrink-0 px-4 py-3">
                {member.memberName}
              </td>
              <td className="txt-b-bold text-special-dark-blue-500 shrink-0 px-4 py-3">
                {member.department ?? '-'}
              </td>
              <td className="txt-b-bold text-special-dark-blue-500 shrink-0 px-4 py-3">
                {cell(member.overallLevel ? INSTITUTION_LEVEL_LABEL_MAP[member.overallLevel] : '-')}
              </td>
              <td className="text-special-dark-blue-500 shrink-0 px-4 py-3">
                {cell(member.understandLevel)}
              </td>
              <td className="text-special-dark-blue-500 shrink-0 px-4 py-3">
                {cell(member.useApplyLevel)}
              </td>
              <td className="text-special-dark-blue-500 shrink-0 px-4 py-3">
                {cell(member.evaluateLevel)}
              </td>
              <td className="text-special-dark-blue-500 shrink-0 px-4 py-3">
                {cell(member.responsibleLevel)}
              </td>
              <td className="txt-b-bold text-special-dark-blue-500 shrink-0 px-4 py-3">
                {member.profileType ? (
                  <span className="txt-b-bold text-gray-800">{member.profileType}</span>
                ) : (
                  <span className="txt-b-regular text-gray-500">-</span>
                )}
              </td>
              <td className="w-[100px] shrink-0 px-4 py-3">{cell(member.seScore)}</td>
              <td className="w-[100px] shrink-0 px-4 py-3">{cell(member.sjScore)}</td>
              <td className="w-[100px] shrink-0 px-4 py-3">{cell(member.bhScore)}</td>
              <td className="shrink-0 px-4 py-3">{cell(member.resultCode)}</td>
              <td className="w-[120px] shrink-0 px-4 py-3 text-center lg:px-5 lg:py-4">
                {member.resultCode === null ? (
                  <Button
                    variant="pink"
                    className="h-9 rounded-[12px]!"
                    onClick={() => handleDelete(member.memberId)}
                    disabled={isDeletePending}
                    aria-label={`${member.memberName} 삭제`}
                  >
                    삭제
                  </Button>
                ) : (
                  <span className="txt-b-regular text-gray-400">-</span>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </InstitutionListLayout>
  );
}

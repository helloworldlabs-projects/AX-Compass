'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useRegister } from '@/hooks/useRegister';
import InstitutionListLayout from './shared/InstitutionListLayout';
import { getApiErrorDetail } from '@/types/common';

const INSTITUTION_CODE = 'S0000001';

interface Member {
  id: number;
  name: string;
  overallGrade: string | null;
  gradeUnderstanding: string | null;
  gradeApplication: string | null;
  gradeEvaluation: string | null;
  gradeGovernance: string | null;
  profileType: string | null;
  scoreSE: number | null;
  scoreSJ: number | null;
  scoreBE: number | null;
  resultCode: string | null;
}

const mockMembers: Member[] = [
  {
    id: 1,
    name: '정창렬',
    overallGrade: '중급',
    gradeUnderstanding: '중급',
    gradeApplication: '고급',
    gradeEvaluation: '중급',
    gradeGovernance: '중급',
    profileType: '판단형',
    scoreSE: 72.9,
    scoreSJ: 90,
    scoreBE: 60.2,
    resultCode: '7F3K2Q9M',
  },
  {
    id: 2,
    name: '강수민',
    overallGrade: '중급',
    gradeUnderstanding: '고급',
    gradeApplication: '중급',
    gradeEvaluation: '하급',
    gradeGovernance: '중급',
    profileType: '균형형',
    scoreSE: 58.8,
    scoreSJ: 65,
    scoreBE: 89.5,
    resultCode: 'Y2CDS41F',
  },
  {
    id: 3,
    name: '변영재',
    overallGrade: null,
    gradeUnderstanding: null,
    gradeApplication: null,
    gradeEvaluation: null,
    gradeGovernance: null,
    profileType: null,
    scoreSE: null,
    scoreSJ: null,
    scoreBE: null,
    resultCode: null,
  },
];

const ITEMS_PER_PAGE = 10;

function cell(value: string | number | null) {
  return value !== null && value !== undefined ? String(value) : '-';
}

export default function MemberListScreen() {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchValue, setSearchValue] = useState('');
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { mutate: register } = useRegister();
  const [registerError, setRegisterError] = useState('');

  const completedCount = members.filter((m) => m.resultCode !== null).length;

  const filtered = members.filter((m) => {
    const matchesSearch = m.name.includes(searchValue);
    const matchesFilter = filterCompleted ? m.resultCode !== null : true;
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
      { safarionCode: INSTITUTION_CODE, name, role: 'MEMBER' },
      {
        onSuccess: () => {
          setMembers((prev) => [
            ...prev,
            {
              id: Date.now(),
              name,
              overallGrade: null,
              gradeUnderstanding: null,
              gradeApplication: null,
              gradeEvaluation: null,
              gradeGovernance: null,
              profileType: null,
              scoreSE: null,
              scoreSJ: null,
              scoreBE: null,
              resultCode: null,
            },
          ]);
        },
        onError: (error) => {
          const detail = getApiErrorDetail(error);
          setRegisterError(detail ?? '초대에 실패했습니다.');
        },
      },
    );
  }

  function handleDelete(id: number) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function handleDownload() {
    // 추후 API 연동 예정
  }

  return (
    <InstitutionListLayout
      institutionName="AX컴퍼스"
      institutionCode={INSTITUTION_CODE}
      totalCount={members.length}
      completedCount={completedCount}
      countLabel="구성원"
      searchPlaceholder="구성원명으로 검색"
      registerPlaceholder="구성원명을 입력해 주세요."
      filterLabel="검사 완료 구성원만 확인"
      onDownload={handleDownload}
      onSearch={handleSearch}
      registerError={registerError}
      onRegisterErrorClear={() => setRegisterError('')}
      onRegister={handleRegister}
      onFilterChange={handleFilterChange}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    >
      <thead className="border-b border-gray-300">
        <tr className="bg-gray-0 txt-b-bold text-center text-gray-700">
          <th scope="col" className="w-[150px] shrink-0 py-[15px]">
            구성원명
          </th>
          <th scope="col" className="w-[150px] shrink-0 py-[15px]">
            종합 역량 등급
          </th>
          <th scope="col" className="w-[150px] shrink-0 py-[15px]">
            세부 역량 등급
            <br />
            (이해)
          </th>
          <th scope="col" className="w-[150px] shrink-0 py-[15px]">
            세부 역량 등급
            <br />
            (활용)
          </th>
          <th scope="col" className="w-[150px] shrink-0 py-[15px]">
            세부 역량 등급
            <br />
            (평가·개선)
          </th>
          <th scope="col" className="w-[150px] shrink-0 py-[15px]">
            세부 역량 등급
            <br />
            (책임·거버넌스)
          </th>
          <th scope="col" className="w-[150px] shrink-0 py-[15px]">
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
            (BE)
          </th>
          <th scope="col" className="w-[150px] shrink-0 py-[15px]">
            결과 조회 코드
          </th>
          <th scope="col" className="w-[120px] shrink-0 py-[15px]">
            관련 기능
          </th>
        </tr>
      </thead>
      <tbody>
        {paginated.length === 0 ? (
          <tr>
            <td colSpan={12} className="txt-b-bold py-10 text-center text-gray-500">
              구성원 정보가 없습니다.
            </td>
          </tr>
        ) : (
          paginated.map((member) => (
            <tr
              key={member.id}
              className="txt-b-regular border-b border-gray-100 text-center text-gray-500 last:border-b-0"
            >
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[150px] shrink-0 px-4 py-3">
                {member.name}
              </td>
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[150px] shrink-0 px-4 py-3">
                {cell(member.overallGrade)}
              </td>
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[150px] shrink-0 px-4 py-3">
                {cell(member.gradeUnderstanding)}
              </td>
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[150px] shrink-0 px-4 py-3">
                {cell(member.gradeApplication)}
              </td>
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[150px] shrink-0 px-4 py-3">
                {cell(member.gradeEvaluation)}
              </td>
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[150px] shrink-0 px-4 py-3">
                {cell(member.gradeGovernance)}
              </td>
              <td className="txt-b-bold text-special-dark-blue-500 max-w-[150px] shrink-0 px-4 py-3">
                {member.profileType ? (
                  <span className="txt-b-bold text-gray-800">{member.profileType}</span>
                ) : (
                  <span className="txt-b-regular text-gray-500">-</span>
                )}
              </td>
              <td className="max-w-[100px] shrink-0 px-4 py-3">{cell(member.scoreSE)}</td>
              <td className="max-w-[100px] shrink-0 px-4 py-3">{cell(member.scoreSJ)}</td>
              <td className="max-w-[100px] shrink-0 px-4 py-3">{cell(member.scoreBE)}</td>
              <td className="max-w-[150px] shrink-0 px-4 py-3">{cell(member.resultCode)}</td>
              <td className="w-[120px] shrink-0 px-4 py-3 text-center lg:px-5 lg:py-4">
                {member.resultCode === null ? (
                  <Button
                    variant="pink"
                    className="h-9 rounded-[12px]!"
                    onClick={() => handleDelete(member.id)}
                    aria-label={`${member.name} 삭제`}
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

'use client';

import { Checkbox } from '@/components/ui/checkbox';
import type { ExamType } from '@/types/exam';

function DefaultIntroContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-2.5 p-3 shadow lg:p-4">
        <div className="txt-b-bold">1. 검사 구성 안내</div>
        <ul className="ml-4 flex list-outside list-disc flex-col">
          <li>자기 평가: 현재 나의 AI 이해 수준과 활용 자신감을 돌아보고 응답하는 평가입니다.</li>
          <li>
            상황 판단: 실제 업무와 유사한 AI 활용 상황에서 더 적절한 판단을 선택하는 평가입니다.
          </li>
          <li>
            행동 빈도: 업무에서 AI를 얼마나 자주 활용하고 실천하는지 돌아보고 응답하는 평가입니다.
          </li>
        </ul>
      </div>
      <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-2.5 p-3 shadow lg:p-4">
        <div className="txt-b-bold">2. 응답 방식 안내</div>
        <ul className="ml-4 flex list-outside list-disc flex-col">
          <li>가장 올바르게 보이는 답을 찾기보다, 현재 나에게 가장 가까운 응답을 선택해 주세요.</li>
          <li>
            문항마다 오래 고민하기보다, 평소의 생각과 AI를 사용하는 방식에 따라 자연스럽게 답해
            주세요.
          </li>
        </ul>
      </div>
      <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-2.5 p-3 shadow lg:p-4">
        <div className="txt-b-bold">3. 진행 유의사항</div>
        <ul className="ml-4 flex list-outside list-disc flex-col">
          <li>검사는 문항 단위로 진행되며, 이전 문항으로 돌아가 확인하거나 수정할 수 없습니다.</li>
          <li>
            검사 진행 중에는 응답이 저장되지 않습니다. 중간에 나가면 처음부터 다시 진행해야 합니다.
          </li>
        </ul>
      </div>
    </div>
  );
}

function ExecutiveIntroContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-2.5 p-3 shadow lg:p-4">
        <div className="txt-b-bold">1. 검사 구성 안내</div>
        <ul className="ml-4 flex list-outside list-disc flex-col">
          <li>
            현재 수준 진단: 우리 조직의 현재 AX 성숙도 수준이 어느 정도인지 진단하는 평가입니다.
          </li>
          <li>
            목표 수준 진단: 우리 조직이 앞으로 도달하고자 하는 AX 성숙도 목표 수준을 확인하는
            평가입니다.
          </li>
        </ul>
      </div>
      <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-2.5 p-3 shadow lg:p-4">
        <div className="txt-b-bold">2. 응답 방식 안내</div>
        <ul className="ml-4 flex list-outside list-disc flex-col">
          <li>
            각 문항은 개인의 의견이 아니라, 현재 우리 조직의 운영 수준과 방향성을 기준으로 응답해
            주세요.
          </li>
          <li>
            이상적인 모습보다, 실제 조직의 현재 상태와 지향 수준에 가장 가까운 응답을 선택해 주세요.
          </li>
        </ul>
      </div>
      <div className="bg-special-dark-blue-0 rounded-card flex flex-col gap-2.5 p-3 shadow lg:p-4">
        <div className="txt-b-bold">3. 진행 유의사항</div>
        <ul className="ml-4 flex list-outside list-disc flex-col">
          <li>검사는 문항 단위로 진행되며, 이전 문항으로 돌아가 확인하거나 수정할 수 없습니다.</li>
          <li>
            검사 진행 중에는 응답이 저장되지 않습니다. 중간에 나가면 처음부터 다시 진행해야 합니다.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function IntroStep({
  examType,
  agreed,
  setAgreed,
}: {
  examType: ExamType;
  agreed: boolean;
  setAgreed: (agreed: boolean) => void;
}) {
  return (
    <>
      {/* 안내 본문 */}
      <div className="rounded-card flex flex-col gap-6 bg-white px-4 py-6 shadow lg:px-20">
        <div className="txt-t3 text-shadow text-center text-purple-700">※ 검사 시작 전 안내</div>
        {examType === 'EXECUTIVE' ? <ExecutiveIntroContent /> : <DefaultIntroContent />}

        {/* 개인정보 동의 */}
        <div className="rounded-card mx-auto flex max-w-[500px] flex-col gap-3 border-2 border-gray-100 bg-white p-3 lg:gap-4 lg:px-[30px] lg:py-4">
          <div className="mb-1 flex items-center">
            <Checkbox
              id="general-privacy"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              label={
                <div className="txt-c1-bold flex gap-1">
                  <span className="text-red-500">[필수]</span>검사 결과의 연구 및 마케팅 활용 동의
                </div>
              }
            />
          </div>
          <div className="bg-gray-0 rounded-[12px] p-3 lg:p-4">
            <ul className="txt-c1-regular ml-4 list-outside list-disc text-gray-700">
              <li>
                회사는 입력한 기본 정보와 검사 결과를 서비스 개선, 이용 통계 분석, 연구, 마케팅 자료
                제작 및 활용 목적으로 사용할 수 있습니다.
              </li>
              <li>단, 결과는 개인을 직접 식별할 수 없는 형태로만 사용됩니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

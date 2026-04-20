'use client';

import { CompassIcon } from '@/components/icons/CompassIcon';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { CurriculumItem } from '@/components/ui/CurriculumItem';
import { ProfileResultCard } from '@/components/ui/ProfileResultCard';
import { BadgeCheck, Check, ContactRound, HelpCircle, Map, Trophy, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MaturityLevelCard } from './_components/MaturityLevelCard';
import { GradeStatGuideModal } from '@/components/modals/GradeStatGuideModal';
import { useState } from 'react';
import { LearningRoadmapGuideModal } from '@/components/modals/LearningRoadmapGuideModal';
import { ScoreStatGuideModal } from '@/components/modals/ScoreStatGuideModal';
import { ProfileTypeStatGuideModal } from '@/components/modals/ProfileTypeStatGuideModal';
import { CompetencyLevelChart } from '@/components/institution/CompetencyLevelChart';
import { ProfileRadarChart } from '@/components/institution/ProfileRadarChart';
import { PROFILE_TYPE_LABEL } from '@/constants/profileTypeConfig';
import { RadarChart } from '@/components/ui/RadarChart';
import { COMPETENCY_COLOR_MAP, COMPETENCY_NAME_MAP } from '@/constants/competencyConfig';
import { CurriculumTreeChart } from '@/components/shared/CurriculumTreeChart';
import { useInstitutionStats } from '@/hooks/useInstitutionQueries';

export default function InstitutionPage() {
  const { data: stats, isLoading, isError } = useInstitutionStats();
  const [selectedRoadmap, setSelectedRoadmap] = useState<
    'overall' | 'beginnerElementary' | 'intermediateAdvanced'
  >('overall');
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);
  const [openGradeStatGuideModal, setOpenGradeStatGuideModal] = useState(false);
  const [openLearningRoadmapGuideModal, setOpenLearningRoadmapGuideModal] = useState(false);
  const [openScoreStatGuideModal, setOpenScoreStatGuideModal] = useState(false);
  const [openProfileTypeStatGuideModal, setOpenProfileTypeStatGuideModal] = useState(false);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !stats) return <div>데이터를 불러올 수 없습니다.</div>;

  const roadmap =
    selectedRoadmap === 'overall'
      ? stats.institutionRoadmap.overallRoadmap
      : selectedRoadmap === 'beginnerElementary'
        ? stats.institutionRoadmap.beginnerElementaryRoadmap
        : stats.institutionRoadmap.intermediateAdvancedRoadmap;

  return (
    <Container>
      {/** TODO: 디버깅용 패널 - 작업 완료 후 제거 */}
      <details
        open
        className="fixed right-4 bottom-4 z-[9999] w-[400px] rounded-[12px] border-2 border-dashed border-yellow-400 bg-yellow-50 p-4 shadow-lg"
      >
        <summary className="cursor-pointer font-mono text-sm font-bold text-yellow-700">
          [DEBUG] institution stats
        </summary>
        <pre className="mt-2 max-h-[400px] overflow-auto font-mono text-xs text-yellow-900">
          {JSON.stringify(stats, null, 2)}
        </pre>
      </details>

      {/** 모달 - 추후 페이지 분리 예정 */}
      <GradeStatGuideModal
        open={openGradeStatGuideModal}
        onClose={() => setOpenGradeStatGuideModal(false)}
      />
      <LearningRoadmapGuideModal
        open={openLearningRoadmapGuideModal}
        onClose={() => setOpenLearningRoadmapGuideModal(false)}
      />
      <ScoreStatGuideModal
        open={openScoreStatGuideModal}
        onClose={() => setOpenScoreStatGuideModal(false)}
      />
      <ProfileTypeStatGuideModal
        open={openProfileTypeStatGuideModal}
        onClose={() => setOpenProfileTypeStatGuideModal(false)}
      />

      <Section className="flex w-[700px] shrink-0">
        <div className="txt-t1 flex w-full">{'기관명'}</div>
        <div className="flex w-full items-center gap-4">
          <Users className="size-10 text-purple-700" />
          <span className="txt-t1 text-black">전체 평가 인원</span>
        </div>
        <div className="flex gap-[50px]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-[130px] w-[300px] items-center justify-center rounded-[20px] border-3 border-gray-300 shadow">
              <span className="bg-special-dark-blue-500 absolute top-[-3px] left-[-3px] rounded-[20px] border-3 border-gray-300 px-2.5 py-2 text-white">
                임원진
              </span>
              <div className="txt-t1 text-black">
                {stats.executiveExamCount} / {stats.executiveCount} 명
              </div>
            </div>
            <Button
              render={<Link href="/institution/executive" />}
              variant="dark-blue"
              size="pill"
              className="w-fit rounded-[12px]"
            >
              상세 보기
            </Button>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-[130px] w-[300px] items-center justify-center rounded-[20px] border-3 border-gray-300 shadow">
              <span className="bg-special-navy-500 absolute top-[-3px] left-[-3px] rounded-[20px] border-3 border-gray-300 px-2.5 py-2 text-white">
                구성원
              </span>
              <div className="txt-t1 text-black">
                {stats.memberExamCount} / {stats.memberCount} 명
              </div>
            </div>
            <Button
              render={<Link href="/institution/member" />}
              variant="navy"
              size="pill"
              className="w-fit rounded-[12px]"
            >
              상세 보기
            </Button>
          </div>
        </div>
      </Section>
      {stats.executiveExamCount < 2 && (
        <Section className="max-w-[1000px] shrink-0">
          <div className="bg-special-pink-0 flex w-full flex-col gap-3 rounded-[20px] border border-gray-100 p-3">
            <div className="bg-special-dark-blue-700 border-special-dark-blue-300 flex w-fit items-center gap-2 rounded-[12px] border-2 px-3 py-2">
              <Check className="size-4.5 text-white" strokeWidth={3} />
              <span className="txt-c1-bold text-white">기관 통계 안내</span>
            </div>
            <div className="txt-st2-bold text-center text-black">
              임원진 검사 응답 수가 부족하여 기관 AX 성숙도 통계를 제공할 수 없습니다.
              <br />
              <span className="text-special-pink-600">임원진 검사 2명 이상 참여 시</span> 확인할 수
              있습니다.
            </div>
            <span className="txt-c2-regular text-end">
              [임원진] 상세 보기에서 검사자를 등록 후 검사를 진행해주세요.
            </span>
          </div>
        </Section>
      )}
      {stats.memberExamCount < 5 && (
        <Section className="max-w-[1000px] shrink-0">
          <div className="bg-special-pink-0 flex w-full flex-col gap-3 rounded-[20px] border border-gray-100 p-3">
            <div className="bg-special-dark-blue-700 border-special-dark-blue-300 flex w-fit items-center gap-2 rounded-[12px] border-2 px-3 py-2">
              <Check className="size-4.5 text-white" strokeWidth={3} />
              <span className="txt-c1-bold text-white">기관 통계 안내</span>
            </div>
            <div className="txt-st2-bold text-center text-black">
              구성원 검사 응답 수가 부족하여 기관 AX 역량 통계를 제공할 수 없습니다.
              <br />
              <span className="text-special-pink-600">구성원 검사 5명 이상 참여 시</span> 확인할 수
              있습니다.
            </div>
            <span className="txt-c2-regular text-end">
              [구성원] 상세 보기에서 검사자를 등록 후 검사를 진행해주세요.
            </span>
          </div>
        </Section>
      )}
      <Section className="max-w-[1000px] shrink-0">
        <div className="bg-gray-0 flex w-full flex-col gap-3 rounded-[20px] border border-gray-100 p-3">
          <div className="bg-special-dark-blue-700 border-special-dark-blue-300 flex w-fit items-center gap-2 rounded-[12px] border-2 px-3 py-2">
            <CompassIcon className="size-4.5 text-white" fillOpacity="1" />
            <span className="txt-c1-bold text-white">기관 통계 안내</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/images/logo/img_logo_helloworldlabs.png"
              alt=""
              width={300}
              height={30}
              className="h-[30px] w-[300px] object-contain"
            />
            <div className="txt-st2-bold text-black">에서 인증하는 공식 결과입니다.</div>
          </div>
          <div className="text-center">
            본 문서는 AX Compass 진단 결과를 바탕으로 생성되었습니다.
          </div>
          <div className="txt-c2-regular flex items-center justify-end gap-2">
            <span>발급 기관: (주)헬로월드랩스</span>
          </div>
        </div>
      </Section>
      <Section className="w-[700px] shrink-0">
        <div className="flex w-full flex-col items-start">
          <div className="txt-t1">{'기관명'}</div>
          <span className="txt-st2-regular">기관 AX 진단 결과 입니다.</span>
        </div>
        <div className="flex items-center gap-[50px]">
          <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-purple-300 bg-purple-700 py-5 shadow">
            <div className="flex items-center gap-1 text-white">
              <BadgeCheck className="size-5 text-purple-700" fill="white" />
              <span className="txt-b-bold">현재 성숙도 수준</span>
            </div>
            <div className="txt-t2 text-white">{'도입'}</div>
          </div>
          <div className="border-special-pink-200 bg-special-pink-600 flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 py-5 shadow">
            <div className="flex items-center gap-1 text-white">
              <BadgeCheck className="text-special-pink-600 size-5" fill="white" />
              <span className="txt-b-bold">목표 성숙도 수준</span>
            </div>
            <div className="txt-t2 text-white">{'통합'}</div>
          </div>
        </div>
        <div className="boder-gray-500 flex flex-col gap-[30px] rounded-[20px] border bg-white p-[50px] shadow">
          <MaturityLevelCard type="INITIATION" />
          <MaturityLevelCard type="INTEGRATION" />
        </div>
      </Section>
      <Section className="max-w-[1000px] shrink-0">
        <div className="flex w-full flex-col gap-[30px]">
          <div className="h-[330px] w-full px-[50px]">그래프 영역</div>
          <div className="w-[700px]">
            <div className="txt-st-bold">
              <span className="text-purple-700">* </span>
              Gap_MS (CMS − TMS)
            </div>
            <div>
              현재 성숙도(Current Maturity Stage)와 목표 성숙도(Target Maturity Stage)의 차이입니다.
              <br />
              <span className="txt-b-bold text-green-600">[양수(+)]</span> 현재 성숙도가 목표
              성숙도보다 높아, 현재 수준 대비 보수적인 목표를 두거나 향후 추진 방향을 낮게 설정하는
              경향이 있습니다.
              <br />
              <span className="txt-b-bold text-red-500">[음수(−)]</span> 현재 성숙도가 목표
              성숙도보다 낮아, 현재 수준을 넘어 더 높은 단계로의 성장과 고도화를 기대하는 경향이
              있습니다.
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-y-[50px]">
          {/* 이해(Understand) */}
          <div className="flex w-[500px] flex-col">
            <div className="txt-st-bold text-center">현재 영역별 성숙도</div>
            <div className="flex flex-col gap-5">
              <div className="h-[500px] w-full">그래프 영역</div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-pink-500">* </span>전략·리더십
                  </div>
                  <div
                    className="border-special-pink-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${80}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-pink-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'80'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-pink-500">* </span>운영체계·확산
                  </div>
                  <div
                    className="border-special-pink-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${25}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-pink-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'25'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-pink-500">* </span>업무 적용
                  </div>
                  <div
                    className="border-special-pink-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${25}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-pink-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'25'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-pink-500">* </span>데이터·시스템 기반
                  </div>
                  <div
                    className="border-special-pink-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${100}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-pink-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'100'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 활용(Use & Apply) */}
          <div className="flex w-[500px] flex-col">
            <div className="txt-st-bold text-center">목표 영역별 성숙도</div>
            <div className="flex flex-col gap-5">
              <div className="h-[500px] w-full">그래프 영역</div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-blue-500">* </span>전략·리더십
                  </div>
                  <div
                    className="border-special-blue-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${80}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-blue-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'80'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-blue-500">* </span>운영체계·확산
                  </div>
                  <div
                    className="border-special-blue-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${25}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-blue-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'25'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-blue-500">* </span>업무 적용
                  </div>
                  <div
                    className="border-special-blue-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${100}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-blue-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'100'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-[50px] py-1.5">
                  <div className="txt-b-bold">
                    <span className="text-special-blue-500">* </span>데이터·시스템 기반
                  </div>
                  <div
                    className="border-special-blue-500 relative h-9 w-[400px] overflow-hidden rounded-[12px] border-3"
                    style={{ '--progress': `${100}%` } as React.CSSProperties}
                  >
                    <div className="bg-special-blue-500/20 absolute inset-y-0 left-0 h-full w-(--progress)" />
                    <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                      {'100'}점
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 rounded-[20px] border border-gray-500 bg-white px-[50px] py-[30px] shadow">
          <div className="txt-st-bold">
            <span className="text-purple-700">* </span>
            검사 결과 요약
          </div>
          <ul className="list-outside list-decimal pl-5 text-black marker:text-black">
            <li>
              현재 우리 조직의 AX 성숙도는 <span className="txt-b-bold">{'도입(Initiation)'}</span>
              단계 이며, 목표 성숙도는 <span className="txt-b-bold">{'통합(Integration)'}</span>단계
              입니다.
            </li>
            <li>
              현재 성숙도가 목표 성숙도보다 충분히 낮아, 현재 수준을 넘어 더 높은 단계로의 성장과
              고도화를 기대하는 경향이 확인되었습니다.
            </li>
            <li>
              현재와 목표 간 차이에서는{' '}
              <span className="txt-b-bold">{'업무 적용, 데이터·시스템 기반'}</span> 영역의 우선 개선
              필요성이 크게 나타났습니다.
            </li>
            <li>
              목표 단계 도달을 위해{' '}
              <span className="txt-b-bold">
                {'실무 적용 중심의 학습과 반복 가능한 활용 사례 확보가 필요합니다.'}
              </span>
            </li>
          </ul>
        </div>
      </Section>
      <Section className="max-w-[1000px] shrink-0">
        <div className="flex w-[700px] items-center justify-between">
          <div className="flex items-center gap-4">
            <BadgeCheck className="size-10 text-white" fill="#533699" />
            <span className="txt-t1">역량 등급 통계</span>
          </div>
          <HelpCircle
            className="text-special-dark-blue-900 size-9"
            onClick={() => setOpenGradeStatGuideModal(true)}
          />
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-red-300 bg-red-500 py-5 text-white">
            <div className="flex items-center gap-1">
              <BadgeCheck className="size-5 text-red-500" fill="white" />
              <span className="txt-b-bold">이해</span>
            </div>
            <div className="txt-t2">{'등급'}</div>
          </div>
          <div className="border-special-blue-300 bg-special-blue-500 flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 py-5 text-white">
            <div className="flex items-center gap-1">
              <BadgeCheck className="text-special-blue-500 size-5" fill="white" />
              <span className="txt-b-bold">활용</span>
            </div>
            <div className="txt-t2">{'등급'}</div>
          </div>
          <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-purple-300 bg-purple-700 py-5 text-white">
            <div className="flex items-center gap-1">
              <BadgeCheck className="size-5 text-purple-700" fill="white" />
              <span className="txt-b-bold">평가·개선</span>
            </div>
            <div className="txt-t2">{'등급'}</div>
          </div>
          <div className="flex w-[160px] flex-col items-center gap-2.5 rounded-[20px] border-3 border-gray-300 bg-gray-700 py-5 text-white">
            <div className="flex items-center gap-1">
              <BadgeCheck className="size-5 text-gray-700" fill="white" />
              <span className="txt-b-bold">책임·거버넌스</span>
            </div>
            <div className="txt-t2">{'등급'}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-y-[50px]">
          {stats.competencyStats.map((stat) => (
            <CompetencyLevelChart key={stat.competencyCode} stat={stat} />
          ))}
        </div>
      </Section>
      <Section className="max-w-[1000px] shrink-0">
        <div className="flex w-[700px] items-center justify-between">
          <div className="flex items-center gap-4">
            <BadgeCheck className="size-10 text-white" fill="#533699" />
            <span className="txt-t1">역량 점수 통계(전체 평균)</span>
          </div>
          <HelpCircle
            className="text-special-dark-blue-900 size-9"
            onClick={() => setOpenScoreStatGuideModal(true)}
          />
        </div>
        <div className="flex w-full flex-col gap-[30px]">
          <div className="flex w-full max-w-[900px] flex-col gap-[30px]">
            <div>
              <div className="flex items-end justify-center gap-2.5">
                <div className="flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                  <span className="txt-b-bold text-center">{stats.scoreStats.seAvg}</span>
                  <div
                    className="bg-special-dark-blue-200 border-special-dark-blue-100 w-full rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                    style={{ height: `${stats.scoreStats.seAvg}%` }}
                  />
                </div>
                <div className="w-[50px] lg:w-[120px]">
                  <div
                    className={`txt-b-bold flex h-[100px] flex-col text-center ${stats.scoreStats.gapSrAvg > 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    <span>Gap_SR</span>
                    <span>
                      ({stats.scoreStats.gapSrAvg > 0 ? '+' : ''}{' '}
                      {stats.scoreStats.gapSrAvg.toFixed(1)})
                    </span>
                  </div>
                </div>
                <div className="flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                  <span className="txt-b-bold text-center">{stats.scoreStats.sjAvg}</span>
                  <div
                    className="bg-special-dark-blue-400 border-special-dark-blue-100 w-full rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                    style={{ height: `${stats.scoreStats.sjAvg}%` }}
                  />
                </div>
                <div className="w-[50px] lg:w-[120px]">
                  <div
                    className={`txt-b-bold flex h-[100px] flex-col text-center ${stats.scoreStats.gapSbAvg > 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    <span>Gap_SB</span>
                    <span>
                      ({stats.scoreStats.gapSbAvg > 0 ? '+' : ''}{' '}
                      {stats.scoreStats.gapSbAvg.toFixed(1)})
                    </span>
                  </div>
                </div>
                <div className="flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                  <span className="txt-b-bold text-center">{stats.scoreStats.bhAvg}</span>
                  <div
                    className="bg-special-dark-blue-600 border-special-dark-blue-100 w-full rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                    style={{ height: `${stats.scoreStats.bhAvg}%` }}
                  />
                </div>
              </div>
              <div className="h-[3px] w-full rounded-full bg-gray-500" />
              <div className="txt-st2-bold mt-5 flex items-center justify-center gap-[170px] text-center">
                <div>
                  자기 평가(SE)
                  <br />
                  (종합)
                </div>
                <div>
                  상황 판단(SJ)
                  <br />
                  (종합)
                </div>
                <div>
                  행동 빈도(BH)
                  <br />
                  (종합)
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <div className="txt-st-bold">
                  <span className="text-purple-700">* </span>
                  Gap_SR (SE − SJ)
                </div>
                <div>
                  자기평가(Self-Estimate)와 상황판단(Situational Judgment)의 차이입니다.
                  <br />
                  <span className="txt-b-bold text-green-600">[양수(+)]</span> 자기평가가
                  상황판단보다 높아, 자신감이 실제 판단보다 앞서는 경향이 있습니다.
                  <br />
                  <span className="txt-b-bold text-red-500">[음수(−)]</span> 상황판단이 자기평가보다
                  높아, 스스로를 보수적으로 평가하거나 실제 판단이 더 강한 경향이 있습니다.
                </div>
              </div>
              <div>
                <div className="txt-st-bold">
                  <span className="text-purple-700">* </span>
                  Gap_SB (SJ − BH)
                </div>
                <div>
                  상황판단(Situational Judgment)과 행동빈도(Behavior Habit)의 차이입니다.
                  <br />
                  <span className="txt-b-bold text-green-600">[양수(+)]</span> 상황판단이
                  행동빈도보다 높아, 판단은 좋지만 실사용/실행이 부족한 경향이 있습니다.
                  <br />
                  <span className="txt-b-bold text-red-500">[음수(−)]</span> 행동빈도가 상황판단보다
                  높아, 실행은 많지만 판단·검증이 따라오지 않을 수 있는 경향이 있습니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-y-[50px]">
          {stats.competencyStats.map((competency) => {
            const color = COMPETENCY_COLOR_MAP[competency.competencyCode];
            return (
              <div key={competency.competencyCode} className="flex w-[300px] flex-col lg:w-[500px]">
                <div className="txt-st-bold text-center">
                  {COMPETENCY_NAME_MAP[competency.competencyCode]}
                </div>
                <div className="flex flex-col gap-5">
                  <div className="h-[300px] w-full lg:h-[500px]">
                    <RadarChart
                      seScore={competency.seAvg}
                      sjScore={competency.sjAvg}
                      bhScore={competency.bhAvg}
                      strokeColor={color?.hex ?? '#8b5cff'}
                    />
                  </div>
                  <div className="flex flex-col">
                    {competency.tags.map((tag) => (
                      <div
                        key={tag.tagCode}
                        className="flex flex-col gap-1.5 px-5 py-1.5 lg:px-[50px]"
                      >
                        <div className="txt-b-bold">
                          <span className={color?.text}>* </span>
                          {tag.tagName}
                        </div>
                        <div
                          className={`${color?.border} relative h-9 w-full overflow-hidden rounded-[12px] border-3`}
                          style={{ '--progress': `${tag.avgScore}%` } as React.CSSProperties}
                        >
                          <div
                            className={`${color?.bg} absolute inset-y-0 left-0 h-full w-(--progress)`}
                          />
                          <span className="txt-b-bold absolute inset-0 flex items-center justify-center">
                            {tag.avgScore}점
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <span>0</span>
                          <span>50</span>
                          <span>100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
      <Section className="max-w-[700px] shrink-0">
        <div className="flex w-[700px] items-center justify-between">
          <div className="flex items-center gap-4">
            <ContactRound className="size-10 text-purple-700" />
            <span className="txt-t1">프로필 유형 통계</span>
          </div>
          <HelpCircle
            className="text-special-dark-blue-900 size-9"
            onClick={() => setOpenProfileTypeStatGuideModal(true)}
          />
        </div>
        <div className="h-[500px] w-[500px]">
          <ProfileRadarChart profileRatios={stats.profileStats.profileRatios} />
        </div>
        <div className="flex items-center justify-center gap-4">
          {stats.profileStats.top3ProfileTypes.map((type, index) => (
            <Button
              key={type}
              className="flex h-fit w-[160px] flex-col gap-2.5 py-5 text-white"
              variant={selectedProfileIndex === index ? 'purple' : 'gray'}
              onClick={() => setSelectedProfileIndex(index)}
            >
              <div className="flex items-center gap-1">
                <Trophy className="size-4.5" />
                <span className="txt-b-bold">{index + 1}순위</span>
              </div>
              <div className="txt-t2">{PROFILE_TYPE_LABEL[type]}</div>
            </Button>
          ))}
        </div>
        <ProfileResultCard type={stats.profileStats.top3ProfileTypes[selectedProfileIndex]} />
      </Section>
      <Section className="max-w-[1000px] shrink-0">
        <div className="flex w-[700px] items-center justify-between">
          <div className="flex items-center gap-4">
            <Map className="size-10 text-purple-700" />
            <span className="txt-t1">기관 추천 학습 로드맵</span>
          </div>
          <HelpCircle
            className="text-special-dark-blue-900 size-9"
            onClick={() => setOpenLearningRoadmapGuideModal(true)}
          />
        </div>
        <div className="flex w-full flex-col gap-6 rounded-[20px] border border-gray-500 p-6 shadow">
          <div className="flex w-full gap-4">
            <Button
              variant={selectedRoadmap === 'overall' ? 'purple' : 'gray'}
              className="txt-t3 h-20 flex-1"
              onClick={() => setSelectedRoadmap('overall')}
            >
              전체({stats.memberExamCount}명)
            </Button>
            <Button
              variant={selectedRoadmap === 'beginnerElementary' ? 'purple' : 'gray'}
              className="txt-t3 h-20 flex-1"
              onClick={() => setSelectedRoadmap('beginnerElementary')}
            >
              입문-초급
            </Button>
            <Button
              variant={selectedRoadmap === 'intermediateAdvanced' ? 'purple' : 'gray'}
              className="txt-t3 h-20 flex-1"
              onClick={() => setSelectedRoadmap('intermediateAdvanced')}
            >
              중급-고급
            </Button>
          </div>
        </div>

        {roadmap.steps.map((step, index) => (
          <div
            key={step.stepId}
            className="flex w-full flex-col items-center gap-[50px] lg:gap-[75px]"
          >
            <div className="h-[3px] w-full rounded-full bg-purple-700" />
            <div className="flex w-full max-w-[700px] flex-col gap-2.5">
              <div className="txt-st-bold">
                <span className="text-purple-700">* </span>
                <span>Step {index + 1}. </span>
                <span>{step.stepName}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="txt-b-bold text-purple-700">[커리큘럼 가이드]</div>
                <div className="flex flex-col gap-2.5">
                  {step.curriculumItems.map((curriculumItem) => (
                    <CurriculumItem
                      key={curriculumItem.curriculumName}
                      level={curriculumItem.step}
                      type={curriculumItem.role}
                      title={curriculumItem.curriculumName}
                      duration={curriculumItem.durationHour.toString()}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="txt-b-bold text-purple-700">[프로필 유형별 학습 Tip]</div>
                <ul className="txt-b-regular flex list-outside list-disc flex-col gap-2.5 pl-5 text-black marker:text-black">
                  {step.learningTips.map((tip) => (
                    <li key={tip} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-full max-w-[1000px]">
              <CurriculumTreeChart
                activeNodes={step.curriculumTree.nodes}
                activeEdges={step.curriculumTree.edges}
              />
            </div>
          </div>
        ))}
      </Section>
      <div className="h-[3px] w-full max-w-[1000px] rounded-full bg-purple-700" />
      <Button render={<Link href="/" />} variant="gray">
        메인으로
      </Button>
    </Container>
  );
}

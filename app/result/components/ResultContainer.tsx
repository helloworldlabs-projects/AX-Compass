'use client';

import Container from '@/components/layout/Container';
import { CompassIcon } from '@/components/icons/CompassIcon';
import Image from 'next/image';
import Section from '@/components/layout/Section';
import Link from 'next/link';
import { BadgeCheck, ContactRound, HelpCircle, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LevelCompetencyCell } from '@/components/ui/LevelCompetencyCell';
import type { ExamResultDTO } from '@/types/exam';
import { PROFILE_TYPE_LABEL } from '@/constants/profileTypeConfig';
import { ProfileResultCard } from '@/components/ui/ProfileResultCard';
import { CurriculumItem } from '@/components/ui/CurriculumItem';
import { InquiryModal } from '@/components/modals/InquiryModal';
import { RadarChart } from '@/components/ui/RadarChart';
import { ResultCodeCard } from '@/app/result/components/ResultCodeCard';
import { ScoreStatGuideModal } from '@/app/result/components/modal/ScoreStatGuideModal';
import { ProfileTypeGuideModal } from '@/app/result/components/modal/ProfileTypeGuideModal';
import { LearningRoadmapGuideModal } from '@/app/result/components/modal/LearningRoadmapGuideModal';
import { CurriculumTreeChart } from '@/components/shared/CurriculumTreeChart';
import { useState } from 'react';
import { COMPETENCY_COLOR_MAP } from '@/constants/competencyConfig';

interface ResultContainerProps {
  resultType: 'general' | 'member';
  result: ExamResultDTO;
}

export default function ResultContainer({ resultType, result }: ResultContainerProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [scoreStatGuideOpen, setScoreStatGuideOpen] = useState(false);
  const [profileTypeGuideOpen, setProfileTypeGuideOpen] = useState(false);
  const [roadmapGuideOpen, setRoadmapGuideOpen] = useState(false);
  return (
    <Container>
      <div className="bg-gray-0 flex w-full flex-col gap-3 rounded-[20px] border border-gray-100 p-3">
        <div className="bg-special-dark-blue-700 border-special-dark-blue-300 flex w-fit items-center gap-2 rounded-[12px] border-2 px-3 py-2">
          <CompassIcon className="size-4.5 text-white" fillOpacity="1" />
          <span className="txt-c1-bold text-white">공식 인증</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Image
            src="/images/logo/img_logo_helloworldlabs.png"
            alt=""
            width={300}
            height={30}
            className="h-[30px] w-[300px] object-contain"
          />
          <div className="txt-st2-bold text-black">에서 인증하는 공식 결과입니다.</div>
        </div>
        <div className="text-center">본 문서는 AX Compass 진단 결과를 바탕으로 생성되었습니다.</div>
        <div className="txt-c2-regular flex items-center justify-end gap-2">
          <span>발급일: {result.computedAt.split('T')[0].replace(/-/g, '.')}</span>
          <div>|</div>
          <span>결과 코드: {result.resultCode}</span>
          <div>|</div>
          <span>발급 기관: (주)헬로월드랩스</span>
        </div>
      </div>
      <Section className="w-full max-w-[700px]">
        <div className="w-full">
          <div>
            <span className="txt-t1 mr-1.5">{result.userName}</span>
            <span className="txt-st-bold">님의</span>
          </div>
          <div className="txt-st2-regular">인공지능 역량 진단 결과 입니다.</div>
        </div>
        <div className="flex items-center justify-center gap-6 text-white lg:gap-[50px]">
          <div className="flex w-[140px] flex-col items-center gap-2.5 rounded-[12px] border-3 border-purple-300 bg-purple-700 py-5 shadow lg:w-[160px]">
            <div className="flex items-center gap-1">
              <BadgeCheck className="size-5" />
              <span className="txt-b-bold">종합 역량 등급</span>
            </div>
            <div className="txt-t2">{result.overallLevel}</div>
          </div>
          <div className="flex w-[140px] flex-col items-center gap-2.5 rounded-[12px] border-3 border-purple-300 bg-purple-700 py-5 shadow lg:w-[160px]">
            <div className="flex items-center gap-1">
              <BadgeCheck className="size-5" />
              <span className="txt-b-bold">종합 역량 등급</span>
            </div>
            <div className="txt-t2">{PROFILE_TYPE_LABEL[result.profileType]}</div>
          </div>
        </div>
        <ResultCodeCard resultCode={result.resultCode} />
        <div className="rounded-card flex flex-col gap-[30px] border border-gray-500 bg-white px-2.5 py-[50px] lg:px-[50px]">
          {result.competencies.map((competency) => (
            <LevelCompetencyCell
              key={competency.competencyCode}
              level={competency.level}
              categoryTitle={competency.competencyName}
              categorySummary={competency.intro}
              description={competency.levelFeedback}
            />
          ))}
        </div>
      </Section>
      <Section className="max-w-[700px] lg:max-w-[1000px]">
        <div className="flex w-full max-w-[700px] items-center justify-between">
          <div className="flex items-center gap-4">
            <BadgeCheck className="size-10 text-white" fill="#533699" />
            <span className="txt-t1">역량 점수 통계</span>
          </div>
          <HelpCircle
            className="text-special-dark-blue-900 size-9 cursor-pointer"
            onClick={() => setScoreStatGuideOpen(true)}
          />
        </div>
        {resultType === 'member' && (
          <div className="flex w-full max-w-[900px] flex-col gap-[30px]">
            <div className="mx-auto max-w-[340px] lg:max-w-[900px]">
              <div className="flex items-end justify-center gap-2.5">
                <div className="flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                  <span className="txt-b-bold text-center">{result.scoreStats.seScore}</span>
                  <div
                    className="bg-special-dark-blue-200 border-special-dark-blue-100 w-full rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                    style={{ height: `${result.scoreStats.seScore}%` }}
                  />
                </div>
                <div className="w-[50px] lg:w-[120px]">
                  <div
                    className={`txt-b-bold flex h-[100px] flex-col text-center ${result.scoreStats.gapSr > 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    <span>Gap_SR</span>
                    <span>
                      ({result.scoreStats.gapSr > 0 ? '+' : ''} {result.scoreStats.gapSr.toFixed(1)}
                      )
                    </span>
                  </div>
                </div>
                <div className="flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                  <span className="txt-b-bold text-center">{result.scoreStats.sjScore}</span>
                  <div
                    className="bg-special-dark-blue-400 border-special-dark-blue-100 w-full rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                    style={{ height: `${result.scoreStats.sjScore}%` }}
                  />
                </div>
                <div className="w-[50px] lg:w-[120px]">
                  <div
                    className={`txt-b-bold flex h-[100px] flex-col text-center ${result.scoreStats.gapSb > 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    <span>Gap_SB</span>
                    <span>
                      ({result.scoreStats.gapSb > 0 ? '+' : ''} {result.scoreStats.gapSb.toFixed(1)}
                      )
                    </span>
                  </div>
                </div>
                <div className="flex h-[200px] w-[60px] flex-col justify-end lg:h-[300px] lg:w-[140px]">
                  <span className="txt-b-bold text-center">{result.scoreStats.bhScore}</span>
                  <div
                    className="bg-special-dark-blue-600 border-special-dark-blue-100 w-full rounded-t-[12px] border-3 border-b-0 lg:rounded-t-[20px]"
                    style={{ height: `${result.scoreStats.bhScore}%` }}
                  />
                </div>
              </div>
              <div className="h-[3px] w-full rounded-full bg-gray-500" />
              <div className="txt-st2-bold mt-5 flex items-center justify-between text-center lg:px-6">
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
        )}
        <div className="flex flex-wrap items-center justify-center gap-y-[50px]">
          {result.competencies.map((competency) => {
            const color = COMPETENCY_COLOR_MAP[competency.competencyCode];
            return (
              <div key={competency.competencyCode} className="flex w-[300px] flex-col lg:w-[500px]">
                <div className="txt-st-bold text-center">{competency.competencyName}</div>
                <div className="flex flex-col gap-5">
                  <div className="h-[300px] w-full lg:h-[500px]">
                    <RadarChart
                      seScore={competency.seScore}
                      sjScore={competency.sjScore}
                      bhScore={competency.bhScore}
                      strokeColor={color?.hex ?? '#8b5cff'}
                    />
                  </div>
                  {resultType === 'member' && (
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
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
      <Section className="max-w-[700px]">
        <div className="flex w-full max-w-[700px] items-center justify-between">
          <div className="flex items-center gap-4">
            <ContactRound className="size-10 text-purple-700" />
            <span className="txt-t1">프로필 유형</span>
          </div>
          <HelpCircle
            className="text-special-dark-blue-900 size-9 cursor-pointer"
            onClick={() => setProfileTypeGuideOpen(true)}
          />
        </div>
        <ProfileResultCard type={result.profileType} />
      </Section>
      <Section className="max-w-[700px] lg:max-w-[1000px]">
        <div className="flex w-full max-w-[700px] items-center justify-between">
          <div className="flex items-center gap-4">
            <Map className="size-10 text-purple-700" />
            <span className="txt-t1">추천 학습 로드맵</span>
          </div>
          <HelpCircle
            className="text-special-dark-blue-900 size-9 cursor-pointer"
            onClick={() => setRoadmapGuideOpen(true)}
          />
        </div>
        {result.recommendedRoadmap.steps.map((step, index) => {
          return (
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
                    {step.curriculumItems.map((curriculumItem) => {
                      return (
                        <CurriculumItem
                          key={curriculumItem.curriculumName}
                          level={curriculumItem.step}
                          type={curriculumItem.role as '메인' | '확장' | '보조'}
                          title={curriculumItem.curriculumName}
                          duration={curriculumItem.durationHour.toString()}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="txt-b-bold text-purple-700">[프로필 유형별 학습 Tip]</div>
                  <div className="flex flex-col gap-2.5">
                    <ul className="txt-b-regular flex list-outside list-disc flex-col gap-2.5 pl-5 text-black marker:text-black">
                      {step.learningTips.map((tip) => {
                        return (
                          <li key={tip} className="leading-relaxed">
                            {tip}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-[1000px]">
                <CurriculumTreeChart
                  roadmapType="overall"
                  activeNodes={step.curriculumTree.nodes}
                  activeEdges={step.curriculumTree.edges}
                />
              </div>
            </div>
          );
        })}
        <div className="h-[3px] w-full rounded-full bg-purple-700" />
        <ResultCodeCard resultCode={result.resultCode} />
      </Section>
      <div className="flex justify-center gap-4 lg:gap-6">
        <Button render={<Link href="/" />} variant="gray">
          메인으로
        </Button>
        <Button variant="purple" onClick={() => setInquiryOpen(true)}>
          문의하기
        </Button>
      </div>
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
      <ScoreStatGuideModal
        open={scoreStatGuideOpen}
        onClose={() => setScoreStatGuideOpen(false)}
        resultType={resultType}
      />
      <ProfileTypeGuideModal
        open={profileTypeGuideOpen}
        onClose={() => setProfileTypeGuideOpen(false)}
      />
      <LearningRoadmapGuideModal
        open={roadmapGuideOpen}
        onClose={() => setRoadmapGuideOpen(false)}
      />
    </Container>
  );
}

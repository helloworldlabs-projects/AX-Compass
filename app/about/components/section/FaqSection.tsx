import Section from '@/components/layout/Section';

type FaqItem = {
  question: string;
  answers: string[];
};

const faqs: FaqItem[] = [
  {
    question: 'Q1. 회원가입이 필요한가요?',
    answers: [
      '일반 검사는 회원가입 없이 시작할 수 있습니다.',
      '기관 검사 또한 회원가입은 필요 없지만, 기관 인증코드 입력 후 시작할 수 있습니다.',
    ],
  },
  {
    question: 'Q2. 검사 결과는 어떻게 다시 확인하나요?',
    answers: [
      '검사 완료 후 결과 조회 코드가 발급됩니다.',
      '조회 코드를 복사해 두면 나중에 결과를 다시 확인할 수 있습니다.',
    ],
  },
  {
    question: 'Q3. 일반 검사와 기관 검사의 차이는 무엇인가요?',
    answers: [
      '일반 검사는 약식 문항으로 진행하고, 개인용 진단 결과를 제공합니다.',
      '기관 검사는 상세 문항으로 진행하고, 상세 진단 결과와 조직 단위 기관 리포트를 제공합니다.',
    ],
  },
  {
    question: 'Q4. 기관 인증코드는 어디서 받나요?',
    answers: [
      '문의하기를 통해 기관 정보를 보내주시면, 관리자가 확인 및 기관 등록 후 기관 담당자에게 기관 인증코드를 발급해 드립니다.',
      '기관 담당자는 발급받은 코드를 구성원에게 전달해 기관 검사를 진행할 수 있습니다.',
    ],
  },
  {
    question: 'Q5. 응답을 되돌아가서 확인하거나 수정할 수 있나요?',
    answers: [
      '검사는 문항 단위로 진행되어 이전 문항으로 되돌아가 확인하거나 수정할 수 없습니다.',
      '응답을 선택한 뒤 다음으로 진행해 주세요.',
    ],
  },
  {
    question: 'Q6. 검사 도중 나가면 저장되나요?',
    answers: ['검사 진행 중 응답은 저장되지 않습니다.', '가능하면 한 번에 집중해서 완료해 주세요.'],
  },
];

export function FaqSection() {
  return (
    <Section id="ax-faq" className="scroll-mt-[110px] lg:scroll-mt-[120px]">
      <div className="flex w-full flex-col gap-[30px]">
        <div className="txt-t2">FAQ</div>
        <div className="rounded-card flex flex-col gap-6 bg-white p-5 shadow lg:p-[30px]">
          {faqs.map((faq) => (
            <div key={faq.question} className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
              <div className="txt-st2-bold mb-1.5">{faq.question}</div>
              <div className="ml-2">
                <ul className="ml-4 flex list-outside list-disc flex-col">
                  {faq.answers.map((answer) => (
                    <li key={answer}>{answer}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div>※ 추가 문의나 기관 코드 발급 요청은 [문의하기] 로 연락해 주세요.</div>
        </div>
      </div>
    </Section>
  );
}

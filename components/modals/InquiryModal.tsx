'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  FieldLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
} from '@/components/ui/Modal';
import { TextArea } from '@/components/ui/TextArea';

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
}

interface InquiryFormState {
  company: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  inquiry: string;
  agreed: boolean;
}

function InquiryModal({ open, onClose }: InquiryModalProps) {
  const [form, setForm] = useState<InquiryFormState>({
    company: '',
    name: '',
    position: '',
    phone: '',
    email: '',
    inquiry: '',
    agreed: false,
  });

  function handleField(field: keyof Omit<InquiryFormState, 'agreed'>) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  const initialForm: InquiryFormState = {
    company: '',
    name: '',
    position: '',
    phone: '',
    email: '',
    inquiry: '',
    agreed: false,
  };

  function handleClose() {
    setForm(initialForm);
    onClose();
  }

  function handleSubmit() {
    // 제출 로직은 상위 컴포넌트에서 처리
    setForm(initialForm);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="flex flex-col gap-2.5">
        <ModalTitle>문의하기</ModalTitle>
        <ModalDescription>
          HelloworldLabs에 문의하세요.
          <br />
          아래 정보를 남겨주시면 담당자가 확인 후 연락드리겠습니다.
        </ModalDescription>
      </div>

      <ModalContent>
        <ModalBody>
          <div className="flex flex-col gap-2.5">
            <FieldLabel required>기업명</FieldLabel>
            <Input
              placeholder="회사 이름을 입력해 주세요."
              value={form.company}
              onChange={handleField('company')}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel required>담당자</FieldLabel>
            <Input
              placeholder="담당자 이름을 입력해 주세요."
              value={form.name}
              onChange={handleField('name')}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel>직급</FieldLabel>
            <Input
              placeholder="담당자 직급을 입력해 주세요."
              value={form.position}
              onChange={handleField('position')}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel required>전화번호</FieldLabel>
            <Input
              placeholder="전화번호를 입력해 주세요.(- 제외)"
              value={form.phone}
              onChange={handleField('phone')}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel required>이메일 주소</FieldLabel>
            <Input
              type="email"
              placeholder="이메일을 입력해 주세요."
              value={form.email}
              onChange={handleField('email')}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel required>문의내용</FieldLabel>
            <TextArea
              placeholder="문의 내용을 입력해 주세요."
              value={form.inquiry}
              onChange={handleField('inquiry')}
            />
          </div>
        </ModalBody>

        <div className="rounded-card flex flex-col gap-3 border-2 border-gray-100 bg-white p-3 lg:gap-4 lg:px-[30px] lg:py-4">
          <div className="mb-1 flex items-center">
            <Checkbox
              id="inquiry-privacy"
              checked={form.agreed}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, agreed: checked === true }))
              }
              label={
                <div className="txt-c1-bold flex gap-1">
                  <span className="text-red-500">[필수]</span>개인정보 수집 및 이용 동의
                </div>
              }
            />
          </div>
          <p className="txt-c1-regular bg-gray-0 rounded-[12px] p-3 text-gray-700 lg:p-4">
            회사는 문의 답변을 위해 개인정보를 수집·이용합니다.
            <br />
            1) 수집 항목: 회사명, 담당자명, 담당자 직급(선택), 전화번호, 문의내용
            <br />
            2) 이용 목적: 문의 내용 확인 및 답변, 연락/안내, 요청 자료 전달, 이력 관리
            <br />
            3) 보유·이용 기간: 문의 처리 완료 후 3개월 보관 후 파기
          </p>
        </div>
      </ModalContent>

      <ModalFooter>
        <Button variant="purple" onClick={handleSubmit}>
          문의하기
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export { InquiryModal };

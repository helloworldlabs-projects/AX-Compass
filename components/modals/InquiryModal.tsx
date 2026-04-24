'use client';

import { useState } from 'react';
import { toast } from 'sonner';

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

type InquiryErrors = Partial<Record<keyof Omit<InquiryFormState, 'agreed'>, string>>;

const INITIAL_FORM: InquiryFormState = {
  company: '',
  name: '',
  position: '',
  phone: '',
  email: '',
  inquiry: '',
  agreed: false,
};

function validate(form: InquiryFormState): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!form.agreed) {
    toast.error(
      <div>
        <p>개인정보 수집 및 이용 동의가 필요합니다.</p>
        <p>동의 후 문의하기를 진행해 주세요.</p>
      </div>,
    );
  }
  if (!form.company.trim()) errors.company = '기업명을 입력해 주세요.';
  if (!form.name.trim()) errors.name = '담당자 이름을 입력해 주세요.';
  if (!form.phone.trim()) {
    errors.phone = '전화번호를 입력해 주세요.';
  } else if (!/^\d{9,11}$/.test(form.phone)) {
    errors.phone = '숫자만 9~11자리로 입력해 주세요.';
  }
  if (!form.email.trim()) {
    errors.email = '이메일을 입력해 주세요.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.';
  }
  if (!form.inquiry.trim()) errors.inquiry = '문의 내용을 입력해 주세요.';
  return errors;
}

function InquiryModal({ open, onClose }: InquiryModalProps) {
  const [form, setForm] = useState<InquiryFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleField(field: keyof Omit<InquiryFormState, 'agreed'>) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleClose() {
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  }

  async function handleSubmit() {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: form.company,
          contact_person: form.name,
          position: form.position,
          phone_number: form.phone,
          email: form.email,
          inquiry_content: form.inquiry,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ?? '문의 전송에 실패했습니다.');
        return;
      }

      toast.success('문의가 성공적으로 등록되었습니다.');
      setForm(INITIAL_FORM);
      setErrors({});
      onClose();
    } catch {
      toast.error('문의 전송 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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
              error={errors.company}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel required>담당자</FieldLabel>
            <Input
              placeholder="담당자 이름을 입력해 주세요."
              value={form.name}
              onChange={handleField('name')}
              error={errors.name}
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
              error={errors.phone}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel required>이메일 주소</FieldLabel>
            <Input
              type="email"
              placeholder="이메일을 입력해 주세요."
              value={form.email}
              onChange={handleField('email')}
              error={errors.email}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel required>문의내용</FieldLabel>
            <TextArea
              placeholder="문의 내용을 입력해 주세요."
              value={form.inquiry}
              onChange={handleField('inquiry')}
              error={errors.inquiry}
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
        <Button variant="purple" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? '전송 중...' : '문의하기'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export { InquiryModal };

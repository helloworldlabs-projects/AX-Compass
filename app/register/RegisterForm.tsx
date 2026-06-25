'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronUp, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldLabel } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

import { RegisterCompleteView } from './_components/RegisterCompleteView';

// ─── 상수 ────────────────────────────────────────────────────────────────────

const TIMER_SECONDS = 5 * 60;
const CODE_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOCK_VERIFICATION_CODE = '123456';

const AUTH_MESSAGES = {
  emailRequired: '이메일을 입력해 주세요.',
  emailInvalid: '올바른 이메일 주소를 입력해 주세요.',
  codeRequestRequired: '인증번호를 먼저 요청해 주세요.',
  codeVerifyRequired: '이메일 인증을 완료한 뒤 진행해 주세요.',
  codeExpired: '인증 시간이 만료되었습니다. 인증번호를 다시 요청해 주세요.',
  codeMismatch: '인증번호가 일치하지 않습니다. 다시 입력해 주세요.',
  codeVerified: '이메일 인증이 완료되었습니다.',
  submitAuthRequired: '회원가입을 위해 이메일 인증을 먼저 완료해 주세요.',
} as const;

const FORM_VALIDATION_TOAST = '입력한 정보를 확인해 주세요.';

const BUSINESS_TYPE_OPTIONS = [
  '제조',
  '서비스',
  '도소매',
  '건설',
  '금융/보험',
  'IT/소프트웨어',
  '교육',
  '의료/보건',
  '운수',
  '부동산',
  '기타',
];

const BUSINESS_CATEGORY_OPTIONS = [
  '소프트웨어 개발',
  '경영 컨설팅',
  '광고/마케팅',
  '식품',
  '의류',
  '운수/물류',
  '부동산 중개',
  '의료 서비스',
  '교육 서비스',
  '기타',
];

// ─── 타입 ────────────────────────────────────────────────────────────────────

type Step1Errors = Partial<
  Record<
    | 'institutionName'
    | 'institutionNameEn'
    | 'representativeName'
    | 'businessNumber'
    | 'businessType'
    | 'businessCategory'
    | 'logo',
    string
  >
>;

type Step2Errors = Partial<
  Record<
    | 'email'
    | 'verificationCode'
    | 'operatorName'
    | 'password'
    | 'confirmPassword'
    | 'department'
    | 'position'
    | 'terms',
    string
  >
>;

// ─── 유틸 ────────────────────────────────────────────────────────────────────

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── StepTab ─────────────────────────────────────────────────────────────────

interface StepTabProps {
  step: number;
  label: string;
  active: boolean;
}

function StepTab({ step, label, active }: StepTabProps) {
  return (
    <div
      className={cn(
        'flex h-[60px] min-w-[140px] flex-col justify-center rounded-[12px] border-2 px-6 text-white shadow',
        active
          ? 'bg-special-dark-blue-500 border-special-dark-blue-100'
          : 'border-gray-100 bg-gray-500',
      )}
    >
      <span className="txt-b-bold">Step {step}.</span>
      <span className="txt-b-regular">{label}</span>
    </div>
  );
}

// ─── RegisterForm ─────────────────────────────────────────────────────────────

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isComplete = searchParams.has('complete');

  // ── 공통 상태 ──
  const [step, setStep] = useState<1 | 2>(1);

  // ── Step 1 상태 ──
  const [institutionName, setInstitutionName] = useState('');
  const [institutionNameEn, setInstitutionNameEn] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [step1Errors, setStep1Errors] = useState<Step1Errors>({});

  // ── Step 2 상태 ──
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyNoticeOpen, setPrivacyNoticeOpen] = useState(true);
  const [codeRequested, setCodeRequested] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [step2Errors, setStep2Errors] = useState<Step2Errors>({});

  // ── 타이머 ──
  useEffect(() => {
    if (timerSeconds <= 0) return;
    const id = setInterval(() => setTimerSeconds((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(id);
  }, [timerSeconds]);

  // ─── Step 1 핸들러 ──────────────────────────────────────────────────────────

  function clearStep1Error(key: keyof Step1Errors) {
    setStep1Errors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    if (file) clearStep1Error('logo');
  }

  function handleStep1Next() {
    const errors: Step1Errors = {};
    if (!institutionName.trim()) errors.institutionName = '기관명을 입력해 주세요.';
    if (!institutionNameEn.trim()) errors.institutionNameEn = '기관 영문명을 입력해 주세요.';
    if (!representativeName.trim()) errors.representativeName = '대표자명을 입력해 주세요.';
    if (!businessNumber.trim()) errors.businessNumber = '사업자 등록번호를 입력해 주세요.';
    if (!businessType) errors.businessType = '업태를 선택해 주세요.';
    if (!businessCategory) errors.businessCategory = '업종을 선택해 주세요.';
    if (!logoFile) errors.logo = '로고 파일을 업로드해 주세요.';

    if (Object.keys(errors).length > 0) {
      setStep1Errors(errors);
      toast.error(FORM_VALIDATION_TOAST);
      return;
    }

    setStep(2);
  }

  // ─── Step 2 핸들러 ──────────────────────────────────────────────────────────

  function clearStep2Error(key: keyof Step2Errors) {
    setStep2Errors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleRequestCode() {
    if (!email.trim()) {
      setStep2Errors((prev) => ({ ...prev, email: AUTH_MESSAGES.emailRequired }));
      toast.error(FORM_VALIDATION_TOAST);
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setStep2Errors((prev) => ({ ...prev, email: AUTH_MESSAGES.emailInvalid }));
      toast.error(FORM_VALIDATION_TOAST);
      return;
    }
    setCodeRequested(true);
    setCodeVerified(false);
    setVerificationCode('');
    setTimerSeconds(TIMER_SECONDS);
    setStep2Errors((prev) => {
      const next = { ...prev };
      delete next.email;
      delete next.verificationCode;
      return next;
    });
  }

  function verifyCode(code: string) {
    if (code.length !== CODE_LENGTH || codeVerified) return;
    if (timerSeconds <= 0) {
      setStep2Errors((prev) => ({ ...prev, verificationCode: AUTH_MESSAGES.codeExpired }));
      toast.error(AUTH_MESSAGES.codeExpired);
      return;
    }
    if (code !== MOCK_VERIFICATION_CODE) {
      setStep2Errors((prev) => ({ ...prev, verificationCode: AUTH_MESSAGES.codeMismatch }));
      toast.error(AUTH_MESSAGES.codeMismatch);
      return;
    }
    setCodeVerified(true);
    setStep2Errors((prev) => {
      const next = { ...prev };
      delete next.verificationCode;
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errors: Step2Errors = {};

    if (!email.trim()) {
      errors.email = AUTH_MESSAGES.emailRequired;
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = AUTH_MESSAGES.emailInvalid;
    }

    if (!codeRequested) {
      errors.verificationCode = AUTH_MESSAGES.codeRequestRequired;
    } else if (!codeVerified) {
      errors.verificationCode = AUTH_MESSAGES.codeVerifyRequired;
    }

    if (!operatorName.trim()) errors.operatorName = '운영자명을 입력해 주세요.';
    if (!password) {
      errors.password = '비밀번호를 입력해 주세요.';
    } else if (password.length < 8) {
      errors.password = '비밀번호는 8자 이상이어야 합니다.';
    }
    if (!confirmPassword) {
      errors.confirmPassword = '비밀번호 확인을 입력해 주세요.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    if (!department.trim()) errors.department = '소속을 입력해 주세요.';
    if (!position.trim()) errors.position = '직책을 입력해 주세요.';
    if (!termsAgreed) errors.terms = '이용약관에 동의해 주세요.';

    if (Object.keys(errors).length > 0) {
      setStep2Errors(errors);
      if (errors.verificationCode) {
        toast.error(AUTH_MESSAGES.submitAuthRequired);
      } else {
        toast.error(FORM_VALIDATION_TOAST);
      }
      return;
    }

    router.replace('/register?complete');
  }

  // ─── 렌더 ────────────────────────────────────────────────────────────────────

  if (isComplete) {
    return <RegisterCompleteView />;
  }

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col gap-6">
      {/* Stepper */}
      <div className="flex justify-center gap-3">
        <StepTab step={1} label="기관 정보 입력" active={step === 1} />
        <StepTab step={2} label="운영자 정보 입력" active={step === 2} />
      </div>

      {/* 흰색 카드 */}
      <div className="flex w-full flex-col gap-6 rounded-[20px] bg-white px-6 py-[50px] shadow lg:px-[50px]">
        {/* 카드 헤더 */}
        <div className="flex flex-col">
          <h1 className="txt-t1">환영합니다!</h1>
          <p className="txt-b-regular text-gray-700">
            {step === 1 ? '기관 정보를 입력해 주세요.' : '운영자 정보를 입력해 주세요.'}
          </p>
        </div>
        <div className="h-px bg-gray-100" />

        {/* ── Step 1 ── */}
        {step === 1 && (
          <>
            <div className="flex flex-col gap-[30px]">
              {/* 기관명 */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>기관명</FieldLabel>
                <Input
                  placeholder="기관 이름을 입력해 주세요."
                  value={institutionName}
                  onChange={(v) => {
                    setInstitutionName(v);
                    clearStep1Error('institutionName');
                  }}
                  error={step1Errors.institutionName}
                />
              </div>

              {/* 기관 영문명 */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>기관영문명</FieldLabel>
                <Input
                  placeholder="영문 소문자로 공백 없이 입력해 주세요."
                  value={institutionNameEn}
                  onChange={(v) => {
                    setInstitutionNameEn(v);
                    clearStep1Error('institutionNameEn');
                  }}
                  error={step1Errors.institutionNameEn}
                />
              </div>

              {/* 대표자명 */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>대표자명</FieldLabel>
                <Input
                  placeholder="대표자 이름을 입력해 주세요."
                  value={representativeName}
                  onChange={(v) => {
                    setRepresentativeName(v);
                    clearStep1Error('representativeName');
                  }}
                  error={step1Errors.representativeName}
                />
              </div>

              {/* 사업자 등록번호 */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>사업자 등록번호</FieldLabel>
                <Input
                  inputMode="numeric"
                  placeholder="사업자 등록번호를 입력해 주세요(숫자만)."
                  value={businessNumber}
                  onChange={(v) => {
                    const digits = v.replace(/\D/g, '');
                    setBusinessNumber(digits);
                    clearStep1Error('businessNumber');
                  }}
                  error={step1Errors.businessNumber}
                />
              </div>

              {/* 기관 전화번호 (선택) */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel>기관 전화번호</FieldLabel>
                <Input
                  inputMode="tel"
                  placeholder="전화번호를 입력해 주세요(숫자만)."
                  value={phoneNumber}
                  onChange={(v) => {
                    const digits = v.replace(/\D/g, '');
                    setPhoneNumber(digits);
                  }}
                />
              </div>

              {/* 업태 */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>업태</FieldLabel>
                <Select
                  value={businessType}
                  onValueChange={(v) => {
                    if (v) setBusinessType(v);
                    clearStep1Error('businessType');
                  }}
                >
                  <SelectTrigger variant="field" aria-label="업태 선택">
                    <SelectValue placeholder="업태를 검색해 주세요." />
                  </SelectTrigger>
                  <SelectContent variant="field" alignItemWithTrigger={false}>
                    {BUSINESS_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt} variant="field">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {step1Errors.businessType && (
                  <p className="txt-c1-bold text-red-500">{step1Errors.businessType}</p>
                )}
              </div>

              {/* 업종 */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>업종</FieldLabel>
                <Select
                  value={businessCategory}
                  onValueChange={(v) => {
                    if (v) setBusinessCategory(v);
                    clearStep1Error('businessCategory');
                  }}
                >
                  <SelectTrigger variant="field" aria-label="업종 선택">
                    <SelectValue placeholder="업종을 검색해 주세요." />
                  </SelectTrigger>
                  <SelectContent variant="field" alignItemWithTrigger={false}>
                    {BUSINESS_CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt} variant="field">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {step1Errors.businessCategory && (
                  <p className="txt-c1-bold text-red-500">{step1Errors.businessCategory}</p>
                )}
              </div>

              {/* 로고 */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 pt-1">
                  <FieldLabel required>로고</FieldLabel>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="navy"
                    className="w-fit"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="size-4" aria-hidden />
                    파일 업로드
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                    aria-label="로고 파일 선택"
                    onChange={handleLogoChange}
                  />
                  {logoFile ? (
                    <p className="txt-c1-regular text-gray-700">{logoFile.name}</p>
                  ) : (
                    <p className="txt-c1-regular text-gray-700">
                      PNG 또는 JPG 파일을 업로드해주세요.
                      <br />
                      기준 사이즈 180px(최대) * 60px(최대), 1MB 미만 파일 업로드
                    </p>
                  )}
                  {step1Errors.logo && (
                    <p className="txt-c1-bold text-red-500">{step1Errors.logo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 1 하단 버튼 */}
            <div className="h-px bg-gray-100" />
            <div className="flex justify-center gap-3">
              <Button render={<Link href="/" />} variant="gray">
                메인으로
              </Button>
              <Button type="button" variant="purple" onClick={handleStep1Next}>
                운영자 정보 입력
              </Button>
            </div>
          </>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <>
            <form id="register-form" onSubmit={handleSubmit} className="flex flex-col gap-[30px]">
              {/* 아이디(이메일) */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>아이디(이메일)</FieldLabel>
                <Input
                  type="email"
                  placeholder="이메일을 입력해 주세요."
                  value={email}
                  onChange={(v) => {
                    setEmail(v);
                    clearStep2Error('email');
                  }}
                  disabled={codeRequested && timerSeconds > 0}
                  error={step2Errors.email}
                />
              </div>

              {/* 인증번호 요청 버튼 */}
              <Button
                type="button"
                variant={codeRequested && timerSeconds > 0 ? 'gray' : 'purple'}
                className="w-fit"
                onClick={handleRequestCode}
              >
                인증번호 요청
              </Button>
              {step2Errors.verificationCode && !codeRequested && (
                <p role="alert" className="txt-c1-bold -mt-4 text-red-500">
                  {step2Errors.verificationCode}
                </p>
              )}

              {/* 인증번호 확인 */}
              {codeRequested && (
                <div className="flex flex-col gap-2.5 lg:gap-3">
                  <p className="txt-c1-bold text-gray-500">인증번호 확인</p>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={CODE_LENGTH}
                    placeholder="인증번호 6자리"
                    value={verificationCode}
                    onChange={(v) => {
                      const digits = v.replace(/\D/g, '').slice(0, CODE_LENGTH);
                      setVerificationCode(digits);
                      clearStep2Error('verificationCode');
                      if (codeVerified) setCodeVerified(false);
                      if (digits.length === CODE_LENGTH) verifyCode(digits);
                    }}
                    disabled={codeVerified || timerSeconds <= 0}
                    error={step2Errors.verificationCode}
                    suffix={
                      timerSeconds > 0 && !codeVerified ? (
                        <span className="txt-b-regular text-special-orange-500">
                          {formatTimer(timerSeconds)}
                        </span>
                      ) : undefined
                    }
                  />
                  {codeVerified && (
                    <p className="txt-c1-bold text-gray-700">{AUTH_MESSAGES.codeVerified}</p>
                  )}
                  {timerSeconds <= 0 && !codeVerified && (
                    <p className="txt-c1-bold text-red-500">{AUTH_MESSAGES.codeExpired}</p>
                  )}
                </div>
              )}

              {/* 운영자명 */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>운영자명</FieldLabel>
                <Input
                  placeholder="운영자 이름을 입력해 주세요."
                  value={operatorName}
                  onChange={(v) => {
                    setOperatorName(v);
                    clearStep2Error('operatorName');
                  }}
                  error={step2Errors.operatorName}
                />
              </div>

              {/* 비밀번호 */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>비밀번호</FieldLabel>
                <Input
                  type="password"
                  placeholder="비밀번호를 입력해 주세요."
                  value={password}
                  onChange={(v) => {
                    setPassword(v);
                    clearStep2Error('password');
                    if (confirmPassword) {
                      setStep2Errors((prev) => {
                        const next = { ...prev };
                        if (v !== confirmPassword) {
                          next.confirmPassword = '비밀번호가 일치하지 않습니다.';
                        } else {
                          delete next.confirmPassword;
                        }
                        return next;
                      });
                    }
                  }}
                  error={step2Errors.password}
                />
              </div>

              {/* 비밀번호 확인 */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>비밀번호 확인</FieldLabel>
                <Input
                  type="password"
                  placeholder="비밀번호를 다시 입력해 주세요."
                  value={confirmPassword}
                  onChange={(v) => {
                    setConfirmPassword(v);
                    setStep2Errors((prev) => {
                      const next = { ...prev };
                      if (v && v !== password) {
                        next.confirmPassword = '비밀번호가 일치하지 않습니다.';
                      } else {
                        delete next.confirmPassword;
                      }
                      return next;
                    });
                  }}
                  error={step2Errors.confirmPassword}
                />
              </div>

              {/* 소속 */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>소속</FieldLabel>
                <Input
                  placeholder="소속을 입력해 주세요."
                  value={department}
                  onChange={(v) => {
                    setDepartment(v);
                    clearStep2Error('department');
                  }}
                  error={step2Errors.department}
                />
              </div>

              {/* 직책 */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                <FieldLabel required>직책</FieldLabel>
                <Input
                  placeholder="직책을 입력해 주세요."
                  value={position}
                  onChange={(v) => {
                    setPosition(v);
                    clearStep2Error('position');
                  }}
                  error={step2Errors.position}
                />
              </div>

              {/* 이용약관 */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4 rounded-[12px] border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="terms"
                        checked={termsAgreed}
                        onCheckedChange={(c) => {
                          setTermsAgreed(Boolean(c));
                          if (c) clearStep2Error('terms');
                        }}
                        className="size-5 lg:size-6"
                      />
                      <label
                        htmlFor="terms"
                        className="txt-c1-bold flex cursor-pointer items-center gap-1"
                      >
                        <span className="text-red-500">[필수]</span>
                        <span className="text-gray-500">AX Compass 이용약관</span>
                      </label>
                    </div>
                    <Link
                      href="/terms"
                      target="_blank"
                      className="txt-c1-regular text-special-orange-500 underline"
                    >
                      보기
                    </Link>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="mb-2 flex w-full items-center gap-1.5"
                      onClick={() => setPrivacyNoticeOpen((open) => !open)}
                      aria-expanded={privacyNoticeOpen}
                    >
                      <span className="text-gray-500">•</span>
                      <span className="txt-c1-bold text-gray-500">개인정보 수집 및 이용 안내</span>
                      <ChevronUp
                        className={cn(
                          'text-special-orange-500 size-4 shrink-0 transition-transform duration-200',
                          !privacyNoticeOpen && 'rotate-180',
                        )}
                        aria-hidden
                      />
                    </button>
                    {privacyNoticeOpen && (
                      <div className="txt-c1-regular bg-gray-0 flex flex-col rounded-[14px] p-[14px] text-gray-700">
                        <p>
                          회사는 AX Compass 서비스 제공을 위해 운영자 회원의 개인정보를
                          수집·이용합니다.
                        </p>
                        <ul className="flex flex-col gap-1">
                          <li className="flex gap-1.5 pl-1">
                            <span className="shrink-0">•</span>
                            <span>
                              수집 항목: 이메일, 이름, 소속, 직책, 기관 정보, 서비스 이용기록
                            </span>
                          </li>
                          <li className="flex gap-1.5 pl-1">
                            <span className="shrink-0">•</span>
                            <span>
                              이용 목적: 운영자 계정 생성 및 로그인, 기관 등록·관리, AX 역량 검사
                              운영, 검사 결과 확인, 기관 통계·리포트 제공, 교육·컨설팅 검토, 보안 및
                              부정이용 방지
                            </span>
                          </li>
                          <li className="flex gap-1.5 pl-1">
                            <span className="shrink-0">•</span>
                            <span>
                              보유 기간: 운영자 계정 및 기관 이용 기간 동안 보관하며, 검사 결과,
                              조회 코드 및 기관 통계 산출 관련 정보는 검사 완료일 또는 기관 이용
                              종료일로부터 5년간 보관합니다. 단, 부정이용 등 분쟁처리에 관한 기록은
                              처리 종료일로부터 3년간 보관합니다.
                            </span>
                          </li>
                        </ul>
                        <p className="mt-4">
                          ※ 자세한 내용은{' '}
                          <Link
                            href="/privacy"
                            target="_blank"
                            className="txt-c1-bold text-special-dark-blue-500 underline"
                          >
                            개인정보 처리방침
                          </Link>
                          에서 확인하실 수 있습니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {step2Errors.terms && (
                  <p className="txt-c1-bold text-red-500">{step2Errors.terms}</p>
                )}
              </div>
            </form>

            {/* Step 2 하단 버튼 */}
            <div className="h-px bg-gray-100" />
            <div className="flex justify-center gap-3">
              <Button render={<Link href="/" />} variant="gray">
                메인으로
              </Button>
              <Button type="submit" form="register-form" variant="purple">
                회원가입 완료
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

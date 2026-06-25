'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { authService } from '@/api/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldLabel } from '@/components/ui/Modal';
import { ApiError } from '@/types/common';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_LENGTH = 6;
const TIMER_SECONDS = 5 * 60;

const AUTH_MESSAGES = {
  emailRequired: '이메일을 입력해 주세요.',
  emailInvalid: '올바른 이메일 주소를 입력해 주세요.',
  codeRequestRequired: '인증번호를 먼저 요청해 주세요.',
  codeVerifyRequired: '이메일 인증을 완료한 뒤 진행해 주세요.',
  codeExpired: '인증 시간이 만료되었습니다. 인증번호를 다시 요청해 주세요.',
  codeMismatch: '인증번호가 일치하지 않습니다. 다시 입력해 주세요.',
  codeVerified: '이메일 인증이 완료되었습니다.',
  codeSent: '인증번호를 이메일로 보냈습니다.',
  submitAuthRequired: '비밀번호 변경을 위해 이메일 인증을 먼저 완료해 주세요.',
} as const;

const FORM_VALIDATION_TOAST = '입력한 정보를 확인해 주세요.';

type FormErrors = {
  email?: string;
  verificationCode?: string;
  password?: string;
  confirmPassword?: string;
};

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ResetPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  useEffect(() => {
    if (timerSeconds <= 0) return;
    const id = setInterval(() => {
      setTimerSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerSeconds]);

  const clearError = useCallback((key: keyof FormErrors) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validateEmail = useCallback(() => {
    if (!email.trim()) return AUTH_MESSAGES.emailRequired;
    if (!EMAIL_REGEX.test(email)) return AUTH_MESSAGES.emailInvalid;
    return undefined;
  }, [email]);

  const getConfirmPasswordError = useCallback((pwd: string, confirm: string) => {
    if (!confirm) return undefined;
    if (pwd !== confirm) return '비밀번호가 일치하지 않습니다.';
    return undefined;
  }, []);

  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  async function handleRequestCode() {
    const emailError = validateEmail();
    if (emailError) {
      setErrors({ email: emailError });
      toast.error(FORM_VALIDATION_TOAST);
      return;
    }

    setIsSendingCode(true);
    try {
      await authService.requestPasswordReset({ email });
      setCodeRequested(true);
      setCodeVerified(false);
      setResetToken(null);
      setVerificationCode('');
      setPassword('');
      setConfirmPassword('');
      setTimerSeconds(TIMER_SECONDS);
      setErrors({});
      toast.success(AUTH_MESSAGES.codeSent);
    } catch (error) {
      const message = error instanceof ApiError ? error.detail : '오류가 발생했습니다.';
      toast.error(message);
    } finally {
      setIsSendingCode(false);
    }
  }

  async function verifyCode(code: string) {
    if (code.length !== CODE_LENGTH || codeVerified) return;
    if (timerSeconds <= 0) {
      setErrors({ verificationCode: AUTH_MESSAGES.codeExpired });
      toast.error(AUTH_MESSAGES.codeExpired);
      return;
    }

    setIsVerifyingCode(true);
    try {
      const result = await authService.verifyPasswordResetOtp({ email, otpCode: code });
      setResetToken(result.resetToken);
      setCodeVerified(true);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.verificationCode;
        return next;
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.detail : '오류가 발생했습니다.';
      setErrors({ verificationCode: AUTH_MESSAGES.codeMismatch });
      setCodeVerified(false);
      toast.error(message);
    } finally {
      setIsVerifyingCode(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!codeVerified) {
      const message = !codeRequested
        ? AUTH_MESSAGES.codeRequestRequired
        : AUTH_MESSAGES.codeVerifyRequired;
      setErrors({ verificationCode: message });
      toast.error(AUTH_MESSAGES.submitAuthRequired);
      return;
    }

    const nextErrors: FormErrors = {};
    if (!password) {
      nextErrors.password = '비밀번호를 입력해 주세요.';
    } else if (password.length < 8) {
      nextErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = '비밀번호 확인을 입력해 주세요.';
    } else {
      const confirmError = getConfirmPasswordError(password, confirmPassword);
      if (confirmError) nextErrors.confirmPassword = confirmError;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error(FORM_VALIDATION_TOAST);
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.confirmPasswordReset({ resetToken: resetToken!, newPassword: password });
      toast.success('비밀번호가 변경되었습니다.');
      router.push('/');
    } catch (error) {
      const message = error instanceof ApiError ? error.detail : '오류가 발생했습니다.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col gap-6 rounded-[20px] border bg-white px-6 py-[50px] shadow lg:px-[50px]">
      <div className="flex flex-col">
        <h1 className="txt-t1">비밀번호 재설정</h1>
        <p className="txt-b-regular">이메일 인증 후 비밀번호를 재설정해 주세요.</p>
      </div>

      <div className="bg-special-navy-100 h-px w-full" />

      <form id="reset-password-form" onSubmit={handleConfirm} className="flex flex-col gap-[30px]">
        <div className="flex flex-col gap-2.5 lg:gap-3">
          <FieldLabel required>아이디(이메일)</FieldLabel>
          <Input
            type="email"
            placeholder="이메일을 입력해 주세요."
            value={email}
            onChange={(v) => {
              setEmail(v);
              clearError('email');
            }}
            disabled={codeVerified || (codeRequested && timerSeconds > 0) || isSubmitting}
            error={errors.email}
          />
        </div>

        <Button
          type="button"
          variant={codeRequested ? 'gray' : 'purple'}
          className="w-fit"
          onClick={handleRequestCode}
          disabled={isSendingCode || codeVerified || isSubmitting}
        >
          인증번호 요청
        </Button>

        {codeRequested && (
          <div className="flex flex-col gap-2.5 lg:gap-3">
            <FieldLabel>인증번호 확인</FieldLabel>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={CODE_LENGTH}
              placeholder="인증번호 6자리"
              value={verificationCode}
              onChange={(v) => {
                const digits = v.replace(/\D/g, '').slice(0, CODE_LENGTH);
                setVerificationCode(digits);
                clearError('verificationCode');
                if (codeVerified) setCodeVerified(false);
                if (digits.length === CODE_LENGTH) verifyCode(digits);
              }}
              disabled={codeVerified || isSubmitting || isVerifyingCode || timerSeconds <= 0}
              error={errors.verificationCode}
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

        {codeVerified && (
          <>
            <div className="flex flex-col gap-2">
              <FieldLabel required>비밀번호</FieldLabel>
              <Input
                type="password"
                placeholder="비밀번호를 입력해 주세요."
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  clearError('password');
                  const confirmError = getConfirmPasswordError(v, confirmPassword);
                  setErrors((prev) => {
                    const next = { ...prev };
                    if (confirmError) next.confirmPassword = confirmError;
                    else delete next.confirmPassword;
                    return next;
                  });
                }}
                disabled={isSubmitting}
                error={errors.password}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel required>비밀번호 확인</FieldLabel>
              <Input
                type="password"
                placeholder="비밀번호를 다시 입력해 주세요."
                value={confirmPassword}
                onChange={(v) => {
                  setConfirmPassword(v);
                  const confirmError = getConfirmPasswordError(password, v);
                  setErrors((prev) => {
                    const next = { ...prev };
                    if (confirmError) next.confirmPassword = confirmError;
                    else delete next.confirmPassword;
                    return next;
                  });
                }}
                disabled={isSubmitting}
                error={errors.confirmPassword}
              />
            </div>
          </>
        )}
      </form>

      <div className="h-px w-full bg-gray-100" />

      <div className="flex justify-center gap-3">
        <Button render={<Link href="/" />} variant="gray" className="w-fit">
          메인으로
        </Button>
        {codeVerified && (
          <Button
            type="submit"
            form="reset-password-form"
            variant="purple"
            disabled={isSubmitting || !passwordsMatch || password.length < 8}
          >
            {isSubmitting ? '변경 중...' : '비밀번호 변경'}
          </Button>
        )}
      </div>
    </div>
  );
}

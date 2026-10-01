'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Button, Field, FormError } from '@/components/admin/ui';
import { useOpsLogin } from '@/hooks/useOpsAuth';
import { ApiError } from '@/types/common';

const LOGIN_INPUT =
  'txt-c1-regular rounded-[10px] h-14 w-full bg-gray-0 px-4 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-adm-brand/30';

/** 서버가 detail 을 주면 그걸 띄우고(FormError), 없을 때만 상태별 문구를 쓴다. */
function loginErrorFallback(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) return '로그인 시도가 너무 많습니다. 15분 뒤 다시 시도해 주세요.';
    if (error.status === 401) return '이메일 또는 비밀번호가 올바르지 않습니다.';
    if (error.status === 503) return '지금은 로그인할 수 없습니다. 잠시 뒤 다시 시도해 주세요.';
  }
  return '로그인하지 못했습니다.';
}

/** 관리자 로그인 폼. useSearchParams 를 쓰므로 Suspense 안에 둔다. */
export function LoginForm() {
  const params = useSearchParams();
  // 우리 화면 안의 경로만 받는다 — 바깥 주소면 로그인 직후 남의 사이트로 보내는 통로가 된다.
  const next = params.get('next');
  const goTo = next && next.startsWith('/') && !next.startsWith('//') ? next : '/admin';

  const login = useOpsLogin(goTo);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.includes('@') && password.length > 0 && !login.isPending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) login.mutate({ email, rawPassword: password });
      }}
      className="w-full max-w-[560px]"
    >
      <h1 className="txt-t3 text-gray-900">로그인</h1>
      <p className="txt-c1-regular mt-2 text-gray-500">SafariOn 관리자 계정으로 로그인해 주세요.</p>

      <div className="mt-8 space-y-6 rounded-[16px] bg-white px-6 py-14 shadow-sm lg:px-8 lg:py-16">
        <Field label="아이디(이메일)" htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해 주세요."
            className={LOGIN_INPUT}
          />
        </Field>

        <Field label="비밀번호" htmlFor="password">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요."
              className={`${LOGIN_INPUT} pr-14`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              aria-pressed={showPassword}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 transition-colors duration-200 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="size-[22px]" aria-hidden />
              ) : (
                <Eye className="size-[22px]" aria-hidden />
              )}
            </button>
          </div>
        </Field>
      </div>

      <div className="mt-4 text-center">
        <FormError error={login.error} fallback={loginErrorFallback(login.error)} />
      </div>

      <div className="mt-8 flex justify-center">
        <Button type="submit" size="lg" disabled={!canSubmit}>
          {login.isPending ? '확인 중…' : '로그인'}
        </Button>
      </div>
    </form>
  );
}

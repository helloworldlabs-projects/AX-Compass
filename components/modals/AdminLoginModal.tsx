'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/Modal';
import { useAdminEmailLogin } from '@/hooks/useAdminEmailLogin';

type LoginTab = 'account' | 'code';

type LoginCredentials =
  | { type: 'account'; email: string; password: string }
  | { type: 'code'; code: string; password: string };

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (credentials: LoginCredentials) => void;
}

function AdminLoginModal({ open, onClose, onConfirm }: AdminLoginModalProps) {
  const [activeTab, setActiveTab] = useState<LoginTab>('account');

  const [email, setEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');

  const [code, setCode] = useState('');
  const [codePassword, setCodePassword] = useState('');

  const [accountError, setAccountError] = useState<string | null>(null);

  const adminEmailLogin = useAdminEmailLogin({
    onSuccess: () => {
      handleClose();
    },
    onError: (message) => {
      setAccountError(message);
    },
  });

  function reset() {
    setEmail('');
    setAccountPassword('');
    setCode('');
    setCodePassword('');
    setAccountError(null);
  }

  function handleTabChange(tab: LoginTab) {
    setActiveTab(tab);
    reset();
  }

  function handleClose() {
    reset();
    setActiveTab('account');
    onClose();
  }

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (activeTab === 'account') {
      setAccountError(null);
      adminEmailLogin.mutate({ email, rawPassword: accountPassword });
    } else {
      onConfirm({ type: 'code', code, password: codePassword });
    }
  }

  const isAccountLoading = adminEmailLogin.isPending;

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalTitle>환영합니다!</ModalTitle>

      <div className="flex flex-col gap-2 text-center">
        <div className="txt-st2-bold">로그인 방법을 선택해 주세요.</div>
        <div className="txt-c1-regular">운영자 계정 또는 기관 코드로 로그인할 수 있습니다.</div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <Button
          variant={activeTab === 'account' ? 'dark-blue' : 'gray'}
          onClick={() => handleTabChange('account')}
          aria-pressed={activeTab === 'account'}
        >
          운영자 계정 로그인
        </Button>
        <Button
          variant={activeTab === 'code' ? 'dark-blue' : 'gray'}
          onClick={() => handleTabChange('code')}
          aria-pressed={activeTab === 'code'}
        >
          기관 코드 로그인
        </Button>
      </div>

      <form onSubmit={handleConfirm} className="flex flex-col gap-4">
        {activeTab === 'account' ? (
          <>
            <ModalBody>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="txt-c1-bold text-gray-500">아이디(이메일)</div>
                  <Input
                    type="email"
                    placeholder="이메일을 입력해 주세요."
                    value={email}
                    onChange={setEmail}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="txt-c1-bold text-gray-500">비밀번호</div>
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    value={accountPassword}
                    onChange={setAccountPassword}
                  />
                </div>

                {accountError !== null && (
                  <p className="txt-c1-bold text-red-500">{accountError}</p>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="txt-c1-regular">비밀번호를 잊으셨나요?</span>
                  <Link
                    href="/reset-password"
                    onClick={handleClose}
                    className="txt-c1-bold text-special-dark-blue-500 underline"
                  >
                    재설정하기
                  </Link>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="txt-c1-regular">운영자 계정이 없으신가요?</span>
                  <Link
                    href="/register"
                    onClick={handleClose}
                    className="txt-c1-bold text-special-dark-blue-500 underline"
                  >
                    기관·운영자 등록하기
                  </Link>
                </div>
              </div>
            </ModalBody>
          </>
        ) : (
          <>
            <ModalBody>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="txt-c1-bold text-gray-500">기관 코드</div>
                  <Input placeholder="기관 코드를 입력해 주세요." value={code} onChange={setCode} />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="txt-c1-bold text-gray-500">기관 비밀번호</div>
                  <Input
                    type="password"
                    placeholder="기관 비밀번호를 입력해 주세요."
                    value={codePassword}
                    onChange={setCodePassword}
                  />
                </div>
              </div>

              <p className="txt-c1-bold mt-6 text-gray-700">
                ※ AX Compass 담당자로부터 안내받은 기관 코드와 비밀번호를 입력해 주세요.
              </p>
            </ModalBody>
          </>
        )}

        <ModalFooter>
          <Button type="button" variant="gray" onClick={handleClose} disabled={isAccountLoading}>
            닫기
          </Button>
          <Button type="submit" variant="purple" disabled={isAccountLoading}>
            {isAccountLoading ? '로그인 중...' : '로그인'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export { AdminLoginModal };
export type { LoginCredentials };

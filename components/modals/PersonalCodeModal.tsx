'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Gift } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldLabel, Modal, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/Modal';

interface PersonalCodeModalProps {
  open: boolean;
  onClose: () => void;
}

function PersonalCodeModal({ open, onClose }: PersonalCodeModalProps) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleClose() {
    setCode('');
    setError('');
    onClose();
  }

  function handleChange(value: string) {
    setCode(value);
    if (error) setError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim() === '') {
      setError('검사 코드를 입력해 주세요.');
      return;
    }
    if (code.toUpperCase() === 'HELLOAX') {
      handleClose();
      router.push('/assessment/general');
    } else {
      setError('검사 코드가 올바르지 않습니다. 다시 확인해 주세요.');
    }
  }

  function handleAddChannel() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kakao = (window as any).Kakao;
    if (!kakao) return;
    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
    }
    kakao.Channel.addChannel({ channelPublicId: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID });
  }

  return (
    <Modal open={open} onClose={handleClose} className="w-[340px] lg:w-[600px]">
      <ModalTitle>개인 AX 검사 코드 입력</ModalTitle>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ModalBody>
          <div className="flex flex-col gap-2">
            <FieldLabel required>개인 AX 검사 코드</FieldLabel>
            <Input
              placeholder="개인 AX 검사 코드를 입력해 주세요."
              value={code}
              onChange={handleChange}
            />
            {error && <p className="txt-c1-bold text-red-500">{error}</p>}
          </div>
        </ModalBody>

        <button
          type="button"
          onClick={handleAddChannel}
          className="relative h-[123px] w-[300px] cursor-pointer overflow-hidden rounded-[16px] lg:h-[222px] lg:w-[540px]"
        >
          <Image src="/images/assessment/img_free_cupon.png" alt="" fill className="object-cover" />
        </button>

        <ModalFooter>
          <Button type="button" variant="gray" onClick={handleClose}>
            닫기
          </Button>
          <Button type="submit" variant="purple">
            확인
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export { PersonalCodeModal };

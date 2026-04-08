import { Building } from 'lucide-react';

export default function InstitutionLoginButton() {
  return (
    <button className="flex cursor-pointer items-center gap-1.5 text-white">
      <Building className="size-5" />
      <span className="txt-b-bold">기관 관리</span>
    </button>
  );
}

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SingleSelectOptionsProps {
  options: { id: string; label: string }[];
}

export default function SingleSelectOptions({ options }: SingleSelectOptionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="txt-st2-bold">1. 연령대를 선택해주세요.</div>
      <RadioGroup className="flex">
        {options.map((option) => (
          <RadioGroupItem
            key={option.id}
            value={option.id}
            label={option.label}
            labelClassName="w-[120px]"
          />
        ))}
      </RadioGroup>
    </div>
  );
}

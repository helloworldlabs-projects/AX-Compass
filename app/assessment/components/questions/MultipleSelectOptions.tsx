import { Checkbox } from '@/components/ui/checkbox';

interface Option {
  value: string;
  label: string;
}

interface MultipleSelectOptionsProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export default function MultipleSelectOptions({
  options,
  selectedValues,
  onChange,
}: MultipleSelectOptionsProps) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-3">
      {options.map((option) => (
        <Checkbox
          key={option.value}
          id={option.value}
          label={option.label}
          labelClassName="w-[140px]"
          checked={selectedValues.includes(option.value)}
          onCheckedChange={(checked) => {
            const next = checked
              ? [...selectedValues, option.value]
              : selectedValues.filter((v) => v !== option.value);
            onChange(next);
          }}
        />
      ))}
    </div>
  );
}

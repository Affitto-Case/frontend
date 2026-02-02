import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface InputFieldProps {
  label: string
  desc: string
  value: string
  onChange: (newValue: string) => void
}

export function InputField({ label, desc, value, onChange }: InputFieldProps) {
  return (
    <Field className="max-w-sm">
      <FieldLabel>
        {label}
      </FieldLabel>
      <div>
      <Input
        type="text"
        placeholder={`Enter ${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)} 
      />
      </div>
      <FieldDescription>{desc}</FieldDescription>
    </Field>
  )
}

export default InputField

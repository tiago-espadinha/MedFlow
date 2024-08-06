import "./NumberField.css";

export function NumberField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: number;
}) {
  return (
    <div className="num-field">
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
      />
    </div>
  );
}

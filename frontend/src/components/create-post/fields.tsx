export function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={"grid gap-1.5 " + (className ?? "") }>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        className="h-14 rounded-xl border border-gray-200 bg-white px-3 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function LabeledNumber({
  label,
  value,
  onChange,
  placeholder,
  min,
  step,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: number;
  step?: number;
  className?: string;
}) {
  return (
    <div className={"grid gap-1.5 " + (className ?? "") }>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        className="h-14 rounded-xl border border-gray-200 bg-white px-3 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        step={step}
      />
    </div>
  );
}

export function LabeledSelect({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
  className?: string;
}) {
  return (
    <div className="grid min-w-0">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className={className}>
        <select
          className="h-10 w-full rounded-xl border border-gray-200 bg-white px-2.5 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function LabeledTextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <textarea
      className={
        "w-full resize-y rounded-xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 " +
        (className ?? "")
      }
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

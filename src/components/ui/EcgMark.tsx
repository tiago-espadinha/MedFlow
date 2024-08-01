// The MedFlow mark: one ECG complex, drawn in the trace colour so it follows the theme.
export function EcgMark() {
  return (
    <svg className="ecg-mark" viewBox="0 0 34 22" aria-hidden="true">
      <path
        d="M1 14 H9 L11 11 L13 14 H15 L17 2 L19 20 L21 14 H25 L27 10 L30 14 H33"
        fill="none"
        stroke="var(--trace)"
        strokeWidth={2.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

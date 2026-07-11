interface StepperProps {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  label: string
  disabled?: boolean
}

export function Stepper({ value, min, max, onChange, label, disabled = false }: StepperProps) {
  const buttonClasses =
    'h-11 w-11 rounded-xl border border-border bg-surface-elevated text-xl font-semibold text-text-primary transition hover:bg-surface active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40'

  return (
    <div
      className={`flex items-center gap-3 ${disabled ? 'opacity-50' : ''}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={buttonClasses}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label={`Diminuir ${label}`}
      >
        −
      </button>
      <span
        className="min-w-8 text-center text-2xl font-bold text-text-primary tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={buttonClasses}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label={`Aumentar ${label}`}
      >
        +
      </button>
    </div>
  )
}

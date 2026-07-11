interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl text-left focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:outline-none"
    >
      <span>
        <span className="block font-bold">{label}</span>
        {description && <span className="block text-sm text-slate-400">{description}</span>}
      </span>
      <span
        aria-hidden="true"
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${checked ? 'bg-yellow-400' : 'bg-slate-600'}`}
      >
        <span
          className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : ''}`}
        />
      </span>
    </button>
  )
}

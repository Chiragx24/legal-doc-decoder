function Button({
  children,
  type = 'button',
  onClick,
  disabled,
  variant = 'primary',
  size = 'md',
  className = '',
}) {
  const variants = {
    primary: 'bg-ink text-paper hover:bg-ink-light',
    light: 'bg-white text-ink hover:bg-paper',
    outline: 'border border-line bg-transparent text-ink hover:bg-ink/5',
    ghost: 'bg-transparent text-current hover:opacity-80',
  }

  const sizes = {
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button

function Badge({ children, variant = 'default' }) {
  const styles = {
    default: 'bg-paper-dim text-slate',
    warning: 'bg-flag-light text-flag',
    success: 'bg-seal-light text-seal',
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded ${styles[variant]}`}>
      {children}
    </span>
  )
}

export default Badge
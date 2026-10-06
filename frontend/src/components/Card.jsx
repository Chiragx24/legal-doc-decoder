function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-line p-6 ${className}`}>
      {children}
    </div>
  )
}

export default Card
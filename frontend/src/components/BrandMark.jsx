function BrandMark({ light = false, compact = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${light ? 'text-paper' : 'text-ink'}`}>
      <span
        className={`grid h-8 w-8 place-items-center rounded-md font-serif text-lg leading-none ${
          light ? 'bg-white text-ink' : 'bg-ink text-paper'
        }`}
      >
        §
      </span>
      <span className="font-serif text-[1.05rem] font-semibold tracking-[0.02em]">
        {compact ? (
          <>
            <span className="sm:hidden">Decoder</span>
            <span className="hidden sm:inline">Legal Doc Decoder</span>
          </>
        ) : (
          'Legal Doc Decoder'
        )}
      </span>
    </span>
  )
}

export default BrandMark

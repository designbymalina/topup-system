type PaginationProps = {
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1

  const endItem = Math.min(
    (currentPage + 1) * pageSize,
    totalElements,
  )

  return (
    <>
    {totalPages > 1 && (
    <nav
      className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-3"
      aria-label="Paginacja"
    >
      <span aria-live="polite">
        Wyświetlanie od {startItem} do {endItem} z {totalElements} pozycji
      </span>

      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-primary"
          disabled={disabled || currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Poprzednia
        </button>

        <button
          type="button"
          className="btn btn-outline-primary"
          disabled={disabled || currentPage + 1 >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Następna
        </button>
      </div>
    </nav>
    )}
    </>
  )
}

export default Pagination

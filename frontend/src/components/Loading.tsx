type LoadingProps = {
  message?: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
}

function Loading({
  message = 'Ładowanie...',
  variant = 'primary'
}: LoadingProps) {
  return (
    <div className="w-100 d-flex align-items-center justify-content-center py-2 px-3">
      <div
        className={`spinner-border text-${variant} spinner-border-sm flex-shrink-0 me-2`}
        role="status"
      >
        <span className="visually-hidden">Ładowanie...</span>
      </div>

      {message && (
        <span className="text-secondary fw-medium small text-truncate">
          {message}
        </span>
      )}
    </div>
  )
}

export default Loading

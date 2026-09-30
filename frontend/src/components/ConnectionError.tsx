type ConnectionErrorProps = {
  onRetry?: () => void
}

function ConnectionError({ onRetry }: ConnectionErrorProps) {
  return (
    <div className="alert alert-danger text-center" role="alert">
      <h5 className="alert-heading">Brak połączenia z serwerem</h5>
      <p className="mb-3">Nie można połączyć się z serwerem aplikacji. Upewnij się, że backend Spring Boot jest uruchomiony.</p>

      {onRetry && (
        <button
          type="button"
          className="btn btn-outline-dark"
          onClick={onRetry}
        >
          Spróbuj ponownie
        </button>
      )}
    </div>
  )
}

export default ConnectionError

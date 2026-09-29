type AlertType = 'success' | 'danger' | 'warning' | 'info'

type AlertProps = {
  type: AlertType
  message: string
  onClose?: () => void
}

function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
      )}
    </div>
  )
}

export default Alert

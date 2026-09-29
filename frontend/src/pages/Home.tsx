import { useState, type FormEvent } from 'react'

import Alert from '../components/Alert'
import { createPublicTopUp } from '../services/topUpService'

function Home() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [operator, setOperator] = useState('T-Mobile')
  const [amount, setAmount] = useState('30')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'danger'
    message: string
  } | null>(null)

  const handleTopUpSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const topUpAmount = Number(amount)

    if (!phoneNumber.trim()) {
      setAlert({
        type: 'danger',
        message: 'Numer telefonu jest wymagany.'
      })
      return
    }

    if (!topUpAmount || topUpAmount < 1) {
      setAlert({
        type: 'danger',
        message: 'Kwota doładowania musi wynosić co najmniej 1 PLN.'
      })
      return
    }

    setSaving(true)
    setAlert(null)

    try {
      await createPublicTopUp({
        phoneNumber: phoneNumber.trim(),
        amount: topUpAmount,
      })

      setAlert({
        type: 'success',
        message: `Doładowanie numeru ${phoneNumber} na kwotę ${topUpAmount.toFixed(2)} PLN zostało wykonane.`,
      })

      setPhoneNumber('')
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          type: 'danger',
          message: error.message
        })
      } else {
        setAlert({
          type: 'danger',
          message: 'Nie udało się wykonać doładowania.'
        })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <main>
      <section className="bg-primary text-white py-5 mb-5 shadow-sm">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start">
              <span className="badge bg-light text-primary mb-2 fw-semibold px-3 py-2 text-uppercase">Błyskawicznie i bezpiecznie</span>
              <h1 className="display-6 fw-bold mb-3">Doładuj telefon w 15 sekund</h1>
              <p className="lead mb-4 opacity-90">
                Wybierz operatora, wpisz numer i zasil konto online. Bez rejestracji, bez zbędnych formalności, 24/7.
              </p>
              <div className="d-flex justify-content-center justify-content-lg-start gap-3">
                <a href="#quick-topup" className="btn btn-light btn-lg px-4 fw-medium text-primary">Doładuj teraz</a>
                <a href="#how-it-works" className="btn btn-outline-light btn-lg px-4">Jak to działa</a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg p-4 rounded-4 text-dark" id="quick-topup">
                <div className="card-body">
                  <h3 className="card-title fw-bold text-center mb-4">Szybkie Doładowanie</h3>

                  {alert && (
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                  )}

                  <form onSubmit={handleTopUpSubmit}>
                    <div className="mb-3">
                      <label htmlFor="phoneNumber" className="form-label small fw-semibold text-muted text-uppercase">Numer telefonu</label>
                      <div className="input-group">
                        <input
                          type="tel"
                          id="phoneNumber"
                          className="form-control border-start-0"
                          placeholder="+48123456789"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={saving}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="operator" className="form-label small fw-semibold text-muted text-uppercase">Wybierz sieć</label>
                      <select
                        id="operator"
                        className="form-select"
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
                        disabled={saving}
                      >
                        <option value="">Wybierz z listy...</option>
                        <option value="Orange">Orange</option>
                        <option value="Play">Play</option>
                        <option value="Plus">Plus</option>
                        <option value="T-Mobile">T-Mobile</option>
                        <option value="NJU Mobile">Nju Mobile</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-muted text-uppercase">Kwota doładowania</label>
                      <div className="row g-2 mb-2">
                        {['20', '30', '50', '100'].map((val) => (
                          <div className="col-3" key={val}>
                            <button
                              type="button"
                              className={`btn w-100 py-2 border ${amount === val ? 'btn-success' : 'btn-outline-secondary'}`}
                              onClick={() => setAmount(val)}
                            >
                              {val} zł
                            </button>
                          </div>
                        ))}
                      </div>
                      <input
                        type="number"
                        id="amount"
                        className="form-control"
                        placeholder="Inna kwota (5 - 500 PLN)"
                        min="5"
                        max="500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={saving}
                      />
                    </div>
                    <button type="submit" className="btn btn-warning btn-lg w-100 fw-bold text-dark shadow-sm">
                      {saving ? 'Trwa doładowanie...' : 'Doładuj'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home

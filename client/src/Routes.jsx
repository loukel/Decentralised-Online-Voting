import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Results from './features/results'
import Vote from './features/vote'
import { useEffect, useState } from 'react'
import { getEvent } from './services/eventApi'

export const AppRoutes = () => {
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState(-1)

  useEffect(() => {
    getEvent()
      .then((event) => {
        setEvent(event)
        setLoading(false)
      })
      .catch((e) => {})
  }, [])

  if (!loading)
    return (
      <Router>
        <Routes>
          <Route path='/' element={<Vote event={event} />} />
          <Route path='/results' element={<Results event={event} />} />
        </Routes>
      </Router>
    )
}

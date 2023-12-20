import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Results from './features/results'
import Vote from './features/vote'
import Admin from './features/admin'
import { useEffect, useState } from 'react'
import { getEvents } from './services/eventApi'

export const AppRoutes = () => {
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState(-1)
  const [events, setEvents] = useState([])

  useEffect(() => {
    getEvents().then((events) => {
      events.forEach((event_) => {
        if (
          new Date(event_.startDateTime) < new Date() &&
          new Date(event_.endDateTime) > new Date()
        ) {
          return setEvent(event_)
        }
      })
      setEvents(events)
      setLoading(false)
    })
  }, [])

  if (!loading)
    return (
      <Router>
        <Routes>
          <Route path='/' element={<Vote event={event} />} />
          <Route path='/results' element={<Results event={event} />} />
          <Route path='/admin' element={<Admin events={events} />} />
        </Routes>
      </Router>
    )
}

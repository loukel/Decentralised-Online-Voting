import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Results from './features/results'
import Vote from './features/vote'
import { useEffect, useState } from 'react'
import { getEvent } from './services/eventApi'
import { getChain } from './services/chainApi'

export const AppRoutes = () => {
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState(-1)
  const [chain, setChain] = useState(-1)

  useEffect(() => {
    getEvent()
      .then((e) => {
        setEvent(e)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  useEffect(() => {
    let intervalId

    if (event !== -1) {
      intervalId = setInterval(() => {
        getChain()
          .then((c) => {
            setChain(c)
            setLoading(false)
          })
          .catch((e) => {
            console.log(e)
          })
      }, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId) // Clear the interval when the component unmounts or event changes
      }
    }
  }, [event])

  if (!loading)
    return (
      <Router>
        <Routes>
          <Route path='/' element={<Vote event={event} />} />
          <Route
            path='/results'
            element={<Results event={event} chain={chain} />}
          />
        </Routes>
      </Router>
    )
}

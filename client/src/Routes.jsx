import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Results from './features/results'
import Vote from './features/vote'
import { useEffect, useState } from 'react'
import { getEvent } from './services/eventApi'
import { getChain } from './services/chainApi'
import Register from './features/register'

export const AppRoutes = () => {
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState(-1)
  const [chain, setChain] = useState(-1)
  const [error, setError] = useState(true)

  // useEffect(() => {
  //   getEvent()
  //     .then((e) => {
  //       setEvent(e)
  //     })
  //     .catch((e) => {
  //       setError(e)
  //     })
  // }, [])

  // useEffect(() => {
  //   let intervalId
  //   if (event?.options) {
  //     intervalId = setInterval(() => {
  //       getChain()
  //         .then((c) => {
  //           setChain(c)
  //           setLoading(false)
  //         })
  //         .catch((e) => {
  //           console.log(e)
  //         })
  //     }, 1000)
  //   }

  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId) // Clear the interval when the component unmounts or event changes
  //     }
  //   }
  // }, [event])

  if (!loading)
    return (
      <Router>
        <Routes>
          {/* <Route path='/' element={<Vote event={event} />} />
          <Route
            path='/results'
            element={<Results event={event} chain={chain} />}
          /> */}
          <Route path='/register' element={<Register />} />
        </Routes>
      </Router>
    )
  else if (error)
    return (
      <Router>
        <Routes>
          <Route path='/' element={<div>Network down.</div>} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Router>
    )
}

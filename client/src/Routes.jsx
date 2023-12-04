import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Results from './features/results'
import Vote from './features/vote'

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Vote />} />
        <Route path='/results' element={<Results />} />
      </Routes>
    </Router>
  )
}

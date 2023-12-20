import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Results from './features/results'
import Vote from './features/vote'
import Admin from './features/admin'

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Vote />} />
        <Route path='/results' element={<Results />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </Router>
  )
}


import Home from './HomePage/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Edit from './Update/edit';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/edit" element={<Edit />} />
      
      </Routes>
    </Router>
    </>
  )
}

export default App

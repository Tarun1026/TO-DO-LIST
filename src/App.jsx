
import Home from './HomePage/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Edit from './Update/edit';
import DescriptionEditPage from './Description/description';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/edit" element={<Edit />} />
        <Route
          exact
          path="/description/edit/:id"
          element={<DescriptionEditPage />}
        />
      
      </Routes>
    </Router>
    </>
  )
}

export default App

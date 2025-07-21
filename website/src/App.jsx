import { useState } from 'react'
import Header from './components/header'
import Hero from './components/hero'
import Privacy from './pages/privacy'
import { Routes, Route, Link } from 'react-router-dom';
import './App.css'

function App() {

  return (
    <div className='bg-pink-100 h-screen'>
      <Header></Header>

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </div>
  )
}

export default App

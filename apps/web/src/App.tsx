import React, { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { ViajeListComponent } from './features/viajes/ViajeListComponent'
import { ViajeFormComponent } from './features/viajes/ViajeFormComponent'

function App() {
  const [view, setView] = useState<'list' | 'form' | 'none'>('none')

  const navigateTo = (view: 'list' | 'form') => {
    setView(view)
  }

  const goBack = () => setView('list')

  return (
    <section id="center">
      <div className="hero">
        <img src={heroImg} className="base" width="170" height="179" alt="" />
        <img src={reactLogo} className="framework" alt="React logo" />
        <img src={viteLogo} className="vite" alt="Vite logo" />
      </div>

      <nav style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigateTo('list')} style={{ marginRight: '1rem' }}>Ver Viajes</button>
        <button onClick={() => navigateTo('form')}>Crear Viaje</button>
      </nav>

      {view === 'list' && <ViajeListComponent />}
      {view === 'form' && <ViajeFormComponent />}
      {view === 'none' && (
        <p>Seleccione una opción del menú nav</p>
      )}
    </section>
  )
}

export default App
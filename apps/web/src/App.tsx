import React, { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { ViajeListComponent } from './features/viajes/ViajeListComponent'
import { ViajeFormComponent } from './features/viajes/ViajeFormComponent'
import { ItinerarioListComponent } from './features/itinerario/ItinerarioListComponent'
import { ItinerarioFormComponent } from './features/itinerario/ItinerarioFormComponent'

function App() {
  const [view, setView] = useState<'list' | 'form' | 'itinerario' | 'itinerarioNuevo' | 'none'>('none')

  const navigateTo = (view: 'list' | 'form' | 'itinerario' | 'itinerarioNuevo') => {
    setView(view)
  }

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
        <button onClick={() => navigateTo('itinerario')} style={{ marginLeft: '1rem' }}>Ver Itinerario</button>
      </nav>

      {view === 'list' && <ViajeListComponent />}
      {view === 'form' && <ViajeFormComponent />}
      {view === 'itinerario' && <ItinerarioListComponent />}
      {view === 'itinerarioNuevo' && <ItinerarioFormComponent />}
      {view === 'none' && (
        <p>Seleccione una opción del menú nav</p>
      )}
    </section>
  )
}

export default App
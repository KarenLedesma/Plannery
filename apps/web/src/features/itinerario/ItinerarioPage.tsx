import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ItinerarioFormComponent } from './ItinerarioFormComponent';
import { ItinerarioListComponent } from './ItinerarioListComponent';

export function ItinerarioPage() {
  const { id } = useParams<{ id: string }>();
  const [version, setVersion] = useState(0);

  return (
    <div className="pl-form-container">
      <div className="pl-form-header">
        <h2>Itinerario del viaje</h2>
        <Link to={`/viajes/${id}`} className="pl-back-link">
          ← Volver al viaje
        </Link>
      </div>

        <ItinerarioFormComponent onAgregado={() => setVersion((v) => v + 1)} />

      <div style={{ marginTop: '2rem' }}>
        <ItinerarioListComponent version={version} />
      </div>
    </div>
  );
}
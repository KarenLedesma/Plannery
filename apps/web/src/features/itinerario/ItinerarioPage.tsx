import { Link, useParams } from 'react-router-dom';
import { ItinerarioFormComponent } from './ItinerarioFormComponent';
import { ItinerarioListComponent } from './ItinerarioListComponent';

export function ItinerarioPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="pl-form-container">
      <div className="pl-form-header">
        <h2>Itinerario del viaje</h2>
        <Link to={`/viajes/${id}`} className="pl-back-link">
          ← Volver al viaje
        </Link>
      </div>

      <ItinerarioFormComponent />

      <div style={{ marginTop: '2rem' }}>
        <ItinerarioListComponent />
      </div>
    </div>
  );
}
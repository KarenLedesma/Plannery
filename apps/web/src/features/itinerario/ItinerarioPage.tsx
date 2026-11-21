import { Link, useParams } from 'react-router-dom';
import { ItinerarioFormComponent } from './ItinerarioFormComponent';
import { ItinerarioListComponent } from './ItinerarioListComponent';

export function ItinerarioPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Link to={`/viajes/${id}`}>← Volver al viaje</Link>
      <ItinerarioFormComponent />
      <hr />
      <ItinerarioListComponent />
    </div>
  );
}
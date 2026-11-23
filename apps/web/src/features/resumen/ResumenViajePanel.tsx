import { useEffect, useState } from 'react';
import {
  generarResumenViaje,
  obtenerIaConfig,
  type IaConfigResponse,
  type ResumenViajeResponse,
} from './resumen.service';
import { IaConfigCard } from './IaConfigCard';

interface ResumenViajePanelProps {
  viajeId: string;
}

export function ResumenViajePanel({ viajeId }: ResumenViajePanelProps) {
  const [config, setConfig] = useState<IaConfigResponse | null>(null);
  const [cargandoConfig, setCargandoConfig] = useState(true);
  const [mostrarConfig, setMostrarConfig] = useState(false);

  const [resumenData, setResumenData] = useState<ResumenViajeResponse | null>(null);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    obtenerIaConfig()
      .then((data) => {
        if (!activo) return;
        setConfig(data);
        if (!data.configurada) setMostrarConfig(true);
      })
      .catch(() => {
        if (activo) setMostrarConfig(true);
      })
      .finally(() => {
        if (activo) setCargandoConfig(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const handleGenerarResumen = async () => {
    setError(null);
    setGenerando(true);
    try {
      const resultado = await generarResumenViaje(viajeId);
      setResumenData(resultado);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className="pl-btn-recs"
          onClick={handleGenerarResumen}
          disabled={generando || cargandoConfig || !config?.configurada}
        >
          {generando ? '⏳ Generando resumen...' : '🤖 Generar resumen con IA'}
        </button>

        <button
          type="button"
          className="pl-btn-sec"
          onClick={() => setMostrarConfig((prev) => !prev)}
        >
          {mostrarConfig ? 'Ocultar configuración IA' : '⚙️ Configurar API Key'}
        </button>
      </div>

      {!cargandoConfig && mostrarConfig && (
        <IaConfigCard
          config={config}
          onConfigActualizada={(nueva) => {
            setConfig(nueva);
            if (nueva.configurada) setError(null);
          }}
        />
      )}

      {error && (
        <p style={{ color: '#dc2626', marginTop: '0.75rem' }}>
          {error}
        </p>
      )}

      {resumenData && (
        <article
          className="pl-dato"
          style={{
            marginTop: '1rem',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
              opacity: 0.75,
            }}
          >
            <span>✨ Resumen generado con {resumenData.proveedor.toUpperCase()}</span>
            <span>{new Date(resumenData.generadoEn).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
            {resumenData.resumen}
          </div>
        </article>
      )}
    </div>
  );
}
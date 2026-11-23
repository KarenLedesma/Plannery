import { useState, type FormEvent } from 'react';
import {
  eliminarIaConfig,
  guardarIaConfig,
  type IaConfigResponse,
  type ProveedorIa,
} from './resumen.service';

interface IaConfigCardProps {
  config: IaConfigResponse | null;
  onConfigActualizada: (nueva: IaConfigResponse) => void;
}

export function IaConfigCard({ config, onConfigActualizada }: IaConfigCardProps) {
  const [editando, setEditando] = useState(!config?.configurada);
  const [proveedor, setProveedor] = useState<ProveedorIa>(config?.proveedor ?? 'gemini');
  const [apiKey, setApiKey] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const handleGuardar = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setOkMsg(null);
    setGuardando(true);

    try {
      const actualizada = await guardarIaConfig({ proveedor, apiKey });
      onConfigActualizada(actualizada);
      setApiKey('');
      setEditando(false);
      setOkMsg('API Key guardada y cifrada correctamente.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    setError(null);
    setOkMsg(null);
    setGuardando(true);

    try {
      await eliminarIaConfig();
      onConfigActualizada({
        configurada: false,
        proveedor: 'gemini',
        ultimos4: null,
        actualizadoEn: null,
      });
      setApiKey('');
      setEditando(true);
      setOkMsg('API Key eliminada.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      className="pl-dato"
      style={{
        marginTop: '1rem',
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <p className="pl-dato-label" style={{ margin: 0 }}>
          🔑 Configuración de IA (BYOK)
        </p>

        {config?.configurada && !editando && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', opacity: 0.85 }}>
              <strong>{config.proveedor.toUpperCase()}</strong> ••••••••{config.ultimos4}
            </span>
            <button
              type="button"
              className="pl-btn-sec"
              onClick={() => {
                setProveedor(config.proveedor);
                setEditando(true);
                setOkMsg(null);
              }}
              disabled={guardando}
            >
              Cambiar
            </button>
            <button
              type="button"
              className="pl-btn-sec"
              onClick={handleEliminar}
              disabled={guardando}
              style={{ color: '#b91c1c' }}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      {(!config?.configurada || editando) && (
        <form
          onSubmit={handleGuardar}
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.75rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <select
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value as ProveedorIa)}
            disabled={guardando}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          >
            <option value="gemini">Google Gemini</option>
            <option value="openai">OpenAI</option>
            <option value="groq">Groq</option>
          </select>

          <input
            type="password"
            placeholder="Pegá tu API Key (ej. AIza...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            minLength={10}
            disabled={guardando}
            style={{
              flex: '1 1 220px',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
            }}
          />

          <button type="submit" className="pl-btn-recs" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar clave'}
          </button>

          {config?.configurada && (
            <button
              type="button"
              className="pl-btn-sec"
              onClick={() => {
                setEditando(false);
                setApiKey('');
                setError(null);
              }}
              disabled={guardando}
            >
              Cancelar
            </button>
          )}
        </form>
      )}

      {error && (
        <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
          {error}
        </p>
      )}
      {okMsg && (
        <p style={{ color: '#15803d', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
          {okMsg}
        </p>
      )}
    </div>
  );
}
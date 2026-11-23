import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { actualizarGasto, borrarGasto, crearGasto, listarGastos } from './gastos.service'
import { dinero, formatearFecha, textoDeError } from './formato'
import {
  CATEGORIAS,
  ETIQUETA_CATEGORIA,
  ETIQUETA_FASE,
  FASES,
  ICONO_CATEGORIA,
  type Categoria,
  type Fase,
  type Gasto,
} from './tipos'
import './gastos.css'

// Carga del monto real de un gasto que ya se hizo efectivo
function EditorReal({ gasto, onGuardar }: { gasto: Gasto; onGuardar: (monto: number | null) => Promise<void> }) {
  const [editando, setEditando] = useState(false)
  const [valor, setValor] = useState('')
  const [guardando, setGuardando] = useState(false)

  const abrir = () => {
    setValor(gasto.montoReal === null ? '' : String(gasto.montoReal))
    setEditando(true)
  }

  const guardar = async () => {
    setGuardando(true)
    // Vacío = el gasto vuelve a quedar pendiente
    await onGuardar(valor.trim() === '' ? null : Number(valor))
    setGuardando(false)
    setEditando(false)
  }

  if (!editando) {
    return (
      <div className="gasto-real">
        {gasto.montoReal === null ? (
          <span className="gasto-pendiente">Pendiente</span>
        ) : (
          <strong>{dinero(gasto.montoReal)}</strong>
        )}
        <button type="button" className="gasto-link" onClick={abrir}>
          {gasto.montoReal === null ? 'Cargar real' : 'Editar'}
        </button>
      </div>
    )
  }

  return (
    <div className="gasto-real">
      <input
        className="pl-input gasto-input-chico"
        type="number"
        min="0"
        step="0.01"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        aria-label="Monto real"
        autoFocus
      />
      <button type="button" className="gasto-link" onClick={guardar} disabled={guardando}>
        Guardar
      </button>
      <button type="button" className="gasto-link" onClick={() => setEditando(false)}>
        Cancelar
      </button>
    </div>
  )
}

export function GastosPage() {
  const { id } = useParams<{ id: string }>()
  const viajeId = id ?? ''

  const [gastos, setGastos] = useState<Gasto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filtroFase, setFiltroFase] = useState<Fase | 'TODAS'>('TODAS')
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | 'TODAS'>('TODAS')

  // Formulario
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('TRANSPORTE')
  const [fase, setFase] = useState<Fase>('ANTES')
  const [montoEstimado, setMontoEstimado] = useState('')
  const [montoReal, setMontoReal] = useState('')
  const [fecha, setFecha] = useState('')
  const [nota, setNota] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [errorForm, setErrorForm] = useState<string | null>(null)

  // Ventana emergente de confirmación de borrado
  const [gastoAEliminar, setGastoAEliminar] = useState<Gasto | null>(null)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    let activo = true
    listarGastos(viajeId)
      .then((datos) => activo && setGastos(datos))
      .catch((e) => activo && setError(textoDeError(e)))
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
    }
  }, [viajeId])

  const visibles = useMemo(
    () =>
      gastos.filter(
        (g) =>
          (filtroFase === 'TODAS' || g.fase === filtroFase) &&
          (filtroCategoria === 'TODAS' || g.categoria === filtroCategoria),
      ),
    [gastos, filtroFase, filtroCategoria],
  )

  const totalEstimado = visibles.reduce((suma, g) => suma + g.montoEstimado, 0)
  const totalReal = visibles.reduce((suma, g) => suma + (g.montoReal ?? 0), 0)

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    setErrorForm(null)

    if (montoEstimado.trim() === '') {
      setErrorForm('Ingresá el monto estimado.')
      return
    }

    setEnviando(true)
    try {
      const nuevo = await crearGasto(viajeId, {
        descripcion: descripcion.trim(),
        categoria,
        fase,
        montoEstimado: Number(montoEstimado),
        ...(montoReal.trim() !== '' && { montoReal: Number(montoReal) }),
        ...(fecha && { fecha }),
        ...(nota.trim() && { nota: nota.trim() }),
      })
      setGastos((anteriores) => [nuevo, ...anteriores])
      setDescripcion('')
      setMontoEstimado('')
      setMontoReal('')
      setFecha('')
      setNota('')
    } catch (err) {
      setErrorForm(textoDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  const guardarReal = async (gasto: Gasto, monto: number | null) => {
    setError(null)
    try {
      const actualizado = await actualizarGasto(viajeId, gasto.id, { montoReal: monto })
      setGastos((anteriores) => anteriores.map((g) => (g.id === gasto.id ? actualizado : g)))
    } catch (err) {
      setError(textoDeError(err))
    }
  }

  const confirmarEliminacion = async () => {
    if (!gastoAEliminar) return
    const gasto = gastoAEliminar
    setEliminando(true)
    setError(null)
    try {
      await borrarGasto(viajeId, gasto.id)
      setGastos((anteriores) => anteriores.filter((g) => g.id !== gasto.id))
      setGastoAEliminar(null)
    } catch (err) {
      setError(textoDeError(err))
      setGastoAEliminar(null)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <section className="pl-inicio gastos">
      <Link to={`/viajes/${viajeId}`} className="pl-back-link">
        ← Volver al viaje
      </Link>

      <h1 className="pl-inicio-titulo">Gastos del viaje</h1>
      <p className="pl-inicio-tagline">Anotá lo que pensás gastar y completá el monto real cuando lo pagues.</p>

      <div className="gastos-acciones">
        <Link to={`/viajes/${viajeId}/gastos/comparacion`} className="pl-btn-recs">
          📊 Ver estimado vs. real
        </Link>
      </div>

      <form onSubmit={enviar} className="pl-form-card gastos-form">
        <h3>Nuevo gasto</h3>
        {errorForm && <div className="pl-error-box">{errorForm}</div>}

        <div className="pl-field">
          <label htmlFor="g-desc" className="pl-label">Descripción *</label>
          <input
            id="g-desc"
            className="pl-input"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            minLength={2}
            maxLength={120}
            placeholder="Ej: Pasaje de colectivo"
            required
          />
        </div>

        <div className="pl-field-row">
          <div className="pl-field">
            <label htmlFor="g-cat" className="pl-label">Categoría *</label>
            <select id="g-cat" className="pl-select" value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{ETIQUETA_CATEGORIA[c]}</option>
              ))}
            </select>
          </div>
          <div className="pl-field">
            <label htmlFor="g-fase" className="pl-label">Fase *</label>
            <select id="g-fase" className="pl-select" value={fase} onChange={(e) => setFase(e.target.value as Fase)}>
              {FASES.map((f) => (
                <option key={f} value={f}>{ETIQUETA_FASE[f]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pl-field-row">
          <div className="pl-field">
            <label htmlFor="g-est" className="pl-label">Monto estimado *</label>
            <input id="g-est" className="pl-input" type="number" min="0" step="0.01" value={montoEstimado} onChange={(e) => setMontoEstimado(e.target.value)} required />
          </div>
          <div className="pl-field">
            <label htmlFor="g-real" className="pl-label">Monto real (opcional)</label>
            <input id="g-real" className="pl-input" type="number" min="0" step="0.01" value={montoReal} onChange={(e) => setMontoReal(e.target.value)} />
          </div>
        </div>

        <div className="pl-field-row">
          <div className="pl-field">
            <label htmlFor="g-fecha" className="pl-label">Fecha (opcional)</label>
            <input id="g-fecha" className="pl-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div className="pl-field">
            <label htmlFor="g-nota" className="pl-label">Nota (opcional)</label>
            <input id="g-nota" className="pl-input" value={nota} onChange={(e) => setNota(e.target.value)} maxLength={300} />
          </div>
        </div>

        <button type="submit" className="pl-btn-submit" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Agregar gasto'}
        </button>
      </form>

      <div className="gastos-filtros">
        <select className="pl-select" value={filtroFase} onChange={(e) => setFiltroFase(e.target.value as Fase | 'TODAS')} aria-label="Filtrar por fase">
          <option value="TODAS">Todas las fases</option>
          {FASES.map((f) => (
            <option key={f} value={f}>{ETIQUETA_FASE[f]}</option>
          ))}
        </select>
        <select className="pl-select" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value as Categoria | 'TODAS')} aria-label="Filtrar por categoría">
          <option value="TODAS">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{ETIQUETA_CATEGORIA[c]}</option>
          ))}
        </select>
      </div>

      {error && <div className="pl-error-box">{error}</div>}

      {cargando ? (
        <p>Cargando gastos...</p>
      ) : visibles.length === 0 ? (
        <p className="gastos-vacio">
          {gastos.length === 0 ? 'Todavía no cargaste gastos. Empezá con el formulario de arriba.' : 'No hay gastos con esos filtros.'}
        </p>
      ) : (
        <>
          <div className="gastos-totales">
            <span>Estimado: <strong>{dinero(totalEstimado)}</strong></span>
            <span>Real: <strong>{dinero(totalReal)}</strong></span>
          </div>

          <ul className="gastos-lista">
            {visibles.map((g) => (
              <li key={g.id} className="gasto-card">
                <div className="gasto-info">
                  <p className="gasto-titulo">
                    <span aria-hidden="true">{ICONO_CATEGORIA[g.categoria]}</span> {g.descripcion}
                  </p>
                  <p className="gasto-meta">
                    {ETIQUETA_CATEGORIA[g.categoria]} · {ETIQUETA_FASE[g.fase]}
                    {g.fecha && ` · ${formatearFecha(g.fecha)}`}
                  </p>
                  {g.nota && <p className="gasto-nota">{g.nota}</p>}
                </div>
                <div className="gasto-montos">
                  <p className="gasto-estimado">Estimado: {dinero(g.montoEstimado)}</p>
                  <EditorReal gasto={g} onGuardar={(monto) => guardarReal(g, monto)} />
                </div>
                <button
                  type="button"
                  className="gasto-borrar"
                  onClick={() => setGastoAEliminar(g)}
                  aria-label={`Borrar ${g.descripcion}`}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {gastoAEliminar &&
        createPortal(
          <div
            className="gastos-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-gasto-titulo"
          >
            <h2 id="modal-gasto-titulo">¿Borrar el gasto «{gastoAEliminar.descripcion}»?</h2>
            <p>
              Esta acción eliminará el gasto por <strong>{dinero(gastoAEliminar.montoEstimado)}</strong> de forma permanente.
            </p>
            <div className="gastos-modal-botones">
              <button
                type="button"
                className="gastos-modal-cancelar"
                disabled={eliminando}
                onClick={() => setGastoAEliminar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="gastos-modal-confirmar"
                disabled={eliminando}
                onClick={confirmarEliminacion}
              >
                {eliminando ? 'Borrando…' : 'Sí, borrar'}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}
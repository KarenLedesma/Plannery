import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { mensajeDeError } from '../../shared/api'
import {
  actualizarActividad,
  crearActividad,
  eliminarActividad,
  listarActividades,
  listarDestinos,
} from './catalogo.api'
import type { Actividad, DatosActividad, Destino, FiltrosCatalogo } from './catalogo.api'
import { ActividadForm } from './ActividadForm'
import './catalogo.css'

const ETIQUETA_TIPO = { INTERIOR: 'Interior', EXTERIOR: 'Exterior', MIXTA: 'Mixta' }

export function CatalogoAdminPage() {
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [destinos, setDestinos] = useState<Destino[]>([])
  const [filtros, setFiltros] = useState<FiltrosCatalogo>({ tipo: '', activa: '' })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  // Subir este número vuelve a pedir la lista (por ejemplo, después de eliminar)
  const [version, setVersion] = useState(0)
  const [formulario, setFormulario] = useState<Actividad | 'nueva' | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [errorForm, setErrorForm] = useState<string | null>(null)

  // Estado para la ventana emergente de confirmación de borrado
  const [actividadAEliminar, setActividadAEliminar] = useState<Actividad | null>(null)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    listarDestinos()
      .then(setDestinos)
      .catch((e) => setError(mensajeDeError(e)))
  }, [])

  useEffect(() => {
    let vigente = true
    listarActividades(filtros)
      .then((datos) => {
        if (!vigente) return
        setActividades(datos)
        setError(null)
      })
      .catch((e) => vigente && setError(mensajeDeError(e)))
      .finally(() => vigente && setCargando(false))
    // Si cambian los filtros antes de que llegue la respuesta, se ignora la vieja
    return () => {
      vigente = false
    }
  }, [filtros, version])

  function cambiarFiltros(cambio: Partial<FiltrosCatalogo>) {
    setCargando(true)
    setAviso(null)
    setFiltros({ ...filtros, ...cambio })
  }

  function abrirFormulario(valor: Actividad | 'nueva') {
    setAviso(null)
    setErrorForm(null)
    setFormulario(valor)
  }

  async function guardar(datos: DatosActividad) {
    const editando = formulario && formulario !== 'nueva' ? formulario : null
    setGuardando(true)
    setErrorForm(null)
    try {
      if (editando) {
        await actualizarActividad(editando.id, datos)
        setAviso(`"${datos.nombre}" se actualizó.`)
      } else {
        await crearActividad(datos)
        setAviso(`"${datos.nombre}" se creó.`)
      }
      setFormulario(null)
      setCargando(true)
      setVersion((v) => v + 1)
    } catch (e) {
      setErrorForm(mensajeDeError(e))
    } finally {
      setGuardando(false)
    }
  }

  async function confirmarEliminacion() {
    if (!actividadAEliminar) return
    const actividad = actividadAEliminar
    setEliminando(true)
    setError(null)
    try {
      const respuesta = await eliminarActividad(actividad.id)
      setAviso(
        respuesta.accion === 'archivada'
          ? `"${actividad.nombre}" estaba en un itinerario, así que se archivó.`
          : `"${actividad.nombre}" se eliminó.`,
      )
      setActividadAEliminar(null)
      setCargando(true)
      setVersion((v) => v + 1)
    } catch (e) {
      setError(mensajeDeError(e))
      setActividadAEliminar(null)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <section className="pl-inicio catalogo-admin">
      <h1 className="pl-inicio-titulo">Catálogo de actividades</h1>
      <p className="pl-inicio-tagline">Acá se administran las actividades que se recomiendan en los viajes.</p>

      <div className="catalogo-barra">
        <div className="catalogo-filtros">
          <label>
            Tipo
            <select value={filtros.tipo} onChange={(e) => cambiarFiltros({ tipo: e.target.value as FiltrosCatalogo['tipo'] })}>
              <option value="">Todos</option>
              <option value="INTERIOR">Interior</option>
              <option value="EXTERIOR">Exterior</option>
              <option value="MIXTA">Mixta</option>
            </select>
          </label>
          <label>
            Estado
            <select value={filtros.activa} onChange={(e) => cambiarFiltros({ activa: e.target.value as FiltrosCatalogo['activa'] })}>
              <option value="">Todas</option>
              <option value="true">Activas</option>
              <option value="false">Archivadas</option>
            </select>
          </label>
        </div>
        {formulario === null && (
          <button
            type="button"
            className="catalogo-guardar"
            disabled={destinos.length === 0}
            onClick={() => abrirFormulario('nueva')}
          >
            Nueva actividad
          </button>
        )}
      </div>

      {formulario !== null && (
        <ActividadForm
          key={formulario === 'nueva' ? 'nueva' : formulario.id}
          destinos={destinos}
          inicial={formulario === 'nueva' ? null : formulario}
          guardando={guardando}
          error={errorForm}
          onGuardar={guardar}
          onCancelar={() => setFormulario(null)}
        />
      )}

      {aviso && <p className="catalogo-aviso" role="status">{aviso}</p>}
      {error && <p className="catalogo-error" role="alert">{error}</p>}

      {cargando ? (
        <p>Cargando…</p>
      ) : (
        <>
          <p className="catalogo-cuenta">{actividades.length} actividades</p>
          <table className="catalogo-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {actividades.map((a) => (
                <tr key={a.id}>
                  <td>{a.nombre}</td>
                  <td>{ETIQUETA_TIPO[a.tipo]}</td>
                  <td>{a.direccion ?? '—'}</td>
                  <td>
                    <span className={a.activa ? 'catalogo-sello' : 'catalogo-sello archivada'}>
                      {a.activa ? 'Activa' : 'Archivada'}
                    </span>
                  </td>
                  <td>
                    <div className="catalogo-acciones">
                      <button type="button" className="catalogo-editar" onClick={() => abrirFormulario(a)}>
                        Editar
                      </button>
                      {a.activa && (
                        <button
                          type="button"
                          className="catalogo-borrar"
                          onClick={() => setActividadAEliminar(a)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {actividadAEliminar &&
        createPortal(
          <div
            className="catalogo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-eliminar-titulo"
          >
            <h2 id="modal-eliminar-titulo">¿Eliminar «{actividadAEliminar.nombre}»?</h2>
            <p>
              Si esta actividad ya forma parte de algún itinerario, se va a <strong>archivar</strong> en lugar de borrarse para no afectar los viajes existentes.
            </p>
            <div className="catalogo-modal-botones">
              <button
                type="button"
                className="catalogo-cancelar"
                disabled={eliminando}
                onClick={() => setActividadAEliminar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="catalogo-guardar"
                disabled={eliminando}
                onClick={confirmarEliminacion}
              >
                {eliminando ? 'Eliminando…' : 'Sí, eliminar'}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}
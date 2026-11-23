import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerComparacion } from './gastos.service'
import { dinero, textoDeError } from './formato'
import { ETIQUETA_CATEGORIA, ETIQUETA_FASE, ICONO_CATEGORIA, type Comparacion, type Linea } from './tipos'
import './gastos.css'

// diferencia = real - estimado: positiva si se gastó más de lo estimado
function Diferencia({ valor }: { valor: number }) {
  if (valor === 0) return <span className="dif-cero">Sin diferencia</span>
  const demas = valor > 0
  return (
    <span className={demas ? 'dif-mas' : 'dif-menos'}>
      {demas ? '▲ ' : '▼ '}
      {dinero(Math.abs(valor))} {demas ? 'de más' : 'de menos'}
    </span>
  )
}

// Dos barras (estimado y real) con el mismo máximo para poder compararlas
function Barras({ linea, maximo }: { linea: Linea; maximo: number }) {
  const ancho = (n: number) => `${maximo > 0 ? Math.max((n / maximo) * 100, n > 0 ? 2 : 0) : 0}%`
  return (
    <div className="cmp-barras">
      <div className="cmp-pista"><div className="cmp-barra cmp-est" style={{ width: ancho(linea.estimado) }} /></div>
      <div className="cmp-pista"><div className="cmp-barra cmp-rea" style={{ width: ancho(linea.real) }} /></div>
    </div>
  )
}

export function ComparacionPage() {
  const { id } = useParams<{ id: string }>()
  const viajeId = id ?? ''
  const [datos, setDatos] = useState<Comparacion | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    obtenerComparacion(viajeId)
      .then((d) => activo && setDatos(d))
      .catch((e) => activo && setError(textoDeError(e)))
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
    }
  }, [viajeId])

  const maximo = datos
    ? Math.max(0, ...datos.porCategoria.flatMap((c) => [c.estimado, c.real]), ...datos.porFase.flatMap((f) => [f.estimado, f.real]))
    : 0

  return (
    <section className="pl-inicio gastos">
      <Link to={`/viajes/${viajeId}/gastos`} className="pl-back-link">
        ← Volver a gastos
      </Link>

      <h1 className="pl-inicio-titulo">Estimado vs. real</h1>
      <p className="pl-inicio-tagline">Compará lo que pensabas gastar con lo que gastaste, y contra tu presupuesto.</p>

      {cargando && <p>Cargando comparación...</p>}
      {error && <div className="pl-error-box">{error}</div>}

      {datos && (
        <>
          <div className="cmp-resumen">
            <div className="pl-dato">
              <p className="pl-dato-label">💵 Presupuesto</p>
              <p className="pl-dato-valor">{dinero(datos.presupuesto)}</p>
            </div>
            <div className="pl-dato">
              <p className="pl-dato-label">📝 Estimado</p>
              <p className="pl-dato-valor">{dinero(datos.total.estimado)}</p>
            </div>
            <div className="pl-dato">
              <p className="pl-dato-label">✅ Real</p>
              <p className="pl-dato-valor">{dinero(datos.total.real)}</p>
            </div>
            <div className="pl-dato">
              <p className="pl-dato-label">🪙 Disponible</p>
              <p className={`pl-dato-valor ${datos.disponible < 0 ? 'dif-mas' : ''}`}>{dinero(datos.disponible)}</p>
            </div>
          </div>

          <p className="cmp-total">
            Diferencia total: <Diferencia valor={datos.total.diferencia} />
          </p>

          {datos.total.estimado === 0 && datos.total.real === 0 ? (
            <p className="gastos-vacio">Todavía no hay gastos cargados para comparar.</p>
          ) : (
            <>
              <div className="cmp-leyenda">
                <span><i className="cmp-punto cmp-est" /> Estimado</span>
                <span><i className="cmp-punto cmp-rea" /> Real</span>
              </div>

              <h3 className="cmp-subtitulo">Por categoría</h3>
              <div className="cmp-grupo">
                {datos.porCategoria.map((c) => (
                  <div key={c.categoria} className="cmp-fila">
                    <div className="cmp-cabecera">
                      <strong>{ICONO_CATEGORIA[c.categoria]} {ETIQUETA_CATEGORIA[c.categoria]}</strong>
                      <Diferencia valor={c.diferencia} />
                    </div>
                    <Barras linea={c} maximo={maximo} />
                    <p className="cmp-cifras">Estimado {dinero(c.estimado)} · Real {dinero(c.real)}</p>
                  </div>
                ))}
              </div>

              <h3 className="cmp-subtitulo">Por fase</h3>
              <div className="cmp-grupo">
                {datos.porFase.map((f) => (
                  <div key={f.fase} className="cmp-fila">
                    <div className="cmp-cabecera">
                      <strong>{ETIQUETA_FASE[f.fase]}</strong>
                      <Diferencia valor={f.diferencia} />
                    </div>
                    <Barras linea={f} maximo={maximo} />
                    <p className="cmp-cifras">Estimado {dinero(f.estimado)} · Real {dinero(f.real)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <p className="cmp-nota">El real suma solo los gastos que ya tienen monto real cargado. Moneda: {datos.moneda}.</p>
        </>
      )}
    </section>
  )
}

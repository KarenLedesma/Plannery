-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('VIAJERO', 'ADMIN');

-- CreateEnum
CREATE TYPE "TipoActividad" AS ENUM ('INTERIOR', 'EXTERIOR', 'MIXTA');

-- CreateEnum
CREATE TYPE "CategoriaGasto" AS ENUM ('TRANSPORTE', 'ALOJAMIENTO', 'COMIDA', 'ACTIVIDADES', 'OTROS');

-- CreateEnum
CREATE TYPE "FaseGasto" AS ENUM ('ANTES', 'DURANTE', 'DESPUES');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'VIAJERO',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinos" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "latitud" DECIMAL(9,6) NOT NULL,
    "longitud" DECIMAL(9,6) NOT NULL,
    "zonaHoraria" TEXT NOT NULL DEFAULT 'America/Argentina/Buenos_Aires',

    CONSTRAINT "destinos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viajes" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "destinoId" UUID NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE NOT NULL,
    "presupuesto" DECIMAL(12,2) NOT NULL,
    "moneda" CHAR(3) NOT NULL DEFAULT 'ARS',
    "usuarioId" UUID NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "viajes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades" (
    "id" UUID NOT NULL,
    "destinoId" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "TipoActividad" NOT NULL,
    "categoria" TEXT,
    "direccion" TEXT,
    "latitud" DECIMAL(9,6),
    "longitud" DECIMAL(9,6),
    "fuente" TEXT,
    "fuenteId" TEXT,
    "relevadoEn" DATE,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerario_items" (
    "id" UUID NOT NULL,
    "viajeId" UUID NOT NULL,
    "actividadId" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "nota" TEXT,

    CONSTRAINT "itinerario_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastos" (
    "id" UUID NOT NULL,
    "viajeId" UUID NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" "CategoriaGasto" NOT NULL,
    "fase" "FaseGasto" NOT NULL,
    "montoEstimado" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "montoReal" DECIMAL(12,2),
    "fecha" DATE,
    "nota" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gastos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "destinos_slug_key" ON "destinos"("slug");

-- CreateIndex
CREATE INDEX "viajes_usuarioId_idx" ON "viajes"("usuarioId");

-- CreateIndex
CREATE INDEX "actividades_destinoId_tipo_idx" ON "actividades"("destinoId", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "actividades_fuente_fuenteId_key" ON "actividades"("fuente", "fuenteId");

-- CreateIndex
CREATE INDEX "itinerario_items_viajeId_fecha_idx" ON "itinerario_items"("viajeId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "itinerario_items_viajeId_actividadId_fecha_key" ON "itinerario_items"("viajeId", "actividadId", "fecha");

-- CreateIndex
CREATE INDEX "gastos_viajeId_fase_idx" ON "gastos"("viajeId", "fase");

-- CreateIndex
CREATE INDEX "gastos_viajeId_categoria_idx" ON "gastos"("viajeId", "categoria");

-- AddForeignKey
ALTER TABLE "viajes" ADD CONSTRAINT "viajes_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "destinos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viajes" ADD CONSTRAINT "viajes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades" ADD CONSTRAINT "actividades_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "destinos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerario_items" ADD CONSTRAINT "itinerario_items_viajeId_fkey" FOREIGN KEY ("viajeId") REFERENCES "viajes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerario_items" ADD CONSTRAINT "itinerario_items_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "actividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastos" ADD CONSTRAINT "gastos_viajeId_fkey" FOREIGN KEY ("viajeId") REFERENCES "viajes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "usuarios_ia_config" (
    "id" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,
    "proveedor" TEXT NOT NULL DEFAULT 'gemini',
    "apiKeyEncrypted" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_ia_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_ia_config_usuarioId_key" ON "usuarios_ia_config"("usuarioId");

-- AddForeignKey
ALTER TABLE "usuarios_ia_config" ADD CONSTRAINT "usuarios_ia_config_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

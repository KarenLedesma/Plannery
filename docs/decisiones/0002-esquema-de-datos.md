# 0002 · Diseño del esquema de datos

**Decisión:** esquema relacional en PostgreSQL con Prisma. Las decisiones puntuales (UUID, Decimal, Destino como tabla, actividades archivables, borrado en cascada) están explicadas una por una en `docs/modelo-de-datos.md`.

**Por qué relacional:** los datos se relacionan entre sí (usuario → viajes → itinerario y gastos), y necesitamos integridad referencial (un gasto no puede existir sin su viaje) y totales exactos.

**Qué descartamos:** una base documental (MongoDB). Serviría para guardar documentos sueltos, pero acá las consultas cruzan entidades todo el tiempo y la integridad la queremos garantizada por la base.

**Qué costo tiene:** cambiar el esquema exige migraciones, y por eso el esquema solo se modifica por pull request revisado por todo el equipo.

**Qué contestar en la defensa:** "¿Cómo evitan que un usuario vea datos de otro?" Cada consulta filtra por el usuario dueño del viaje y un recurso ajeno responde 404. Además hay tests de IDs ajenos.

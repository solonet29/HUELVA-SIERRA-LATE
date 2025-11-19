// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

const clientPromise = require('./api/db.cjs');

async function deleteDuplicateEvents() {
    console.log('Iniciando script para eliminar duplicados...');

    try {
        const client = await clientPromise;
        const db = client.db('huelva-late-db');
        const eventsCollection = db.collection('events');

        console.log('Conectado a la base de datos y a la colección "events".');

        // 1. Usar el framework de agregación para agrupar documentos duplicados
        // Se considera duplicado si tienen el mismo título, fecha y descripción.
        const duplicates = await eventsCollection.aggregate([
            {
                $group: { // Agrupamos por los campos que realmente definen un duplicado
                    _id: { title: "$title", date: "$date" },
                    ids: { $push: "$_id" }, // Guardamos todos los IDs de los documentos en el grupo
                    count: { $sum: 1 } // Contamos cuántos hay
                },
            },
            {
                $match: {
                    count: { $gt: 1 } // Filtra solo los grupos que tienen más de un documento (duplicados)
                }
            }
        ]).toArray();

        if (duplicates.length === 0) {
            console.log('¡No se encontraron eventos duplicados! La base de datos está limpia.');
            return;
        }

        console.log(`Se encontraron ${duplicates.length} grupos de eventos duplicados.`);

        // 2. Iterar sobre los grupos de duplicados y borrar los extras
        for (const group of duplicates) {
            // Conserva el primer ID y elimina el resto
            const idsToDelete = group.ids.slice(1);
            console.log(`- Para el evento "${group._id.title}", se eliminarán ${idsToDelete.length} duplicados.`);

            await eventsCollection.deleteMany({ _id: { $in: idsToDelete } });
        }

        console.log('\n¡Limpieza completada! Se han eliminado todos los eventos duplicados.');

    } catch (error) {
        console.error('Ocurrió un error durante el proceso de limpieza:', error);
    } finally {
        // Cierra la conexión para que el script finalice
        const client = await clientPromise;
        await client.close();
        console.log('Conexión a la base de datos cerrada.');
    }
}

deleteDuplicateEvents();
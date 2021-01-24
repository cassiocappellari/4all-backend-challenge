import {createConnection, getConnection} from "typeorm"

const connection = {
    async create() {
        await createConnection()
        .then(() => console.log(
            'Successfully connected with database'
            )
        )
    },
    async close() {
        await getConnection().close()
    },
    async clear() {
        const connection = getConnection()
        const entities = connection.entityMetadatas

        const entityDeletionPromises = entities.map((entity) => async () => {
            const repository = connection.getRepository(entity.name)
            await repository.query(`DELETE FROM ${entity.tableName}`)
        })

        await Promise.all(entityDeletionPromises)
    }
}

connection.create()

export default connection
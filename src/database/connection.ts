import {createConnection, getConnectionOptions, getConnection} from "typeorm"

const connection = {
    async create() {
        const connectionOptions = await getConnectionOptions(process.env.NODE_ENV)

        return createConnection({...connectionOptions, name: 'default'})
        .then(() => console.log('Successfully connected with database'))
    },
    async close() {
        await getConnection().close()
    }
}

export default connection
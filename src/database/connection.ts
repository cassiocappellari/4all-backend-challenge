import {createConnection, getConnectionOptions} from "typeorm"

export const connection = async () => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV)

    return createConnection({...connectionOptions, name: 'default'})
    .then(() => console.log('Successfully connected with database'))
}
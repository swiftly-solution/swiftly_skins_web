import { createConnection } from "mysql2/promise"

export default async (host: string, port: number, user: string, password: string, database: string): Promise<[boolean, string | null]> => {
    const connection = createConnection({ host, port, user, password, database, connectTimeout: 3000 });

    try {
        await (await connection).execute("select 1 from dual")
    } catch (err) {
        return [false, String(err)];
    }

    return [true, null];
}
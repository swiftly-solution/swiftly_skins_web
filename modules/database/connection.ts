import { RowDataPacket, createPool } from "mysql2/promise";
import { GetConfigValue } from "../config/config";

export var db = createPool({
    host: GetConfigValue('hostname'),
    user: GetConfigValue('username'),
    password: GetConfigValue('password'),
    database: GetConfigValue('database'),
    port: GetConfigValue('port'),
    multipleStatements: true
})

setInterval(async () => {
	db.execute("select 1");
}, 10000);

export const fetchDB = async <T>(query: string, params: any[]) => {
	try {
		const [result, fields]: [RowDataPacket[], any] =
			await db.execute(query, params);
		return result as T;
	} catch (err) {
		console.log(err)
		return [] as T;
	}
};

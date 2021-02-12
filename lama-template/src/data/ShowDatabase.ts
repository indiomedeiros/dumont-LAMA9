import { BaseDatabase } from "./BaseDatabase";
import { Show } from "../business/entities/Show"


export class ShowDatabase extends BaseDatabase {
    private static tableName = "lama_shows"

    private static toShowModel (show: Show):Show {
        return new Show(
            show.id,
            show.band_id,
            Show.stringToshowRole(show.week_day), 
            show.start_time, 
            show.end_time
        )
    }

    public async insertShow (show: Show): Promise<void> {
        try {
            await BaseDatabase.connection
            .insert({
                id:show.id,
                band_id:show.band_id,
                week_day: Show.stringToshowRole(show.week_day), 
                start_time: show.start_time, 
                end_time:show.end_time
            })
            .into(ShowDatabase.tableName)

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    public async selectShowByDay (week_day: string):Promise<Show[]>{
        try {
        const result = await BaseDatabase.connection
        .select("*")
        .from(ShowDatabase.tableName)
        .where({week_day})  
        .orderBy('start_time')

        return result
        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    public async selectByDay (week_day: string):Promise<Show[]>{
        try {
        const result = await BaseDatabase.connection.raw(
            `SELECT name, music_genre
            FROM lama_bands
            JOIN ${ShowDatabase.tableName}
            ON lama_shows.band_id = lama_bands.id
            WHERE lama_shows.week_day = "${week_day}"
            ORDER BY lama_shows.start_time;` 
        )
        return result[0]
        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/utils/db";

export async function GET(req: NextRequest) {
    const connection = await connect();
    try {
        const [results] = await connection.query(
            'SELECT * FROM `session` WHERE `exersice_type_id` = ? AND `max_capacity` > ?',
            [10, 10]
        );

        console.log(results);
    } catch (err) {
        console.log(err);
    }
    return NextResponse.json({});
}
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    if (method === "GET") {
        try {
            // Make a simple HTTP GET request to a dummy endpoint
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/todos/1"
            );
            const data = await response.json();

            // Return a hello world JSON response along with fetched data
            res.status(200).json({
                status: "success",
                message: "Hello World",
                data: data,
            });
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({
            status: "error",
            message: `Method ${method} not allowed`,
        });
    }
}

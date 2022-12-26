// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ts_start = Date.now();
  const resp = await fetch("https://shiroko.fly.dev/execute_sql");
  const json = await resp.json();
  const ts_end = Date.now();
  const millis = ts_end - ts_start;

  res.status(200).json({
    name: "John Doe",
    millis,
    x: import.meta.url,
    ...json,
  });
}

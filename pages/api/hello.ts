// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ytdl, { videoFormat } from "ytdl-core";

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

  const isAudioFormat = (format: videoFormat) =>
    !format.width && !format.height;

  const compareHighBitrate = (a: videoFormat, b: videoFormat) => {
    const a_val = a.audioBitrate ?? -1;
    const b_val = b.audioBitrate ?? -1;
    return b_val - a_val;
  };

  const youtubeUrl = "https://www.youtube.com/watch?v=2WKBjmJCBHw";
  const info = await ytdl.getInfo(youtubeUrl);
  const formats = info.formats
    .filter((x) => x.hasAudio && !x.hasVideo)
    .filter(isAudioFormat)
    .sort(compareHighBitrate);

  res.status(200).json({
    name: "John Doe",
    millis,
    x: import.meta.url,
    formats,
    ...json,
  });
}

import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { findIdByFunctionName, updateById } from "./repository";
import { describeFunctionUrl } from "./lambda";

type Data = {};

const Input = z.object({
  functionName: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const input = Input.parse(req.body);
  const { functionName } = input;

  const id = await findIdByFunctionName(functionName);
  const result = await describeFunctionUrl(functionName);
  await updateById(id, {
    functionUrl: result.FunctionUrl,
    functionArn: result.FunctionArn,
    creationTime: result.CreationTime,
    lastModifiedTime: result.LastModifiedTime,
  });

  res.status(200).json({
    id,
    functionName,
    functionUrl: result.FunctionUrl,
  });
}

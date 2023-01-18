import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import {
  findAll,
  findIdByFunctionName,
  updateById,
} from "../../backend/repository";
import { describeFunctionUrl } from "../../backend/lambda";

type Data = {};

const Input = z.object({
  functionName: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // TODO: 인증?

  if (req.method === "GET") {
    return await handle_list(req, res);
  } else if (req.method === "POST") {
    return await handle_update(req, res);
  } else {
    res.status(200).json({});
  }
}

async function handle_update(req: NextApiRequest, res: NextApiResponse<Data>) {
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

async function handle_list(req: NextApiRequest, res: NextApiResponse<Data>) {
  const ents = await findAll();
  const results = ents.map((x) => {
    return {
      id: x.id,
      functionName: x.functionName,
      functionUrl: x.functionUrl,
      lastModifiedTime: x.lastModifiedTime,
    };
  });

  res.status(200).json(results);
}

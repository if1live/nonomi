// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ListFunctionUrlConfigsCommand,
  LambdaClient,
} from "@aws-sdk/client-lambda";

const AWS_REGION = process.env.MY_AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.MY_AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.MY_AWS_SECRET_ACCESS_KEY;

const client = new LambdaClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log({ AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY });

  const command = new ListFunctionUrlConfigsCommand({
    FunctionName: "ayane-dev-http",
  });
  const output = await client.send(command);
  console.log(JSON.stringify(output, null, 2));
  res.status(200).json({
    name: "John Doe",
  });
}

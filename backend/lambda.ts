import { z } from "zod";
import {
  ListFunctionUrlConfigsCommand,
  LambdaClient,
} from "@aws-sdk/client-lambda";

function createLambdaClientFromEnv(): LambdaClient {
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
  return client;
}

function createLambdaClientFromDefault(): LambdaClient {
  return new LambdaClient({});
}

const lambdaClient =
  process.env.NODE_ENV === "development"
    ? createLambdaClientFromDefault()
    : createLambdaClientFromEnv();

const FunctionUrlConfig = z.object({
  AuthType: z.string(),
  FunctionArn: z.string(),
  FunctionUrl: z.string(),
  CreationTime: z.coerce.date(),
  LastModifiedTime: z.coerce.date(),
});
export type FunctionUrlConfig = z.infer<typeof FunctionUrlConfig>;

export async function describeFunctionUrl(
  functionName: string
): Promise<FunctionUrlConfig> {
  const command = new ListFunctionUrlConfigsCommand({
    FunctionName: functionName,
  });
  const output = await lambdaClient.send(command);
  if (!output.FunctionUrlConfigs) {
    throw new Error("function url not found");
  }
  if (output.FunctionUrlConfigs.length !== 1) {
    throw new Error("mismatch function url count");
  }

  const result = FunctionUrlConfig.parse(output.FunctionUrlConfigs[0]);
  return result;
}

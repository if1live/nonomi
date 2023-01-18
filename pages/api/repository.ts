import { createClient } from "@supabase/supabase-js";

function createSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseKey);
}

const supabase = createSupabase();

// 테이블 정의 하드 코딩
const tableName = "nonomi_service";
const functionNameColumn = "function_name";
const functionUrlColumn = "function_url";
const functionArnColumn = "function_arn";
const creationTimeColumn = "creation_time";
const lastModifiedTime = "last_modified_time";

export interface ServiceEntity {
  id: number;
  functionName: string;
  functionUrl: string;
  functionArn: string;
  creationTime: Date;
  lastModifiedTime: Date;
}

export async function findIdByFunctionName(
  functionName: string
): Promise<number> {
  const { data: rows, error } = await supabase
    .from(tableName)
    .select("id")
    .eq(functionNameColumn, functionName)
    .limit(1);

  if (error) throw error;
  if (!rows) throw new Error("rows is falsy");
  if (rows.length === 0) throw new Error("function not found");

  const row = rows[0];
  const id = row.id;
  if (typeof id !== "number") throw new Error("id is not number");

  return id;
}

export async function updateById(id: number, ent: Partial<ServiceEntity>) {
  await supabase
    .from(tableName)
    .update({
      [functionUrlColumn]: ent.functionUrl,
      [functionArnColumn]: ent.functionArn,
      [creationTimeColumn]: ent.creationTime,
      [lastModifiedTime]: ent.lastModifiedTime,
    })
    .eq("id", id);
}

export async function list(): Promise<Partial<ServiceEntity>[]> {
  const { data: rows, error } = await supabase.from(tableName).select("*");

  if (error) throw error;
  if (!rows) throw new Error("rows is falsy");

  const entities = rows.map((row) => {
    const ent: ServiceEntity = {
      id: row.id,
      functionName: row[functionNameColumn],
      functionUrl: row[functionUrlColumn],
      functionArn: row[functionArnColumn],
      creationTime: row[creationTimeColumn],
      lastModifiedTime: row[lastModifiedTime],
    };
    return ent;
  });
  return entities;
}

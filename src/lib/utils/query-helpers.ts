import { SQL, sql } from 'drizzle-orm';
import { AnyPgColumn, SelectedFields } from 'drizzle-orm/pg-core';
import { SelectResultFields } from 'drizzle-orm/query-builders/select.types';

export function distinctOn<Column extends AnyPgColumn>(column: Column) {
  return sql<Column['_']['data']>`distinct on (${column}) ${column}`;
}

export function jsonBuildObject<T extends SelectedFields>(shape: T) {
  const chunks: SQL[] = [];

  Object.entries(shape).forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(`,`));
    }
    chunks.push(sql.raw(`'${key}',`));
    chunks.push(sql`${value}`);
  });

  return sql<SelectResultFields<T>>`coalesce(json_build_object(${sql.join(
    chunks
  )}), '{}')`;
}

export function jsonAggBuildObject<T extends SelectedFields>(shape: T) {
  return sql<SelectResultFields<T>[]>`coalesce(jsonb_agg(${jsonBuildObject(
    shape
  )}), '[]')`;
}

export function inJsonArray<T extends SQL.Aliased<unknown[]>>(
  jsonArray: T,
  key: keyof T['_']['type'][number],
  value: string
) {
  const element = sql.raw(`${String(key)}_array_element`);

  return sql`EXISTS (
      SELECT 1
      FROM jsonb_array_elements(${jsonArray}) AS ${element}
      WHERE ${element}->>${key} = ${value}
    )`;
}

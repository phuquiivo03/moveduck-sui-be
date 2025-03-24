import { PopulateOptions } from "mongoose";

const SORT_ASC = 1;
const SORT_DESC = -1;

type SortOrder = typeof SORT_ASC | typeof SORT_DESC;

type MongooseSelectFields = string; // e.g. 'name age'

export interface MongooseQueryOptions {
  // apply()
}

export interface MongooseFindOneOptions {
  populateOptions?: PopulateOptions;
  selectFields?: MongooseSelectFields;
  filter?: Record<string, any>;
  sort?: Record<string, SortOrder>;
}

export interface MongooseFindManyOptions {
  populateOptions?: PopulateOptions;
  selectFields?: MongooseSelectFields;
  filter?: Record<string, any>;
  sort?: Record<string, SortOrder>;
  limit?: number;
  offset?: number;
}

export interface MongooseFindPageOptions {
  populateOptions?: PopulateOptions;
  selectFields?: MongooseSelectFields;
  sort?: Record<string, SortOrder>;
  page?: number;
  perPage?: number;
}

export interface MongooseUpdateOptions {
  // QueryOptions
  upsert?: boolean;
  new?: boolean;
}

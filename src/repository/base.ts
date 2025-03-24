import { AggregateOptions, Model, ObjectId, PipelineStage } from "mongoose";
import {
  MongooseFindManyOptions,
  MongooseFindOneOptions,
  MongooseUpdateOptions,
} from "./type";

// Base Repository Interface for MongoDB
interface BaseRepository<T> {
  // CREATE
  create(data: Partial<T>): Promise<T>;
  createMany(listData: Partial<T>[]): Promise<T[]>;

  // READ
  findMany(options?: MongooseFindManyOptions): Promise<T[]>;
  findById(
    id: string | ObjectId,
    options?: MongooseFindOneOptions,
  ): Promise<T | null>;
  findOne(options?: MongooseFindOneOptions): Promise<T | null>;
  // findOneScopes()
  // findPage()

  // UPDATE
  update(id: string | ObjectId, data: Partial<T>): Promise<T | null>;
  // updateMany()

  // DELETE
  deleteById(id: string | ObjectId): Promise<boolean>;
  // deleteMany()

  aggregate(
    pipeline: PipelineStage[],
    options?: AggregateOptions,
  ): Promise<any[]>;
}

// Base Repository Implementation
abstract class BaseRepositoryImpl<T> implements BaseRepository<T> {
  model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const created = await this.model.create(data);
      return created;
    } catch (error) {
      throw error;
    }
  }

  async createMany(listData: Partial<T>[]): Promise<T[]> {
    try {
      const listCreated = await this.model.create(listData);
      return listCreated;
    } catch (error) {
      throw error;
    }
  }

  async findMany(options?: MongooseFindManyOptions): Promise<T[]> {
    try {
      let query = this.model.find();

      if (options?.selectFields) {
        query = query.select(options.selectFields);
      }
      if (options?.sort) {
        query = query.sort(options.sort);
      }
      if (options?.offset) {
        query = query.skip(options.offset);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.populateOptions) {
        query = query.populate(options.populateOptions);
      }

      if (options?.filter) {
        query = query.where(options.filter);
      }

      const listData = await query.exec();
      return listData;
    } catch (error) {
      throw error;
    }
  }

  async findById(
    id: string | ObjectId,
    options?: MongooseFindOneOptions,
  ): Promise<T | null> {
    try {
      let query = this.model.findById(id);

      if (options?.selectFields) {
        query = query.select(options.selectFields);
      }

      if (options?.populateOptions) {
        query = query.populate(options.populateOptions);
      }

      const data = await query.exec();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findOne(options?: MongooseFindOneOptions): Promise<T | null> {
    try {
      let query = this.model.findOne();

      if (options?.filter) {
        query = query.where(options.filter);
      }

      if (options?.selectFields) {
        query = query.select(options.selectFields);
      }

      if (options?.sort) {
        query = query.sort(options.sort);
      }

      if (options?.populateOptions) {
        query = query.populate(options.populateOptions);
      }

      const data = await query.exec();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string | ObjectId,
    data: Partial<T>,
    options: MongooseUpdateOptions = {
      new: true,
      upsert: false,
    },
  ): Promise<T | null> {
    try {
      const updated = await this.model
        .findByIdAndUpdate(id, data, options)
        .exec();
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string | ObjectId): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      throw error;
    }
  }

  async aggregate(
    pipeline: PipelineStage[],
    options?: AggregateOptions,
  ): Promise<any[]> {
    try {
      const result = await this.model.aggregate(pipeline, options).exec();
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export { BaseRepository, BaseRepositoryImpl };

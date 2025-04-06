import { model, Schema } from "mongoose"
import { Pool } from "../type/pool"


const DOCUMENT_NAME= "Pool"
const COLLECTION_NAME = "Pools"

// Schema for the PoolParams
const PoolParamsSchema = new Schema<Pool>({
 

    poolId: {
      type: Schema.Types.Mixed, // Using Mixed type to handle different value types
      required: true
    }
  }, { _id: false, timestamps: true }); // Disable automatic _id for subdocuments
  

const schema = new Schema<Pool>({
    poolId: {type: String, required: true},
}, {timestamps: true, collection: COLLECTION_NAME}
)


export default model<Pool>(DOCUMENT_NAME, schema)

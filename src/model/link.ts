import { model, Schema } from "mongoose"
import { Link, LinkParams } from "../type/link"


const DOCUMENT_NAME= "Link"
const COLLECTION_NAME = "Links"

// Schema for the LinkParams
const LinkParamsSchema = new Schema<LinkParams>({
    index: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'object', 'array'],
      required: true
    },
    value: {
      type: Schema.Types.Mixed, // Using Mixed type to handle different value types
      required: true
    }
  }, { _id: false }); // Disable automatic _id for subdocuments
  

const schema = new Schema<Link>({
    linkId: {type: String, required: true},
    function: {type: String, required: true},
    params: {type: [LinkParamsSchema], required: true, default: []},
    typeArguments: {type: [String], required: true, default: []}
}, {timestamps: true, collection: COLLECTION_NAME}
)


export default model<Link>(DOCUMENT_NAME, schema)

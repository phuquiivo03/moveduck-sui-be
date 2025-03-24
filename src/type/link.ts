import { ObjectId } from "mongoose";

export type Link = {
    _id?: ObjectId;
    linkId: string;
    function: string;
    params: LinkParams[];
    typeArguments: string[];
}

export type LinkParams = {
    index: number;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    value: string | number | boolean | object | Array<any>;
}
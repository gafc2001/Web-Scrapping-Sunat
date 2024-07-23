import { Response } from "express";
import { RazonSocial } from "./RazonSocial";
import { RucResult } from "./RucResult";

type Send<ResBody = any, T = Response<ResBody>> = (body?: ResBody) => T;

export interface CustomResponse<T> extends Response {
   json: Send<T, this>
}

export interface ErrorResponseRazonSocial {
   error?: string;
   data?: RazonSocial[];
 }

export interface ErrorResponseRucResult {
   error?: string;
   data?: RucResult;
}

export interface ResponseData {
   error?: string;
   data?: any
}
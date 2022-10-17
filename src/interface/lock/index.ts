import * as path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const  LOCK_PROTO_PATH = path.join(path.dirname(path.dirname(__dirname)), 'protos/lock.proto');

const lockPackageDefinition = protoLoader.loadSync(LOCK_PROTO_PATH);
// @ts-ignore
export const {Lock}:NodeJS.Dict<grpc.ServiceClientConstructor>  = grpc.loadPackageDefinition(lockPackageDefinition).v3lockpb
import * as path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const  RPC_PROTO_PATH = path.join(path.dirname(path.dirname(__dirname)), 'protos/rpc.proto');

const rpcPackageDefinition = protoLoader.loadSync(RPC_PROTO_PATH);
// @ts-ignore
export const {KV,Watch,Lease,Cluster,Maintenance,Auth}:NodeJS.Dict<grpc.ServiceClientConstructor> = grpc.loadPackageDefinition(rpcPackageDefinition).etcdserverpb

import * as path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const  ELECTION_PROTO_PATH = path.join(path.dirname(path.dirname(__dirname)), 'protos/election.proto');

const electionPackageDefinition = protoLoader.loadSync(ELECTION_PROTO_PATH);

// @ts-ignore
export const {Election}:NodeJS.Dict<grpc.ServiceClientConstructor>  = grpc.loadPackageDefinition(electionPackageDefinition).v3electionpb
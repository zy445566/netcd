import * as path from 'path';
import * as assert from 'assert';
import {describe, it, after} from 'mocha';
import * as grpc from '@grpc/grpc-js'
import {Netcd, Metadata} from '../index';
import * as protoLoader from '@grpc/proto-loader'

const  RPC_PROTO_PATH = path.join(path.dirname(__dirname), 'protos/rpc.proto');

const rpcPackageDefinition = protoLoader.loadSync(RPC_PROTO_PATH);
const etcdserverpb = grpc.loadPackageDefinition(rpcPackageDefinition).etcdserverpb

const port = '50051'
const netcd = new Netcd({
  endpoints:[`127.0.0.1:${port}`]
})

const server = new grpc.Server();

// @ts-ignore
server.addService(etcdserverpb.KV.service,
  {
    Range: (call, callback) => {
      callback(null, 
        {
          "header": {
              "cluster_id": "14841639068965178418",
              "member_id": "10276657743932975437",
              "revision": "2",
              "raft_term": "3"
          },
          "kvs": [
              {
                  "key": call.request.key,
                  "create_revision": "2",
                  "mod_revision": "2",
                  "version": "1",
                  "value": Buffer.from("test_value")
              }
          ],
          "count": "1"
        }
      );
    }
  }
);
// @ts-ignore
server.addService(etcdserverpb.Auth.service,
  {
    Authenticate: (call, callback) => {
      callback(null, 
        {
          "header": {
              "cluster_id": "14841639068965178418",
              "member_id": "10276657743932975437",
              "revision": "2",
              "raft_term": "3"
          },
          "token": 'testtoken.01',
          "count": "1"
        }
      );
    }
  }
);
server.bindAsync(`127.0.0.1:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});

describe('KV', function () {
  describe('#Range()', function () {
    it('get Range return test data', async function () {
      const authClient = netcd.getClient('Auth')
      const authData:any = await new Promise((reslove, reject)=>{
        authClient.Authenticate({"name": "root", "password": "a123456"},(err,data)=>{
          if(err)return reject(err)
          reslove(data)
        })
      })
      assert.equal(authData.token, 'testtoken.01', 'get token error')
      const client = netcd.getClient('KV')
      const meta = new Metadata()
      meta.add('Authorization', authData.token);
      const res:any = await new Promise((reslove, reject)=>{
        client.Range({key:Buffer.from('test_key').toString('base64')},meta,(err,data)=>{
          if(err)return reject(err)
          reslove(data)
        })
      })
      assert.equal(res.kvs[0].value.toString(), 'test_value', 'get Range error')
      
    });
  });
});
after(()=>{
  server.tryShutdown((error)=>{
    console.log(error)
  })
})
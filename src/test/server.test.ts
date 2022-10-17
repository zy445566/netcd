import {describe, it} from 'mocha';
import {Netcd, Metadata} from '../index';

const netcd = new Netcd({
  endpoints:['127.0.0.1:2379']
})

describe('KV', function () {
  describe('#Range()', function () {
    it('should return test data', async function () {
      const authClient = netcd.getClient('Auth')
      authClient.Authenticate({"name": "root", "password": "a123456"},(err,authData)=>{
        const client = netcd.getClient('KV')
        const meta = new Metadata()
        meta.add('Authorization', authData.token);
        client.Range({key:Buffer.from('test').toString('base64')},meta,(err,data)=>{
          console.log(err,data)
        })
      })
      
    });
  });
});
# netcd
netcd is the official node.js client for [etcd](https://github.com/etcd-io/etcd) v3.

### Usage

```ts
import {Netcd, Metadata} from 'netcd'
// create client using endpoints
const netcd = new Netcd({
  endpoints:['127.0.0.1:2379']
})
```

```ts
const key = Buffer.from("test_key").toString('base64')
const value = "test_value"
const authClient = netcd.getClient('Auth')
authClient.Authenticate({"name": "root", "password": "a123456"},(err,authData)=>{
    const client = netcd.getClient('KV')

    // auth
    const meta = new Metadata()
    meta.add('Authorization', authData.token);

    client.Put({key:btoa('test_key'),value},meta,(err,data)=>{
        console.log(err,data)
    })

    // get the key
    client.Range({key:btoa('test_key'),rangeEnd:btoa('test_key')},meta,(err,data)=>{
        console.log(err,data)
    })

    // delete the key
    client.DeleteRange({key:btoa('test_key')},meta,(err,data)=>{
        console.log(err,data)
    })
})

```

For full etcd v3 API, plesase refer to the [official API documentation](https://etcd.io/docs/current/learning/api/).
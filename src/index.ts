import {Election} from './interface/election/index'
import {Lock} from './interface/lock/index'
import {KV,Watch,Lease,Cluster,Maintenance,Auth} from './interface/rpc/index'
import * as grpc from '@grpc/grpc-js'
import {ClientConfig}  from './types'


export * as types  from './types'
export * from '@grpc/grpc-js'

const serviceMap = {
    Election,
    Lock,
    KV,Watch,Lease,Cluster,Maintenance,Auth
}
export class Netcd {
    clientConfig:ClientConfig
    serviceInstanceMap:Map<string,any>=new Map()
    constructor(clientConfig:ClientConfig) {
        this.clientConfig = clientConfig
    }

    private randomEndpoint() {
        const randomIndex = Math.floor(Math.random()* this.clientConfig.endpoints.length)
        return this.clientConfig.endpoints[randomIndex]
    }

    getClient(clientName) {
        if(!serviceMap[clientName]) {
            throw new Error(`clientName only have ${Object.keys(serviceMap).join()}`)
        }
        if(this.serviceInstanceMap.has(clientName)) {
            return this.serviceInstanceMap.get(clientName)
        }
        this.serviceInstanceMap.set(clientName, new serviceMap[clientName](
            this.randomEndpoint(), 
            grpc.credentials.createInsecure()
        ))
        return this.serviceInstanceMap.get(clientName)
    }
    
}
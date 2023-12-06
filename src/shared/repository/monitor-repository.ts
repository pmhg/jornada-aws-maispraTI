/* eslint-disable import/no-extraneous-dependencies */
import * as AWS from 'aws-sdk'

import { CrudRepository } from '@pmhg/leeurope-crud-repository-dynamodb'

import { DocumentClient, ScanOutput } from 'aws-sdk/clients/dynamodb'
import { MonitorModel } from '../models-dynamo/monitor-model'



const doc = new AWS.DynamoDB.DocumentClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: 'http://localhost:8000/'
})

AWS.config.update({ region: process.env.AWS_REGION })
const uuid = require('uuid');
export class MonitorRepository extends CrudRepository<MonitorModel> {
  constructor () {
    super(MonitorModel)
    if (process.env.ENV === 'dev2') {
      this.db = doc
    }
  }

  // public async findAll (contextId = 'minuta-latam'): Promise<RouteModel[]> {
  public async findAll (contextId = 'mentoria'): Promise<MonitorModel[]> {
    try {
    
      const result: any = await this.db.scan({
        TableName: this.table,
        FilterExpression: 'contextId = :contextId',
        ExpressionAttributeValues: {
          ':contextId': contextId
        },
        Limit: 100
      }).promise()

    
      return this.toModel(result)
    } catch (error) {
      console.log(error)
    }
  }

  private toModel (data: ScanOutput): MonitorModel[] {
    return data.Items
      ? data.Items.map((Item) => this.mapper.fromItem(Item, MonitorModel))
      : []
  }

  public async createMonitorContent (monitor = null): Promise<any> {
    try{

    let result: any
    const id = uuid.v4();
    console.log('createMonitorContent',id)
    console.log('createMonitorContent',monitor)
    const createDate=new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 - 3 * 3600000).toISOString()
    const pkData = id;
    const skData = `${id}|${monitor.status}|${createDate}`
    console.log('createMonitorContent',skData)
    console.log('createMonitorContent',this.table)
    const input: DocumentClient.PutItemInput = {
        TableName: this.table,
        Item: {
          pk: pkData, //monitor.contextId,
          sk: skData, //id,
          createdAt: createDate, //new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 - 3 * 3600000).toISOString(),
          updatedAt: createDate, //new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 - 3 * 3600000).toISOString(),
          //...monitor,
          contextId: monitor.contextId,
          status:monitor.status,
          status_description:monitor.status_description
        }
      }
      result = await this.db.put(input).promise()
      

    console.log('result monitor------', result)
    return result
    } catch(err) {
      console.log('erro ao salvar dados dynamoDB', err)
    }
  }


}

export const monitorRepository = new MonitorRepository()

/* eslint-disable no-useless-escape */
import { SqsOrHttpEvent, ResponseCreator } from '@pmhg/leeurope-http-aws-api-node'
import { Op, UniqueConstraintError } from 'sequelize'
import { cryptoModelRepository } from '../../repository/crypto-repository'
import { CryptoBuilder } from '../../builders/CryptoBuilder'
import { CryptoResponse } from '../../dto/crypto-response'
import { CreateCryptoRequestDTO } from '../../dto/create-crypto-request'
import CryptoModel from '../../models/crypto-model'
import { CryptoRequestUpdate } from '../../dto/crypto-request-update'
import { BAD_REQUEST } from 'http-status-codes'
import { INVALID_PARAMS } from '../../http-codes'
import  s3Service  from '../../service/S3-service';

import * as crypto from 'crypto';
import moment = require('moment');
import { SendMessageResult } from 'aws-sdk/clients/sqs'
import AWS = require('aws-sdk')
const { error } = ResponseCreator
const uuid = require('uuid');

const { REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY, MONITOR_QUEUE } = process.env;


AWS.config.update({
    accessKeyId: ACCESS_KEY_ID,
    region: REGION,
    secretAccessKey: SECRET_ACCESS_KEY,
});
export class CryptoService {
  private readonly API_LINK = process.env.API_LINK;

  public async findCrypto (): Promise<any> {
    const result = await cryptoModelRepository.findCrypto()
    if(result){
        const sqsObj={
            contextId:'mentoria',
            result:{status:'200',data:'buscando lista de cripto'},
          }
          await this.postSqs(sqsObj);
    }
    return result;
    console.log('result',result)
   
  
  }

  public async updateCrypto (cryptoProperties, idCrypto) {
    try {
      //if (await updateUserSchema.validateAsync(userProperties)) {
        const cryptoModel = await this.createCryptoFromRequestDTO(cryptoProperties);
        cryptoModel.id = idCrypto;
        console.log("cryptoModelUpdate:",cryptoModel);
        //if (this.isValidProperties(userModel , new UserRequestUpdate())) {
          const [user] = await Promise.all([
            cryptoModelRepository.updateCryptoById(cryptoModel, idCrypto)
          ])
          return user
        //}
     // }
    } catch (err) {
      console.log('UserService::updateUser', JSON.stringify(err))
      if (err.isJoi === true) {
        throw error(BAD_REQUEST, err.details, err)
      }
      throw err
    }
  }

  public async createCrypto (result: CreateCryptoRequestDTO): Promise<CryptoModel> {
    try {
    //  if (await userSchema.validateAsync(result)) {
        const crypto = await this.createCryptoFromRequestDTO(result)
      
        const cryptoSaved = await this.saveCrypto(crypto)
        return cryptoSaved
    //  }
    } catch (err) {
      console.log('Error', JSON.stringify(err))
      if (err.isJoi === true) {
        throw error(BAD_REQUEST, err.details, err)
      }
      throw err
    }
  }

  private async saveCrypto (crypto: CryptoModel): Promise<CryptoModel> {
    try {
      const criptoSaved = await crypto.save()
     
      return this.cleanUnusedPropertiesToReturn(criptoSaved.toJSON())
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw error(BAD_REQUEST, INVALID_PARAMS, err.errors)
      }
      throw err
    }
  }

  private cleanUnusedPropertiesToReturn (crypto: any): CryptoModel {
  
    Object.entries(crypto).forEach(([key, value]) => {
      if (value === null) {
        delete crypto[`${key}`]
      }
    })
    return <CryptoModel>crypto
  }

  private async createCryptoFromRequestDTO (result: CreateCryptoRequestDTO): Promise<CryptoModel> {
    const userBuilder = new CryptoBuilder()
      .produceBasicData(result)
   
    const crypto = userBuilder.getCrypto()
    console.log('cryptoService::createcryptoFromRequestDTO - crypto built with properties: ', crypto)
    return crypto
  }

  private isValidProperties (userProperties, instanceToValidate: CryptoRequestUpdate | CreateCryptoRequestDTO) {
    const invalidProperties = []
    Object.entries(userProperties).forEach(([key, _]) => {
      if (!Object.prototype.hasOwnProperty.call(instanceToValidate, key)) {
        invalidProperties.push(`[${key}] is not a valid property`)
      }
    })
    console.log('UserService::isValidProperties - invalid properties :', invalidProperties)
    if (invalidProperties.length) throw error(BAD_REQUEST, INVALID_PARAMS, invalidProperties)
    return true
  }

  private async transformQueryResultToUsersDTO (result: CryptoResponse[]) {
    return await Promise.all(result.map(async (row) => CryptoResponse.builder(row)))
  }

  public async postS3(data:any){
    console.log('postS3',JSON.stringify(data))
    try {
      const buffer = Buffer.from(JSON.stringify(data), 'utf-8');
      const params = {
        Bucket: 'jornada-api-aws',
        Key: `jornadaAWS/crypto.json`,
        ContentType: 'application/json',
        Body: buffer
      };
      console.log('s3File');
      const s3File = await s3Service.putObjectInBucket(params);
      console.log('s3File',s3File);
      return data;
    } catch (e){
      console.log(e)
    }
   
  }

  
    private async postSqs(eventRequest): Promise<SendMessageResult> {
      try {
          const sqs = new AWS.SQS();
  
          const result = await sqs.sendMessage({
              MessageGroupId: 'MONITOR',
              MessageDeduplicationId: uuid.v4(),
              MessageBody: JSON.stringify(eventRequest),
              QueueUrl: MONITOR_QUEUE,
          }).promise();
  
          return result;
  
      }
      catch (err) {
          console.log('postSqs::postSqs', JSON.stringify(err))
          throw err
      }
  }
}

export const cryptoService = new CryptoService()

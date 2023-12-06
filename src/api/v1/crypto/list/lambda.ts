
import '../../../../shared/db';
import {sequelize} from "../../../../shared/db";
import { Content, Endpoint, execute, ResponseCreator, SqsOrHttpEvent } from '@pmhg/leeurope-http-aws-api-node'
import { OK } from 'http-status-codes'
import { CRYPTO_FOUND } from '../../../../shared/http-codes'
import { CryptoResponse } from '../../../../shared/dto/crypto-response'
import { cryptoService } from '../../../../shared/service/crypto/crypto-service'

const { success } = ResponseCreator

interface ICryptoResponse { cryptos: CryptoResponse[]}

export const endpoint: Endpoint<SqsOrHttpEvent, ICryptoResponse> = async (event): Content<any> => {
  const result  = await cryptoService.findCrypto();
  console.log("iniciando a lambda")
  const posts3 = await cryptoService.postS3(result)
  const CRYPTO_FOUND_SUCCESS = CRYPTO_FOUND;
  return success(OK, CRYPTO_FOUND_SUCCESS, { cryptos: result })
}

module.exports.execute = execute(endpoint)



import { Content, Endpoint, execute, ResponseCreator, SqsOrHttpEvent } from '@pmhg/leeurope-http-aws-api-node'
import { CREATED, BAD_REQUEST } from 'http-status-codes'
import '../../../../shared/db';
import {sequelize} from "../../../../shared/db";
import { CRYPTO_CREATED, FIELD_IS_RQUIRED } from '../../../../shared/http-codes'
import { cryptoService } from '../../../../shared/service/crypto/crypto-service'
import { log } from 'console'
import CryptoModel from '../../../../shared/models/crypto-model'
const { success, error } = ResponseCreator

interface ICryptoResponse { crypto: CryptoModel; }

export const endpoint: Endpoint<SqsOrHttpEvent, ICryptoResponse> = async (event): Content<ICryptoResponse> => {
  const crypto = JSON.parse(event.body)
  if (!crypto) throw error(BAD_REQUEST, FIELD_IS_RQUIRED.replace('%field%', 'user'), [])
  const cryptoCreated = await cryptoService.createCrypto(crypto)
  console.log(cryptoCreated)
  return success(CREATED, CRYPTO_CREATED, { crypto: cryptoCreated })
}

module.exports.execute = execute(endpoint)

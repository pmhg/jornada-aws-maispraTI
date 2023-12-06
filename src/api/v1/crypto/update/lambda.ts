

import { Content, Endpoint, execute, ResponseCreator, SqsOrHttpEvent } from '@pmhg/leeurope-http-aws-api-node'
import { CREATED, BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes'
import '../../../../shared/db';
import {sequelize} from "../../../../shared/db";
import { CRYPTO_CREATED, CRYPTO_NOT_FOUND, CRYPTO_UPDATED, FIELD_IS_RQUIRED, INVALID_PARAMS } from '../../../../shared/http-codes'
import { cryptoService } from '../../../../shared/service/crypto/crypto-service'
import { log } from 'console'
import CryptoModel from '../../../../shared/models/crypto-model'
const { success, error } = ResponseCreator

interface ICryptoResponse { crypto: CryptoModel; }

export const endpoint: Endpoint<SqsOrHttpEvent, ICryptoResponse> = async (event): Content<ICryptoResponse> => {
    const idCrypro = event.pathParameters?.idCrypto
    const cryptoProperties = JSON.parse(event.body)
    if (isNaN(parseInt(idCrypro))) throw error(BAD_REQUEST, INVALID_PARAMS, [])
    const crypto = await cryptoService.updateCrypto(cryptoProperties, idCrypro)
    if (!crypto) throw error(NOT_FOUND, CRYPTO_NOT_FOUND.replace('%field%', 'id').replace('%value%', idCrypro.toString()), [])
    return success(OK, CRYPTO_UPDATED, null)
}

module.exports.execute = execute(endpoint)

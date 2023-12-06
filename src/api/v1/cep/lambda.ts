import { Content, Endpoint, execute, ResponseCreator, SqsOrHttpEvent } from '@pmhg/leeurope-http-aws-api-node'
import { CREATED, BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes'
import '../../../shared/db';
import {sequelize} from "../../../shared/db";
import { CEP_NOT_FOUND, INVALID_PARAMS } from '../../../shared/http-codes'
import { cepService } from '../../../shared/service/cep/cep-service'

const { success, error } = ResponseCreator

interface ICepResponse { cep: any; }

export const endpoint: Endpoint<SqsOrHttpEvent, ICepResponse> = async (event): Content<ICepResponse> => {
    const cep = event.pathParameters?.cep
  
    if (isNaN(parseInt(cep))) throw error(BAD_REQUEST, INVALID_PARAMS, [])
    const result = await cepService.buscaCep(cep)
    if (!result) throw error(NOT_FOUND, CEP_NOT_FOUND.replace('%field%', 'id').replace('%value%', cep.toString()), [])
    return success(OK,'CEP ENCONTRADO',{cep:result})
}

module.exports.execute = execute(endpoint)

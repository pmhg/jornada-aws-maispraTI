import { Content, Endpoint, execute, ResponseCreator, SqsOrHttpEvent } from '@pmhg/leeurope-http-aws-api-node'
import { CREATED, BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes'
import '../../../shared/db';
import {sequelize} from "../../../shared/db";
import { SORTEADO_NOT_FOUND, INVALID_PARAMS } from '../../../shared/http-codes'
import { sorteioService } from '../../../shared/service/sorteio/sorteio-service'

const { success, error } = ResponseCreator

interface ISorteioResponse { sorteado: any; }

export const endpoint: Endpoint<SqsOrHttpEvent, ISorteioResponse> = async (event): Content<ISorteioResponse> => {
  
  
    const result = await sorteioService.buscaSorteado()
    if (!result) throw error(NOT_FOUND, SORTEADO_NOT_FOUND, [])
    return success(OK,'SORTEADO',{sorteado:result})
}

module.exports.execute = execute(endpoint)

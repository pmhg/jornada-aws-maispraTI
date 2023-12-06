import {
    Content,
    Endpoint,
    execute,
    ResponseCreator,
    SqsOrHttpEvent,
  } from "@pmhg/leeurope-http-aws-api-node";
  
  
  import { OK } from "http-status-codes";
  
  const { success } = ResponseCreator;
  
  interface IResponse {
      data: string,
      status: string
  }

  export const endpoint: Endpoint<SqsOrHttpEvent, IResponse> = async (event): Content<any> => {
    
      console.log('logando: ');
      const obj:IResponse={
        'status':'200',
        'data':"dados de retorno jornada aws"
      }
  
      return success(OK, 'Response',obj);
  };
  
  module.exports.execute = execute(endpoint);
  
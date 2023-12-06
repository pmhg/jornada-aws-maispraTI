
import { Content, Endpoint, execute, ResponseCreator, SqsOrHttpEvent } from '@pmhg/leeurope-http-aws-api-node'
import { OK } from 'http-status-codes'
import { monitorService } from '../../../shared/service/monitor/monitor-service'


const { success, error } = ResponseCreator

interface IStatusResponse { status: any; } //ver melhor os returns

export const endpoint: Endpoint<SqsOrHttpEvent, IStatusResponse> = async (event): Content<IStatusResponse> => {
  try {
    console.log('listener start')
    console.log('mensagem SQS', event.Records[0].body); // event.Records[0] --> vem da sqs

    const requisicao = JSON.parse(event.Records[0].body);

    console.log('requisição', requisicao);
    const monitor = await monitorService.monitorService(requisicao.contextId,requisicao.result)
          
    //atualizar status na dynamo -> chamar função do service que faz a lógica do update -> chama a função do repo que faz a query de update (put)
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "SQS event processed.",
        input: event,
      }),
    };
    return success(OK, null, { status: response })
  } catch (err) {
    if (err) {
      throw error(400, err.message, err.errors)
    }
    throw err
  }
}

module.exports.execute = execute(endpoint)




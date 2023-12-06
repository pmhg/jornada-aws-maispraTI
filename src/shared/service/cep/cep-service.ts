import { request, ResponseCreator } from "@pmhg/leeurope-http-aws-api-node";

import { BAD_REQUEST } from "http-status-codes";
import { Response } from "../../dto/default-response";
import { INVALID_PARAMS } from "../../http-codes";

const { error } = ResponseCreator
export class CepService {
    public async buscaCep (cep: string): Promise<any> {
        try {
          const response = await request().get(
            `https://viacep.com.br/ws/${cep}/json/`,
            {
              json: true,
            }
          );
          const retorno: any = response.body;
          console.log("retorno", JSON.stringify(response.body));
          return Response.builder(retorno);
        } catch (err) {
          if (err) {
            throw error(BAD_REQUEST, INVALID_PARAMS, err.errors)
          }
          throw err
        }
      }

}
export const cepService = new CepService()




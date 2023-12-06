import { request, ResponseCreator } from "@pmhg/leeurope-http-aws-api-node";

import { BAD_REQUEST } from "http-status-codes";
import { Response } from "../../dto/default-response";
import { INVALID_PARAMS } from "../../http-codes";
import  s3Service  from '../../service/S3-service';
import AWS = require("aws-sdk");
const { error } = ResponseCreator
export class SorteioService {

  private async  buscarDoS3() {
   
    try {
      const s3 = new AWS.S3();
      const params = {
          Bucket: 'jornada-api-aws',
          Key: `jornadaAWS/emails.json`,
          ResponseContentType: 'application/json'
      };
      const response = await s3.getObject(params).promise();
      const conteudoJson = response.Body.toString();
      const arrayDeEmails = JSON.parse(conteudoJson);
      return arrayDeEmails;
    } catch (error) {
      console.error('Erro ao buscar o arquivo JSON do S3:', error);
      throw error;
    }
  }
  
  public async buscaSorteado(): Promise<string> {
    try {
      const listaEmails: string[] = await this.buscarDoS3()
  
      // Use um Set para remover duplicatas
      const setDeEmails = new Set(listaEmails);
  
      // Converta o Set de volta para um array
      const arrayDeEmailsSemDuplicatas = Array.from(setDeEmails);
  
      if (arrayDeEmailsSemDuplicatas.length === 0) {
        throw new Error("A lista de emails está vazia após a remoção de duplicatas.");
      }
  
      // Agora, você pode prosseguir com a lógica de sorteio, se necessário
      const indiceSorteado: number = Math.floor(Math.random() * arrayDeEmailsSemDuplicatas.length);
      const emailSorteado: string = arrayDeEmailsSemDuplicatas[indiceSorteado];
  
      return emailSorteado;
    } catch (err) {
      // Trate os erros conforme necessário
      throw err;
    }
  }

}
export const sorteioService = new SorteioService()




import { Op } from 'sequelize'
import { SqsOrHttpEvent, ResponseCreator } from '@pmhg/leeurope-http-aws-api-node'
import { CryptoResponse } from '../dto/crypto-response'
import CryptoModel from '../models/crypto-model'

import * as crypto from 'crypto';
import { BAD_REQUEST } from 'http-status-codes'
import { INVALID_PARAMS } from '../http-codes'
const { error } = ResponseCreator
export class CryptoModelRepository {
  public async findCrypto (): Promise<CryptoResponse[]> {
    try {
      const result: CryptoModel[] = await CryptoModel.findAll({
        attributes: ['id', 'nome', 'simbolo', 'valor' ],
      })
      const cryptoPromises: Promise<CryptoResponse>[] = result.map(async (event: any) => {
        const crypto = await CryptoResponse.builder(event.dataValues); //map aplica a cada row da tabela (cada resultado da query) a funcao builder (para criar extrato response))
        return crypto;
      });

      // Aguardando a conclusão de todas as promessas
      const cryptoList: CryptoResponse[] = await Promise.all(cryptoPromises);

      return cryptoList; //lista de objetos do tipo crypto Response
     
    } catch (error) {
      console.log(error)
    }
  }

  // public async findUserById (id: string): Promise<UserResponse> {
  //   try {
  //     const result: any = await UsersModel.findAll({
  //       attributes: ['cd_idt_authentication', 'nm_user', 'ds_context', 'dt_create', 'bl_active' ],
       
  //       where: {
  //         cd_idt_authentication: {
  //           [Op.eq]: id
  //         }
  //       }
    
  //     })
  //     console.log(`UsersModelRepository::findUserById - Query result: ${JSON.stringify(result, null, 2)}`)
  //     return UserResponse.builder(result[0].dataValues)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  

  public async updateCryptoById (cryptoProperties: any, id: string): Promise<any> {
   
    const updatedCrypto = await CryptoModel.update({
      ...cryptoProperties.dataValues
    }, {
      where: {
        id: id
      }
    })
    return  updatedCrypto
  }

  public async deleteUserById (id: string): Promise<any> {
    console.log(`UsersModelRepository::deleteUserById - Deleting User with id: ${id}`)
    const deletedCrypto = await CryptoModel.destroy({ where: { id: id } })
    return deletedCrypto
  }
}

export const cryptoModelRepository = new CryptoModelRepository()

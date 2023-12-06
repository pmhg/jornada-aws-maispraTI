import { CreateCryptoRequestDTO } from '../dto/create-crypto-request'
import CryptoModel from '../models/crypto-model'
import { hash } from 'bcryptjs'
import * as cryptoRandomString from 'crypto-random-string'
import { timeStamp } from 'console'

export class CryptoBuilder {
  private crypto: CryptoModel;
  private cryptoRequestDTO: CreateCryptoRequestDTO;

  constructor () {
    this.reset()
  }

  public reset (): void {
    this.crypto = new CryptoModel()
    this.cryptoRequestDTO = undefined
  }

  public produceBasicData (result: CreateCryptoRequestDTO): CryptoBuilder {
    console.log('CryptoBuilder::produceBasicData')

    this.crypto.nome = result.nome;
    this.crypto.simbolo = result.simbolo
    this.crypto.valor = result.valor
    this.cryptoRequestDTO = result
    return this
  }

  public getCrypto (): CryptoModel {
    const result = this.crypto
    this.reset()
    return result
  }
}


export class CryptoResponse {
  constructor (result?) {
    this.id = parseInt(result?.id)
    this.nome = result?.nome
    this.simbolo = result?.simbolo
    this.valor = result?.valor
  }
  public id?: number;
  public nome?: string;
  public simbolo?: string;
  public valor?:number

  

  
  static async builder (result): Promise<CryptoResponse> {
    console.log('builder',result)
    const cryptoResponse = new CryptoResponse(result)
    return cryptoResponse
  }
}

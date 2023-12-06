export class Response {
    constructor(result?) {
      this.status = result?.status || 200;
      this.data = result;
    }
  
    public status: string;
    public data: any;
  
    static async builder(result): Promise<Response> {
      const response = new Response(result);
      return response;
    }
  }
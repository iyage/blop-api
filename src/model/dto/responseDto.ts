export class responseDto {
  message: string;
  status: number;
  data?: Object;
  public constructor(message: string, status: number, data: object) {
    this.data = data;
    this.message = message;
    this.status = status;
  }
}

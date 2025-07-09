// 커스텀 HTTP 에러 클래스 (status 속성 포함)
export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

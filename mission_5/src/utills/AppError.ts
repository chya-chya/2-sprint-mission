// 커스텀 HTTP 에러 클래스 (status 속성 포함)
export class AppError extends Error {
  status?: number;
  code?: string;
}

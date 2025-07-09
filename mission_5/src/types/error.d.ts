// Error 객체에 status 속성을 추가하는 타입 선언 (타입스크립트 에러 방지)
declare global {
  interface Error {
    status?: number;
    code?: string;
  }
}
export {};

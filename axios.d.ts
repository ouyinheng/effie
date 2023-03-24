/**
 * ~/src/***.d.ts
 */
import { AxiosRequestConfig } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    loading?: boolean;
    // [自定义属性声明]
  }
  export interface AxiosResponse {}
  export interface AxiosInstance {}
}

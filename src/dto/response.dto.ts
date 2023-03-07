import { Injectable } from "@nestjs/common";

interface ResponseObject {
  resCode: string;
  dataRes: KeyableObject | null;
  errMsg: string[];
}

interface KeyableObject {
  [key: string]: string;
}

export class SetResponse implements ResponseObject {
  constructor(res: number, data?: KeyableObject) {
    this.resCode = res.toString();

    this.dataRes = data ?? null;

    this.errMsg = [];
  }

  resCode: string;

  dataRes: KeyableObject | null;

  errMsg: string[];
}

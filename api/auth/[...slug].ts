import { Request, Response } from 'express';
import handler from '../index';

export default async function (req: Request, res: Response) {
  return handler(req, res);
}
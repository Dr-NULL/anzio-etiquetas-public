import { Request, Response, NextFunction } from 'express';
import { ApiRest } from '../tool/api-rest';
import { APP } from '.';

export function configError() {
    APP.use(ApiRest.handleError)
}
import { Request } from 'express';

interface AuthReq extends Request {
    user_id: string;
}

export { AuthReq };
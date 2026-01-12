import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';
// import { HEADERS } from 'src/common/constants/headers.constant';
import { ALLOWED_CLIENT_CODES } from 'src/common/constants/headers.constant';

@Injectable()
export class ProfileGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<IncomingMessage>();
    const clientCode: string = request.headers['client-code'] as string;
    if (!clientCode)
      throw new UnauthorizedException('client-code : header missing');

    if (!ALLOWED_CLIENT_CODES.includes(clientCode))
      throw new UnauthorizedException('Invalid client-code');

    return true;
  }
}

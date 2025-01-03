

import { Injectable } from '@angular/core';

@Injectable({
  providedIn : 'root'
})

export class StatusCode{
  public static readonly SUCCESS = 200;
  public static readonly CREATED = 201;
  public static readonly ACCEPTED = 202;
  public static readonly NO_CONTENT = 204;
  public static readonly BAD_REQUEST = 400;
  public static readonly UNAUTHORIZED = 401;
  public static readonly FORBIDDEN = 403;
  public static readonly NOT_FOUND = 404;
  public static readonly METHOD_NOT_ALLOWED = 405;
  public static readonly CONFLICT = 409;
  public static readonly INTERNAL_SERVER_ERROR = 500;
  public static readonly SERVICE_UNAVAILABLE = 503;
}

import { Request, Response, NextFunction } from "express";

// Extender Response
declare global {
  namespace Express {
    export interface Response {
      apiRest: ApiRest
    }
  }
}

type statusCode = 100 | 101 | 102 | 200 | 201 | 202 | 203 | 204 |
  205 | 206 | 226 | 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 |
  308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 |
  410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 |
  423 | 424 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 |
  504 | 505 | 506 | 508 | 510 | 511 | 666;

//Interface de Entrada para errores
export interface HttpStatus {
  status: statusCode;
  title: string;
}

export interface ApiError extends HttpStatus {
  details: string;
  source: ApiErrorSource;
}

export interface ApiErrorSource {
  pointer: string;
  parameter: any;
}

// Respuestas Informativas
function getStatus(code: number): HttpStatus {
  switch (code) {
    case 100:
      return {
        status: code,
        title: "Continue",
      };
    case 101:
      return {
        status: code,
        title: "Switching Protocol"
      };
    case 102:
      return {
        status: code,
        title: "Processing"
      };
    // Respuestas correctas
    case 200:
      return {
        status: code,
        title: "OK"
      };
    case 201:
      return {
        status: code,
        title: "Created"
      };
    case 202:
      return {
        status: code,
        title: "Accepted"
      };
    case 203:
      return {
        status: code,
        title: "Non-Authoritative Information"
      };
    case 204:
      return {
        status: code,
        title: "No Content"
      };
    case 205:
      return {
        status: code,
        title: "Reset Content"
      };
    case 206:
      return {
        status: code,
        title: "Partial Content"
      };
    case 226:
      return {
        status: code,
        title: "IM Used"
      };
    // Redirecciones
    case 300:
      return {
        status: code,
        title: "Multiple choice"
      };
    case 301:
      return {
        status: code,
        title: "Moved Permently"
      };
    case 302:
      return {
        status: code,
        title: "Found"
      };
    case 303:
      return {
        status: code,
        title: "See Other"
      };
    case 304:
      return {
        status: code,
        title: "Not Modified"
      };
    case 305:
      return {
        status: code,
        title: "Use Proxy"
      };
    case 306:
      return {
        status: code,
        title: "Unused"
      };
    case 307:
      return {
        status: code,
        title: "Temporaly Redirect"
      };
    case 308:
      return {
        status: code,
        title: "Permanently Redirect"
      };
    // Errores de Cliente
    case 400:
      return {
        status: code,
        title: "Bad Request"
      };
    case 401:
      return {
        status: code,
        title: "Unauthorized"
      };
    case 402:
      return {
        status: code,
        title: "Payment Required"
      };
    case 403:
      return {
        status: code,
        title: "Forbidden"
      };
    case 404:
      return {
        status: code,
        title: "Not Found"
      };
    case 405:
      return {
        status: code,
        title: "Method Not Allowed"
      };
    case 406:
      return {
        status: code,
        title: "Not Acceptable"
      };
    case 407:
      return {
        status: code,
        title: "Proxy Authentication Required"
      };
    case 408:
      return {
        status: code,
        title: "Request Timeout"
      };
    case 409:
      return {
        status: code,
        title: "Conflict"
      };
    case 410:
      return {
        status: code,
        title: "Gone"
      };
    case 411:
      return {
        status: code,
        title: "Length Required"
      };
    case 412:
      return {
        status: code,
        title: "Precondition Failed"
      };
    case 413:
      return {
        status: code,
        title: "Payload Too Large"
      };
    case 414:
      return {
        status: code,
        title: "URI Too Long"
      };
    case 415:
      return {
        status: code,
        title: "Unsupported Media Type"
      };
    case 416:
      return {
        status: code,
        title: "Requested Range Not Satisfiable"
      };
    case 417:
      return {
        status: code,
        title: "Expectation Failed"
      };
    case 418:
      return {
        status: code,
        title: "I'm A Teapot"
      };
    case 421:
      return {
        status: code,
        title: "Misdirected Request"
      };
    case 422:
      return {
        status: code,
        title: "Unprocessable Entity"
      };
    case 423:
      return {
        status: code,
        title: "Locked"
      };
    case 424:
      return {
        status: code,
        title: "Failed Dependency"
      };
    case 426:
      return {
        status: code,
        title: "Upgrade Required"
      };
    case 428:
      return {
        status: code,
        title: "Precondition Required"
      };
    case 429:
      return {
        status: code,
        title: "Too Many Requests"
      };
    case 431:
      return {
        status: code,
        title: "Request Header Fields Too Large"
      };
    case 451:
      return {
        status: code,
        title: "Unavailable For Legal Reasons"
      }
    // Errores del servidor
    case 500:
      return {
        status: code,
        title: "Internal Server Error"
      };
    case 501:
      return {
        status: code,
        title: "Not Implemented"
      };
    case 502:
      return {
        status: code,
        title: "Bad Gateway"
      };
    case 503:
      return {
        status: code,
        title: "Service Unavailable"
      };
    case 504:
      return {
        status: code,
        title: "Gateway Timeout"
      };
    case 505:
      return {
        status: code,
        title: "HTTP Version Not Supported"
      };
    case 506:
      return {
        status: code,
        title: "Variant Also Negotiates"
      };
    case 508:
      return {
        status: code,
        title: "Loop Detected"
      };
    case 510:
      return {
        status: code,
        title: "Not Extended"
      };
    case 511:
      return {
        status: code,
        title: "Network Authentication Required"
      };
    default:
      return {
        status: 666,
        title: "Unexpected Error :^)"
      };
  }
}

// API Wrapper
export class ApiRest {
  private static meta = {
    brand: "Frigosorno S.A.",
    country: "Chile",
    authors: [
      "Felipe Silva"
    ]
  }

  private req: Request
  private res: Response

  constructor(req: Request, res: Response) {
    this.req = req
    this.res = res
  }

  send(data: any = null) {
    this.res.contentType('application/vnd.api+json')
    this.res.send({
      data: data,
      meta: ApiRest.meta
    })
  }

  fail(code: statusCode, message: string) {
    this.res.statusCode = code
    throw new Error(message)
  }

  static handleError(err: Error, req: Request, res: Response, nxt: NextFunction) {
    if (
      (res.statusCode >= 200) &&
      (res.statusCode < 300)
    ) {
      res.statusCode = 500
    }

    const status = getStatus(res.statusCode)
    res.contentType("application/vnd.api+json")

    res.statusCode = status.status
    res.statusMessage = status.title
    res.send({
      error: {
        status: status.status,
        title: status.title,
        details: err.message,
        source: {
          pointer: req.originalUrl,
          parameter: req.param
        }
      } as ApiError,
      meta: ApiRest.meta
    })
    nxt()
  }
}
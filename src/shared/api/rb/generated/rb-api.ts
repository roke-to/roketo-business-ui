/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateDaoDto {
  id: string;
}

export interface Employee {
  id: number;
  name: string;
  nearLogin: string;
  email: string;
  relationDaoToEmployee: RelationDaoToEmployee[];
}

export interface Dao {
  id: string;
  relationDaoToEmployee: RelationDaoToEmployee[];
}

export interface RelationDaoToEmployee {
  id: number;
  type: 'Contractor' | 'Freelancer';
  status: 'Active' | 'Suspended' | 'Fired';
  position: string;
  comment: string;
  salary: number;
  token: string;

  /** @format date-time */
  startDate: string | null;
  payPeriod: number;

  /** @format date-time */
  deadline: string | null;
  workPrice: number;
  isTest: boolean;
  employeeId: number;
  employee: Employee;
  daoId: string;
  dao: Dao;
}

export interface EmployeeResponseDto {
  id: number;
  status: 'Active' | 'Suspended' | 'Fired';
  type: 'Contractor' | 'Freelancer';
  name: string;
  position: string;
  nearLogin: string;
  email: string;
  salary: number;

  /** @format date-time */
  startDate: string;
  payPeriod: number;
  token: string;
  comment?: string;
}

export interface DraftInvoiceResponseDto {
  id: number;
  type: 'EmployeePayroll';
  daoId: string;
  employeeId: number;
  employeeName: string;
  employeeNearLogin: string;
  token: string;
  amount: number;

  /** @format date-time */
  periodStart: string;

  /** @format date-time */
  periodEnd: string;
  status: 'Active' | 'Cancel' | 'Confirmed';
}

export interface CreateEmployeeDto {
  daoId: string;
  name: string;
  nearLogin: string;
  email: string;
  amount: number;
  token: string;
  type: 'Contractor' | 'Freelancer';
  status: 'Active' | 'Suspended' | 'Fired';
  position?: string;
  comment?: string;
  startDate?: string;
  payPeriod?: number;
  deadline?: string;
  isTest?: boolean;
}

export interface UpdateEmployeeDto {
  daoId: string;
  name: string;
  nearLogin: string;
  email: string;
  amount: number;
  token: string;
  type: 'Contractor' | 'Freelancer';
  status: 'Active' | 'Suspended' | 'Fired';
  position?: string;
  comment?: string;
  startDate?: string;
  payPeriod?: number;
  deadline?: string;
  isTest?: boolean;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  private addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  private addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(type && type !== ContentType.FormData ? {'Content-Type': type} : {}),
          ...(requestParams.headers || {}),
        },
        signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
        body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title No title
 * @version 1.0.0
 * @contact
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  dao = {
    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerCreateDao
     * @request POST:/dao
     * @secure
     * @response `201` `object`
     */
    daoControllerCreateDao: (data: CreateDaoDto, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/dao`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerFindOneDao
     * @request GET:/dao/{daoId}
     * @secure
     * @response `200` `Dao`
     */
    daoControllerFindOneDao: (daoId: string, params: RequestParams = {}) =>
      this.request<Dao, any>({
        path: `/dao/${daoId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerRemoveDao
     * @request DELETE:/dao/{daoId}
     * @secure
     * @response `200` `object`
     */
    daoControllerRemoveDao: (daoId: string, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/dao/${daoId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerFindAllEmployees
     * @request GET:/dao/{daoId}/employees
     * @secure
     * @response `200` `(EmployeeResponseDto)[]` List of Employee
     */
    daoControllerFindAllEmployees: (
      daoId: string,
      query?: {
        sort?: 'name' | 'id';
        direction?: 'ASC' | 'DESC';
        type?: 'Contractor' | 'Freelancer';
        status?: 'Active' | 'Suspended' | 'Fired';
      },
      params: RequestParams = {},
    ) =>
      this.request<EmployeeResponseDto[], any>({
        path: `/dao/${daoId}/employees`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerCreateEmployee
     * @request POST:/dao/{daoId}/employees
     * @secure
     * @response `201` `object`
     */
    daoControllerCreateEmployee: (
      daoId: string,
      data: CreateEmployeeDto,
      params: RequestParams = {},
    ) =>
      this.request<object, any>({
        path: `/dao/${daoId}/employees`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerFindAllDaoInvoices
     * @request GET:/dao/{daoId}/invoices
     * @secure
     * @response `200` `(DraftInvoiceResponseDto)[]` List of DAO invoices
     */
    daoControllerFindAllDaoInvoices: (
      daoId: string,
      query: {status: 'Active' | 'Cancel' | 'Confirmed'},
      params: RequestParams = {},
    ) =>
      this.request<DraftInvoiceResponseDto[], any>({
        path: `/dao/${daoId}/invoices`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerUpdateDaoDraftInvoiceStatus
     * @request POST:/dao/{daoId}/invoices
     * @secure
     * @response `200` `void` Updated invoices
     * @response `201` `void`
     */
    daoControllerUpdateDaoDraftInvoiceStatus: (
      daoId: string,
      employeeId: number,
      status: 'Active' | 'Cancel' | 'Confirmed',
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/dao/${daoId}/invoices`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerRemoveDaoDraftInvoice
     * @request DELETE:/dao/{daoId}/invoices/{invoiceId}
     * @secure
     * @response `200` `void` Remove invoices
     */
    daoControllerRemoveDaoDraftInvoice: (
      daoId: string,
      invoiceId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/dao/${daoId}/invoices/${invoiceId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerUpdateEmployee
     * @request PATCH:/dao/{daoId}/employees/{employeeId}
     * @secure
     * @response `200` `object`
     */
    daoControllerUpdateEmployee: (
      daoId: string,
      employeeId: string,
      data: UpdateEmployeeDto,
      params: RequestParams = {},
    ) =>
      this.request<object, any>({
        path: `/dao/${daoId}/employees/${employeeId}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerFindOneEmployeeByDao
     * @request GET:/dao/{daoId}/employees/{employeeId}
     * @secure
     * @response `200` `(EmployeeResponseDto)[]`
     */
    daoControllerFindOneEmployeeByDao: (
      daoId: string,
      employeeId: string,
      params: RequestParams = {},
    ) =>
      this.request<EmployeeResponseDto[], any>({
        path: `/dao/${daoId}/employees/${employeeId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerRemoveEmployee
     * @request DELETE:/dao/{daoId}/employees/{employeeId}
     * @secure
     * @response `200` `void`
     */
    daoControllerRemoveEmployee: (daoId: string, employeeId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dao/${daoId}/employees/${employeeId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerChangeEmployeeStatus
     * @request POST:/dao/{daoId}/employees/{employeeId}/{action}
     * @secure
     * @response `201` `object`
     */
    daoControllerChangeEmployeeStatus: (
      daoId: string,
      employeeId: string,
      action: 'Suspend' | 'Reinstate' | 'Fire' | 'Rehire',
      params: RequestParams = {},
    ) =>
      this.request<object, any>({
        path: `/dao/${daoId}/employees/${employeeId}/${action}`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerSuggestAllEmployees
     * @request GET:/dao/{daoId}/employees/suggest
     * @secure
     * @response `200` `(object)[]`
     */
    daoControllerSuggestAllEmployees: (daoId: string, params: RequestParams = {}) =>
      this.request<object[], any>({
        path: `/dao/${daoId}/employees/suggest`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  authentication = {
    /**
     * No description
     *
     * @tags Authentication
     * @name AuthenticationControllerLogIn
     * @request POST:/authentication/login
     * @response `200` `void`
     */
    authenticationControllerLogIn: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/authentication/login`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AuthenticationControllerLogOut
     * @request POST:/authentication/logout
     * @response `201` `void`
     */
    authenticationControllerLogOut: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/authentication/logout`,
        method: 'POST',
        ...params,
      }),
  };
}

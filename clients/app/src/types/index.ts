export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userCompanyId: number | null;
  userCompanyName: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  roles: string[];
}


export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthLoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  roles: string[];
}

export interface AuthState {
  token: string | null;
  user: LoginResponse | null;
  isAuthenticated: boolean;
}

export interface CreateUserDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userCompanyId: number | null;
  password: string;
  roles: string[];
}

export interface UpdateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  userCompanyId: number | null;
  roles: string[];
}

export interface UserCompanyDto {
  id: number;
  name: string;
  userCount: number;
}

export interface HotTopicDto {
  id: number;
  title: string;
  titleTag: string;
  metaDescription: string;
  url: string;
  body: string;
  publishedDate: string;
  isFrontPage: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateHotTopicDto {
  title: string;
  titleTag: string;
  metaDescription: string;
  url: string;
  body: string;
  publishedDate: string;
  isFrontPage: boolean;
  isPublished: boolean;
}

export interface UpdateHotTopicDto {
  title: string;
  titleTag: string;
  metaDescription: string;
  url: string;
  body: string;
  publishedDate: string;
  isFrontPage: boolean;
  isPublished: boolean;
}

export interface CompanyQualificationDto {
  id: number;
  code: number;
  name: string;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  bond: string | null;
  rowBond: boolean;
  incorporation: string | null;
  memo: string | null;
  resolution: string | null;
  modifyDate: string | null;
  country: string | null;
  approvalDate: string | null;
  eeo: boolean;
  eeoDate: string | null;
  debarment: boolean;
  debarmentDate: string | null;
  foreignParent: string | null;
  bankruptcyFlag: string | null;
  bankruptcyStartDate: string | null;
  bankruptcyEndDate: string | null;
  qualificationRevokedFlag: string | null;
  qualificationRevokedStartDate: string | null;
  qualificationRevokedEndDate: string | null;
}

export interface CompanyOfficerDto {
  id: number;
  code: number;
  sequence: number;
  position: string;
  firstName: string;
  lastName: string;
  footnote: string | null;
  modifyDate: string | null;
  expirationDate: string | null;
  createdDate: string | null;
  createdBy: string | null;
  updatedDate: string | null;
  updatedBy: string | null;
}

export interface AuthLoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  roles: string[];
}

export interface AuthState {
  token: string | null;
  user: LoginResponse | null;
  isAuthenticated: boolean;
}
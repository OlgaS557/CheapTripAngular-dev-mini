import { SafeHtml } from '@angular/platform-browser';

export interface IPoints {
  startPoint: string;
  endPoint: string;
}

enum PointType {
  START = 'startPoint',
  END = 'endPoint',
}

export enum Modes {
  SEARCH,
  DELIVERY,
}

export type Server = 'server68' | 'server104';

export interface IPoint {
  name: string;
  type: 'from' | 'to';
}

export interface IRout {
  euro_price: number;
  duration_minutes: string;
  transportation_type: string;
  from: string;
  to: string;
}

export interface IJsonTravelData {
  price: number;
  from: number;
  id: number;
  duration: number;
  to: number;
  transport: number;
}

export interface IJsonPath {
  euro_price: number;
  from: number;
  id: number;
  to: number;
  travel_data: IJsonTravelData[];
  trip_duration: number;
}

export interface IJsonRoutData {
  euro_price: number;
  from: number;
  id: number;
  to: number;
  travel_data: any;
  trip_duration: number;
}

export interface IDetails {
  euro_price: number;
  duration_minutes: string;
  direct_paths: IRout[];
  points: Set<string>;
  transport: SafeHtml[];
}

export interface IRecievedRouts {
  routeType: string;
  euro_price: number;
  duration_minutes: number;
  direct_paths: IRout[];
}

export interface IPath {
  pathType: string;
  details: IDetails;
}

export interface IPathPoint {
  id: number;
  name: string;
}

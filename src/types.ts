import { DataQuery } from '@grafana/schema';
import { DataSourceJsonData } from '@grafana/data';


export interface MyQuery extends DataQuery {
  queryText?: string;
  constant: number;
}

export interface DataPoint {
  Time: number;
  Value: number;
}

export interface DataSourceResponse {
  datapoints: DataPoint[];
}

export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

export interface MySecureJsonData {
  apiKey?: string;
}

export type Granularity = '1h' | '1d';

export interface JsonWaapData extends DataSourceJsonData {
  apiUrl?: string;          
}

export interface SecureWaapJsonData {
  apiKey?: string;    
}

export interface WaapQuery {
  refId: string;
  metric?: string;
  granularity?: Granularity;
}

export type SeriesPoint = { date_time: string; value: number };
export type SeriesResponse = Record<string, SeriesPoint[]>;
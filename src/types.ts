import { DataSourceJsonData } from '@grafana/data';

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
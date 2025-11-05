import {
  DataSourceApi, DataQueryRequest, DataQueryResponse,
  DataSourceInstanceSettings, MutableDataFrame, FieldType
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { WaapQuery, JsonWaapData, SeriesResponse } from './types';
import { normalizeBytes, SizeUnitEnum } from './utils/normalize';

export class DataSource extends DataSourceApi<WaapQuery, JsonWaapData> {
  private apiBase: string;
  private authHeader?: string;

  constructor(private instanceSettings: DataSourceInstanceSettings<JsonWaapData>) {
    super(instanceSettings);
    this.apiBase = (instanceSettings.jsonData?.apiUrl || '').replace(/\/+$/, '');
    this.authHeader = (instanceSettings as any)?.decryptedSecureJsonData?.apiKey;
  }

  async query(req: DataQueryRequest<WaapQuery>): Promise<DataQueryResponse> {
    const from = req.range.from.toISOString();
    const to = req.range.to.toISOString();
    const gran = req.targets[0]?.granularity || '1h';

    const targets = req.targets;
    const metric = targets[0]?.metric ?? (Array.isArray((targets[0] as any)?.metrics) ? (targets[0] as any).metrics[0] : 'total_requests');
    const metrics = [metric];
    const data = await this.seriesCall({ from, to, granularity: gran, metrics });
    return { data };
  }

  async testDatasource() {
    const auth = async (path: string) =>
      getBackendSrv().datasourceRequest({
        method: 'GET',
        url: `/api/datasources/proxy/uid/${this.instanceSettings.uid}/${path}`,
        responseType: 'json',
        showErrorAlert: true,
      });


    try {
      const r1 = await auth('iam/users/me');
      return { status: 'success', message: `Auth OK (IAM): ${r1.data?.name ?? 'OK'}` };
    } catch {
      const r2 = await auth('users/me');
      return { status: 'success', message: `Auth OK: ${r2.data?.name ?? 'OK'}` };
    }
  }

  private async seriesCall(args: { from: string; to: string; granularity: string; metrics: string[] }) {
    const usp = new URLSearchParams();
    usp.append('from', args.from);
    usp.append('to', args.to);
    usp.append('granularity', args.granularity);
    for (const m of args.metrics) usp.append('metrics', m);

    const url = `/api/datasources/proxy/uid/${this.instanceSettings.uid}/waap/v1/statistics/series?${usp.toString()}`;
    const res = await getBackendSrv().datasourceRequest({ url, method: 'GET' });
    const obj = (res?.data || {}) as SeriesResponse;

    const frames: MutableDataFrame[] = [];

    for (const [metric, points] of Object.entries(obj)) {
      if (!Array.isArray(points)) continue;

      const isBytes = metric === 'total_bytes';

      const frame = new MutableDataFrame({
        name: metric,
        fields: [
          { name: 'time', type: FieldType.time, values: [] },
          {
            name: metric,
            type: FieldType.number,
            config: {
              unit: isBytes ? 'kbytes' : 'short',
              decimals: 2,
              displayName: isBytes ? 'Total Bytes (KB)' : 'Total Requests',
            },
            values: [],
          },
        ],
      });

      for (const p of points) {
        const value = Number(p.value);
        frame.add({
          time: Date.parse(p.date_time),
          [metric]: isBytes
            ? normalizeBytes(value, SizeUnitEnum.KBytes)
            : value,
        });
      }

      frames.push(frame);
    }

    return frames;
  }

}

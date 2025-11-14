import React from 'react';
import { Granularity, WaapQuery } from '../types';
import { DataSource } from '../datasource';
import { Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';


const METRIC_OPTS: Array<SelectableValue<string>> = [
  { label: 'total_requests', value: 'total_requests' },
  { label: 'total_bytes', value: 'total_bytes' },
];


const GRANULARITY: { label: string; value: Granularity }[] = [
  { label: '1h', value: '1h' },
  { label: '1d', value: '1d' },
];

export const QueryEditor: React.FC<QueryEditorProps<DataSource, WaapQuery>> = ({ query, onChange, onRunQuery }) => {
  const metric = query.metric ?? (Array.isArray((query as any).metrics) ? (query as any).metrics[0] : 'total_requests');

  const granularity = query.granularity || '1h';

  return (
    <div className="gf-form-group">
      <div className="gf-form">
        <span className="gf-form-label width-9">Metric</span>
        <Select
          className="width-20"
          options={METRIC_OPTS}
          value={METRIC_OPTS.find(o => o.value === metric)}
          onChange={(v) => { onChange({ ...query, metric: v!.value }); onRunQuery(); }}
        />
      </div>

      <div className="gf-form">
        <span className="gf-form-label width-9">Granularity</span>
        <Select
          className="width-10"
          value={{ label: granularity, value: granularity }}
          options={GRANULARITY}
          onChange={(v) => { onChange({ ...query, granularity: v?.value as Granularity }); onRunQuery(); }}
        />
      </div>
    </div>
  );
};

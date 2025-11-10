import React from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { Input, SecretInput } from '@grafana/ui';
import { JsonWaapData, SecureWaapJsonData } from '../types';

  export const ConfigEditor: React.FC<
  DataSourcePluginOptionsEditorProps<JsonWaapData, SecureWaapJsonData>
> = ({ options, onOptionsChange }) => {
  const jsonData = options.jsonData ?? {};
  const secureJsonData = options.secureJsonData ?? {};

  return (
    <>
      <h3 className="page-heading">WAAP API</h3>

      <div className="gf-form-group">
        <div className="gf-form">
          <span className="gf-form-label width-12">API URL (host only)</span>
          <Input
            className="width-30"
            value={jsonData.apiUrl || ''}
            placeholder="api.gcore.com"
            onChange={(e) => onOptionsChange({ ...options, jsonData: { ...jsonData, apiUrl: e.currentTarget.value } })}
          />
        </div>

        <div className="gf-form">
          <span className="gf-form-label width-12">Authorization header value</span>
          <SecretInput
            className="width-30"
            isConfigured={Boolean(options.secureJsonFields?.apiKey)}
            value={secureJsonData.apiKey || ''}
            placeholder="apikey <YOUR_TOKEN>"
            onReset={() => onOptionsChange({ ...options, secureJsonFields: { ...options.secureJsonFields, apiKey: false }, secureJsonData: { ...secureJsonData, apiKey: '' } })}
            onChange={(e) => onOptionsChange({ ...options, secureJsonData: { ...secureJsonData, apiKey: e.currentTarget.value } })}
          />
        </div>
      </div>
    </>
  );
};


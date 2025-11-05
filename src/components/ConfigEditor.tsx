// import React, { ChangeEvent } from 'react';
// import { InlineField, Input, SecretInput } from '@grafana/ui';
// import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
// import { MyDataSourceOptions, MySecureJsonData } from '../types';

// interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData> {}

// export function ConfigEditor(props: Props) {
//   const { onOptionsChange, options } = props;
//   const { jsonData, secureJsonFields, secureJsonData } = options;

//   const onPathChange = (event: ChangeEvent<HTMLInputElement>) => {
//     onOptionsChange({
//       ...options,
//       jsonData: {
//         ...jsonData,
//         path: event.target.value,
//       },
//     });
//   };

//   // Secure field (only sent to the backend)
//   const onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
//     onOptionsChange({
//       ...options,
//       secureJsonData: {
//         apiKey: event.target.value,
//       },
//     });
//   };

//   const onResetAPIKey = () => {
//     onOptionsChange({
//       ...options,
//       secureJsonFields: {
//         ...options.secureJsonFields,
//         apiKey: false,
//       },
//       secureJsonData: {
//         ...options.secureJsonData,
//         apiKey: '',
//       },
//     });
//   };

//   return (
//     <>
//       <InlineField label="Path" labelWidth={14} interactive tooltip={'Json field returned to frontend'}>
//         <Input
//           id="config-editor-path"
//           onChange={onPathChange}
//           value={jsonData.path}
//           placeholder="Enter the path, e.g. /api/v1"
//           width={40}
//         />
//       </InlineField>
//       <InlineField label="API Key" labelWidth={14} interactive tooltip={'Secure json field (backend only)'}>
//         <SecretInput
//           required
//           id="config-editor-api-key"
//           isConfigured={secureJsonFields.apiKey}
//           value={secureJsonData?.apiKey}
//           placeholder="Enter your API key"
//           width={40}
//           onReset={onResetAPIKey}
//           onChange={onAPIKeyChange}
//         />
//       </InlineField>
//     </>
//   );
// }


// src/ConfigEditor.tsx
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


import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { EnvDataProvider } from '@@src/universal/contexts/EnvDataContext';
import { log } from '@@src/universal/modules/Logger';
import Universal from '@@src/universal/components/Universal';

const appData = process.env.APP_DATA as any;

const ClientApp: React.FC = () => {
  const isomorphicData = window['ISOMORPHIC_DATA'];
  log('<ClientApp />: appData: %o, window.ISOMORPHIC_DATA: %o', appData, isomorphicData);

  return (
    <BrowserRouter>
      <EnvDataProvider
        data={{
          ...isomorphicData,
          ...appData,
        }}
      >
        <Universal />
      </EnvDataProvider>
    </BrowserRouter>
  );
};

export default ClientApp;

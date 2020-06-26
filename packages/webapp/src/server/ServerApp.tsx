import { logger } from 'jege/server';
import React from 'react';
import {
  StaticRouter,
} from 'react-router-dom';
import { StyleSheetManager } from 'styled-components';

import { EnvDataProvider } from '@@src/universal/contexts/EnvDataContext';
import Universal from '@@src/universal/components/Universal';

const log = logger('[webapp]');

const appData = process.env.APP_DATA as any;

const ServerApp = ({
  isomorphicData,
  requestUrl,
  serverStyleSheet,
  staticContext,
}) => {
  log('ServerApp(): appData present: %s, isomorphicData present: %j', !!appData, !!isomorphicData);

  return (
    <StaticRouter
      context={staticContext}
      location={requestUrl}
    >
      <EnvDataProvider
        data={{
          ...isomorphicData,
          ...appData,
        }}
      >
        <StyleSheetManager sheet={serverStyleSheet.instance}>
          <Universal />
        </StyleSheetManager>
      </EnvDataProvider>
    </StaticRouter>
  );
};

export default ServerApp;

import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

import { useEnvData } from '@@src/universal/contexts/EnvDataContext';

const backendEndpoint = process.env.BACKEND_ENDPOINT as string;

const StyledApp = styled.div({
});

const App = () => {
  React.useEffect(() => {
    console.log(1, backendEndpoint)
    axios.get('http://localhost:4001').then(({ data }) => {
      console.log(1, data);
    })

  });
  return (
    <StyledApp>
      app
    </StyledApp>
  );
};

export default App;

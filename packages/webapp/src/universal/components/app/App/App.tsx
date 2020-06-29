import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

import Masthead from './Masthead';
import QueryResult from './QueryResult';

const StyledApp = styled.div({
});

const Bottom = styled.div({
  paddingLeft: 182,
});

const App = () => {
  return (
    <StyledApp>
      <Masthead />
      <Bottom>
        <QueryResult />
      </Bottom>
    </StyledApp>
  );
};

export default App;

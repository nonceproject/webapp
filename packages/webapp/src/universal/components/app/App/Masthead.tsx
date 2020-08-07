import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

const StyledMasthead = styled.div({
  '& > div': {
    alignItems: 'center',
    display: 'flex',
  },
  backgroundColor: '#313131',
  display: 'flex',
});

const Left = styled.div({
  paddingLeft: 15,
  width: 170,
});

const Right = styled.div({
});

const Logo = styled.div({
  fontSize: '2.1em',
  padding: 12,
});

const SearchInput = styled.div({
  backgroundColor: '#464646',
  borderRadius: 3,
  padding: '9px 15px',
  width: 570,
});

const Masthead = () => {
  return (
    <StyledMasthead>
      <Left>
        <Logo>
          Nonce
        </Logo>
      </Left>
      <Right>
        <SearchInput>
          Search functionality is not yet available
        </SearchInput>
      </Right>
    </StyledMasthead>
  );
};

export default Masthead;

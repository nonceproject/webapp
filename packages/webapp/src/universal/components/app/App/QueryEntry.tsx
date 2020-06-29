import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

function getContentDocument(document?) {
  if (!document) {
    return '';
  }
  return document.substring(0, 240).replace(/[^\x00-\x7F]/g, '');
}

function getTitle(str) {
  return str.length > 50 ? str.substring(0, 50) + '...' : str;
}

const StyledEntry = styled.div({
  marginBottom: '1.7rem',
});

const Title = styled.div({
  color: '#ff659f',
  fontSize: '1.55em',
});

const Name = styled.div({});

const Document = styled.div({});

const Addr = styled.div({
  color: '#979797',
});

const ResolverAddr = styled.div({
  color: '#979797',
});

const QueryEntry = ({
  item,
}) => {
  const ensName = item.ensName.S;
  const title = getTitle(item.contentTitle?.S || item.ensName.S);
  const contentDocument = getContentDocument(item.contentDocument?.S);
  const addr = item.contentHash?.S || item.addr?.S;
  const resolverAddr = item.resolverAddr?.S;
  const etherScanUrl = `https://etherscan.io/address/${resolverAddr}`;

  return (
    <StyledEntry>
      <Name><a href={`http://${ensName}`}>{ensName}</a></Name>
      <Title><a href={`http://${ensName}`}>{title}</a></Title>
      <Document>{contentDocument}</Document>
      <Addr>Content Hash: {addr}</Addr>
      <ResolverAddr>
        <a href={etherScanUrl}>
          Resolver Addr: {resolverAddr}
        </a>
      </ResolverAddr>
    </StyledEntry>
  );
};

export default QueryEntry;

interface Value {
  N?: 'string';
  S?: 'string';
}

interface GetCrawledData {
  crawled: {
    Items: {
      addr?: Value;
      contentDocument?: Value;
      contentHash?: Value;
      contentLinks?: Value;
      contentTitle?: Value;
      ensName: Value;
      id: Value;
      latestTransactions: Value;
      resolverAddr: Value;
      updated_at: Value;
    }[];
    LastEvaluatedKey: {
      id: Value;
    };
  };
  itemCount: number;
}
import axios from 'axios';
import React from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router';

import QueryEntry from './QueryEntry';

const backendEndpoint = process.env.BACKEND_ENDPOINT as string;
const getCrawledUrl = `${backendEndpoint}/crawled`;

async function getCrawled(params?: GetCrawledParams) {
  const { data } = await axios.post(getCrawledUrl, params);
  return data;
}

// https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
function parseQueryString(query: string) {
  const consts = query.split("&");
  const query_string = {};
  for (let i = 0; i < consts.length; i++) {
    const pair = consts[i].split("=");
    const key = decodeURIComponent(pair[0]);
    const value = decodeURIComponent(pair[1]);
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
    } else if (typeof query_string[key] === "string") {
      const arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}

const StyledQueryResult = styled.div({
  padding: '4px 0 48px',
  width: 610,
});

const StyledNavigation = styled.div({
  '& > *': {
    marginRight: 19,
  },
  display: 'flex',
  marginTop: 26,
});

const Warning = styled.div({
  border: '1px solid #ffe5e9',
  borderRadius: 3,
  color: '#ffe5e9',
  margin: '1.2rem 0',
  padding: '1.1em',
});

const ResultMeta = styled.div({
  lineHeight: '44px',
});

const Navigation = ({
  params,
  result,
}) => {
  const history = useHistory();
  const evaluatedKeys = React.useMemo(() => {
    return {
      prev: params.prevEvaluatedKey,
      last: result?.crawled.LastEvaluatedKey?.id?.S,
    };
  }, [result]);

  const handleClickPrev = React.useCallback(() => {
    const last = evaluatedKeys.prev ? `?lastEvaluatedKey=${evaluatedKeys.prev}` : '';
    history.push(last);
  }, [result]);

  const handleClickNext = React.useCallback(() => {
    const prev = evaluatedKeys.prev ? `&prevEvaluatedKey=${evaluatedKeys.prev}` : '';
    history.push(`?lastEvaluatedKey=${evaluatedKeys.last}${prev}`);
  }, [result]);

  return (
    <StyledNavigation>
      {params.lastEvaluatedKey && <button onClick={handleClickPrev}>
        <p>&lt; Prev</p>
       </button>}
      {evaluatedKeys.last && <button onClick={handleClickNext}>
        Next &gt;
      </button>}
    </StyledNavigation>
  );
};

const ResultList = ({
  params,
  result,
}: ResultListProps) => {
  console.log(1, params, result);
  const filtered = React.useMemo(() => {
    const list: JSX.Element[] = [];
    if (result && result.crawled) {
      for (let i = 0; i < result.crawled.Items.length; i +=1) {
        const item = result.crawled.Items[i];
        if (item.resolverAddr) {
          list.push(
            <QueryEntry key={item.ensName.S} item={item} />
          );
        }
      }
    }

    return {
      itemCount: result && result.itemCount,
      list,
    };
  }, [result]);

  return (
    <div>
      {filtered.itemCount && <ResultMeta>
        There are about {filtered.itemCount} entries
      </ResultMeta>}
      {filtered.list}
      <Navigation params={params} result={result} />
    </div>
  );
};

const QueryResult = () => {
  const location = useLocation();
  const params = parseQueryString(location.search.substring(1));
  const [result, setResult] = React.useState<any>(null);
  React.useEffect(() => {
    getCrawled(params).then(({ payload }) => setResult(payload));
  }, [location.search]);

  return (
    <StyledQueryResult>
      <Warning>
        You should either have an ENS supported browser, or a browser extension to resolve .eth
        domain
      </Warning>
      <ResultList params={params} result={result} />
    </StyledQueryResult>
  );
};

export default QueryResult;

interface Value {
  N?: 'string';
  S?: 'string';
}

interface GetCrawledParams {
  ExclusiveStartKey?;
}

interface ResultListProps {
  params;
  result: {
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
  };
}

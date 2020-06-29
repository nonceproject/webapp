import AWS from 'aws-sdk';
import { logger } from 'jege/server';

import { Record } from './types';

const log = logger('[backend]');

AWS.config.update({ region: 'us-west-2' });

const db = new AWS.DynamoDB();

function addProps(src, tar) {
  Object.keys(src)
    .forEach((key) => {
      if (src[key]) {
        tar[key] = {
          S: typeof src[key] === 'string' ? src[key] : JSON.stringify(src[key]),
        };
      }
    });
}

export async function getCrawled(_params: GetCrawledParams = {}) {
  const params: AWS.DynamoDB.ScanInput = {
    TableName: 'crawl-2',
    FilterExpression: 'attribute_exists(contentHash)',
    Limit: 2000,
  };

  if (_params.lastEvaluatedKey) {
    params.ExclusiveStartKey = { id: { S: _params.lastEvaluatedKey } };
  }

  const tableDescription = new Promise((resolve, reject) => {
    db.describeTable({ TableName: 'crawl-2'}, function(err, data) {
      if (err) {
        log('getcrawled(): tableDescription err, err: %s', err);
      } else {
          const table = data['Table'] as any;
          resolve(table['ItemCount']);
      }
    });
  });

  const queryResult = new Promise((resolve, reject) => {
    db.scan(params, (err, data) => {
      if (err) {
        log('getCrawled(): queryResult error: %s', err);
        reject();
      }

      log('getCrawled(): queryResult success, params: %j, count: %s', params, data.Items?.length);
      resolve(data);
    });
  });

  const [itemCount, crawled] = await Promise.all([tableDescription, queryResult]);
  return {
    crawled,
    itemCount,
  };
}

interface GetCrawledParams {
  lastEvaluatedKey?;
}

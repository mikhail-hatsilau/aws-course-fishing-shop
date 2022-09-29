/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync } = require('fs');
const path = require('path');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');

const REGION = 'eu-west-1';

const dbClient = new DynamoDBClient({ region: REGION });

const products = readFileSync(path.resolve(__dirname, 'products.json'));
const productsRequests = JSON.parse(products).map((product) => ({
  PutRequest: {
    Item: {
      ...product,
    },
  },
}));

const params = {
  RequestItems: {
    ['products-dev']: productsRequests,
  },
};

const run = async () => {
  try {
    const data = await dbClient.send(new BatchWriteItemCommand(params));
    console.log('Success, items inserted', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

run();

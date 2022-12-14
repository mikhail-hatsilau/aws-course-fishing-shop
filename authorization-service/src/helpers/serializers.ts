import httpResponseSerializer from '@middy/http-response-serializer';

export const defaultSerializers: Exclude<
  Parameters<typeof httpResponseSerializer>[0],
  undefined
>['serializers'] = [
  {
    regex: /^application\/json$/,
    serializer: ({ body }) => JSON.stringify(body),
  },
  {
    regex: /^text\/plain$/,
    serializer: ({ body }) => body,
  },
];

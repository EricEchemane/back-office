import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';

interface ILog {
  timestamp: string;
  level: 'info' | 'error' | 'warn' | 'unexpected_error';
  url: string;
  method: string;
  ip?: string;
  region?: string;
  country?: string;
  userAgent: string | null;
  message?: string;
}

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_URL) {
  throw new Error('Please set a env UPSTASH_REDIS_REST_URL variable');
}
if (!UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Please set a env UPSTASH_REDIS_REST_TOKEN variable');
}

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

export const Logger = {
  info: (request: NextRequest, message?: string) => {
    log({ level: 'info', request, message });
  },
  error: (request: NextRequest, message?: string) => {
    log({ level: 'error', request, message });
  },
  warn: (request: NextRequest, message?: string) => {
    log({ level: 'warn', request, message });
  },
  raw: (obj: object, level: ILog['level']) => {
    redis.lpush(
      'raw_logs',
      JSON.stringify({
        ...obj,
        level,
        timestamp: new Date().toISOString(),
      })
    );
  },
};

function log({
  level,
  request,
  message,
  redisKey = 'middleware_logs',
}: {
  request: NextRequest;
  level: ILog['level'];
  message?: string;
  redisKey?: string;
}) {
  const log: ILog = {
    country: request?.geo?.country,
    region: request.geo?.region,
    ip: request.ip,
    timestamp: new Date().toISOString(),
    url: request.url,
    method: request.method,
    userAgent: request.headers.get('user-agent'),
    level,
    message,
  };
  redis.lpush(redisKey, JSON.stringify(log));
}

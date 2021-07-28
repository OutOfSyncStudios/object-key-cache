// index.js

// Dependencies
const __ = {
  isNil: require('lodash.isnil'),
  merge: require('lodash.merge'),
  pick: require('lodash.pick'),
  omit: require('lodash.omit'),
};
const MemoryCache = require('@outofsync/memory-cache');
const LogStub = require('logstub');
const redis = require('redis');
const bluebird = require('bluebird');
const crypto = require('crypto');

const memCache = new MemoryCache();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const defaults = {
  failover: true,
  // retry_strategy: (options) => {
  //   if (options.error.code === 'ECONNREFUSED') {
  //     // This will suppress the ECONNREFUSED unhandled exception
  //     // that results in app crash
  //     return new Error('The server refused the connection');
  //   }
  // }
};

class ObjectKeyCache {
  constructor(config, credentials, logger) {
    this.logger = logger || new LogStub();
    this.connected = false;
    this.cacheConfig = __.merge(Object.assign({}, defaults), config || {});
    // config.cache;
    // this.ttl = this.cacheConfig.ttl;
    this.creds = credentials;
    if (__.isNil(this.creds)) {
      this.creds = {
        host: null,
        port: null
      };
    }
    this.algorithm = config?.algorithm || 'sha256';
    // config.credentials.redis;
    this.redisCache = null;
    this.memCache = null;
    this.cache = null;
  }

  // Connects the ObjectKeyCache to an existing and already connected RedisClient or MemoryCache
  attachToClient(client) {
    if (!(client instanceof redis.RedisClient) && !(client instanceof MemoryCache)) {
      throw new Error('The client provided is not an active RedisClient or MemoryCache');
    } else if (!client.connected && (client instanceof redis.RedisClient)) {
      throw new Error('The Redis client is not connected');
    } else if (!__.isNil(this.cache) && this.connected) {
      throw new Error('Cannot replace active redis connection, disconnect from Redis first.');
    }

    if (client instanceof redis.RedisClient) {
      this.creds = __.pick(client.options, ['host', 'port']);
    } else {
      this.creds = {};
    }

    this.cacheConfig = __.omit(client.options, ['host', 'port']);
    this.cache = client;
    this.connected = true;
  }

  detachFromClient() {
    if (!this.connected || __.isNil(this.cache)) {
      throw new Error('Cannot detach when there is no connection.');
    }
    this.connected = false;
    this.cache = null;
  }

  // Returns a promise that signifies when the connection to the cache is ready
  connect() {
    if (this.connected) {
      return Promise.reject(new Error('Object Key Cache is already connected'));
    }
    return new Promise((resolve, reject) => {
      this.memCache = memCache.createClient(this.cacheConfig);
      this.creds.port = this.creds.port || 6379;
      if (__.isNil(this.creds.host)) {
        this.logger.debug('Cache Connected (Memory)');
        this.cache = this.memCache;
        this.connected = true;
        resolve(this.cache);
      } else {
        this.redisCache = redis.createClient(this.creds.port, this.creds.host, this.cacheConfig);
        this.redisCache.once('connect', () => {
          this.logger.debug('Cache Connected (Redis)');
          // This also has the benefit of automatically switching to the Redis client when it becomes
          // available, if there was a connection problem initially
          this.cache = this.redisCache;
          // Only resolve when not already connected
          if (!this.connected) {
            resolve(this.cache);
          }
          this.connected = true;
        });
        this.redisCache.once('error', (err) => {
          if (this.cacheConfig.failover) {
            this.logger.debug('Redis failed with error failing over to MemoryCache');
            this.logger.error(err);
            this.cache = this.memCache;
            // Only resolve when not already connected
            if (!this.connected) {
              resolve(this.cache);
            }
            this.connected = true;
          } else {
            this.logger.debug('Cache Connection Failed');
            reject(err);
          }
        });
        this.redisCache.on('connect', () => {
          if (this.connected && this.cache && this.cache instanceof MemoryCache) {
            this.logger.debug('Redis connection came back, reverting from MemoryCache to RedisClient');
          }
        });
        this.redisCache.on('error', (err) => {
          // Trap and log any non ECONNREFUSED errors that may get called after we've already caught the first
          // Redis will bomb out without this if there is no connection as ECONNREFUSED is called multiple times
          // as the Redis client attempts to reconnect continuously
          if (__.isNil(err.errno) || (err.errno && err.errno !== 'ECONNREFUSED')) {
            this.logger.error(err);
          }
          if (err.errno && err.errno === 'ECONNREFUSED' && this.connected && this.cache instanceof redis.RedisClient) {
            this.logger.debug('Redis connection went away, reverting to MemoryCache');
            this.cache = this.memCache;
          }
        });
      }
    });
  }

  get(key) {
    if (this.connected) {
      return this.cache.getAsync(key);
    }
    // returns a Promise
    return Promise.reject(new Error('Cache is not connected'));
  }

  set(key, value) {
    if (this.connected) {
      return this.cache.setAsync(key, value);
    }
    // returns a Promise
    return Promise.reject(new Error('Cache is not connected'));
  }

  del(key) {
    if (this.connected) {
      return this.cache.delAsync(key);
    }
    // returns a Promise
    return Promise.reject(new Error('Cache is not connected'));
  }

  hget(hash, key) {
    if (this.connected) {
      return this.cache.hgetAsync(hash, key);
    }
    // returns a Promise
    return Promise.reject(new Error('Cache is not connected'));
  }

  hset(hash, key, value) {
    if (this.connected) {
      return this.cache.hsetAsync(hash, key, value);
    }
    // returns a Promise
    return Promise.reject(new Error('Cache is not connected'));
  }

  hdel(hash, key) {
    if (this.connected) {
      return this.cache.hdelAsync(hash, key);
    }
    // returns a Promise
    return Promise.reject(new Error('Cache is not connected'));
  }

  getAsync(key) {
    return this.get(key);
  }

  setAsync(key, value) {
    return this.set(key, value);
  }

  delAsync(key) {
    return this.del(key);
  }

  hgetAsync(hash, key) {
    return this.hget(hash, key);
  }

  hsetAsync(hash, key, value) {
    return this.hset(hash, key, value);
  }

  hdelAsync(hash, key) {
    return this.hdel(hash, key);
  }

  calcObjKey(objKey) {
    const str = JSON.stringify(objKey).replace(/\n/g, '');
    // Stringify JSON and flatten string
    const out = crypto.createHash(this.algorithm).update(str)
      .digest('hex');
    return out;
  }

  oget(objKey) {
    const key = this.calcObjKey(objKey);
    return this.get(key); // returns a Promise
  }

  oset(objKey, value) {
    const key = this.calcObjKey(objKey);
    return this.set(key, value); // returns a Promise
  }

  odel(objKey) {
    const key = this.calcObjKey(objKey);
    return this.del(key); // returns a Promise
  }

  ohget(hash, objKey) {
    const key = this.calcObjKey(objKey);
    return this.hget(hash, key); // returns a Promise
  }

  ohset(hash, objKey, value) {
    const key = this.calcObjKey(objKey);
    return this.hset(hash, key, value); // returns a Promise
  }

  ohdel(hash, objKey) {
    const key = this.calcObjKey(objKey);
    return this.hdel(hash, key); // returns a Promise
  }

  ogetAsync(key) {
    return this.oget(key);
  }

  osetAsync(key, value) {
    return this.oset(key, value);
  }

  odelAsync(key) {
    return this.odel(key);
  }

  ohgetAsync(hash, key) {
    return this.ohget(hash, key);
  }

  ohsetAsync(hash, key, value) {
    return this.ohset(hash, key, value);
  }

  ohdelAsync(hash, key) {
    return this.ohdel(hash, key);
  }

  // Clear the Redis Cache
  clear() {
    if (this.connected) {
      return this.cache.flushdbAsync();
    }
    // returns a Promise
    return Promise.reject(new Error('Cache is not connected'));
  }

  close() {
    let prm;
    if (this.connected) {
      prm = new Promise((resolve, reject) => {
        this.cache.once('end', () => {
          this.logger.debug('Cache Closed');
          this.connected = false;
          this.redisCache = null;
          this.memCache = null;
          resolve(this.cache);
        });
        this.cache.on('error', (err) => {
          reject(err);
        });
        this.cache.quit();
      });
    } else {
      prm = Promise.reject(new Error('Cache connection is not active'));
    }

    return prm;
  }
}

module.exports = ObjectKeyCache;

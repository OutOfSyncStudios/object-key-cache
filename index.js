// index.js

// Dependencies
const __ = require('@mediaxpost/lodashext');
const MemoryCache = require('@mediaxpost/memory-cache');
const LogStub = require('logstub');
const redis = require('redis');
const bluebird = require('bluebird');
const crypto = require('crypto');

const memCache = new MemoryCache();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const defaults = { failback: true };

class ObjectKeyCache {
  constructor(config, credentials, logger) {
    this.logger = logger || new LogStub();
    this.connected = false;
    this.cacheConfig = __.merge(Object.assign(defaults), config || {});
    // config.cache;
    // this.ttl = this.cacheConfig.ttl;
    this.creds = credentials;
    // config.credentials.redis;
    this.cache = null;
  }

  // Returns a promise that signifies when the connection to the cache is ready
  connect() {
    return new Promise((resolve, reject) => {
      memCache.once('connect', () => {
        this.logger.debug('Cache Connected');
        this.connected = true;
        resolve(this.cache);
      });
      memCache.once('error', (err) => {
        this.logger.debug('Cache Connection Failed');
        reject(err);
      });

      if (__.isUnset(this.creds)) {
        this.cache = memCache.createClient(this.cacheConfig);
      } else {
        this.cache = redis.createClient(this.creds.port, this.creds.host, this.cacheConfig);
        this.cache.once('connect', () => {
          this.logger.debug('Cache Connected');
          this.connected = true;
          resolve(this.cache);
        });
        this.cache.once('error', (err) => {
          if (this.cacheConfig.failback) {
            this.logger.debug('Redis failed with error -- Fallback to MemoryCache');
            this.logger.error(err);
            this.cache = memCache.createClient();
          } else {
            this.logger.debug('Cache Connection Failed');
            reject(err);
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
    const out = crypto.createHash('sha256').update(str)
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
        this.cache.on('end', () => {
          this.logger.debug('Cache Closed');
          this.connected = false;
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

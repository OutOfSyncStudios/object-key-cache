# object-key-cache

[![NPM](https://nodei.co/npm/@mediaxpost/object-key-cache.png?downloads=true)](https://nodei.co/npm/@mediaxpost/object-key-cache/)

[![Actual version published on npm](http://img.shields.io/npm/v/@mediaxpost/object-key-cache.svg)](https://www.npmjs.org/package/@mediaxpost/object-key-cache)
[![Travis build status](https://travis-ci.org/MediaXPost/object-key-cache.svg)](https://www.npmjs.org/package/@mediaxpost/object-key-cache)
[![Total npm module downloads](http://img.shields.io/npm/dt/@mediaxpost/object-key-cache.svg)](https://www.npmjs.org/package/@mediaxpost/object-key-cache)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1d343b0fd03947e494cdddc2966ca79b)](https://www.codacy.com/app/chronosis/object-key-cache?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=MediaXPost/object-key-cache&amp;utm_campaign=Badge_Grade)
[![Codacy Coverage Badge](https://api.codacy.com/project/badge/Coverage/1d343b0fd03947e494cdddc2966ca79b)](https://www.codacy.com/app/chronosis/object-key-cache?utm_source=github.com&utm_medium=referral&utm_content=MediaXPost/object-key-cache&utm_campaign=Badge_Coverage)
[![Dependencies badge](https://david-dm.org/MediaXPost/object-key-cache/status.svg)](https://david-dm.org/MediaXPost/object-key-cache?view=list)

`object-key-cache` is a promise-based, object-key, cache extension for the [Redis](https://www.npmjs.com/package/redis) and [memory-cache](https://www.npmjs.com/package/@mediaxpost/memory-cache) modules.

Object Key Cache provides the ability to use JavaScript Objects as keys values when committing to cache.

During connection to Redis, it defaults to fail-back to the memory cache when when connecting to Redis fails.

Object Keys that are passed into the associated o---* functions (e.g. oget, oset, etc.) are JSON stringified and then SHA256 hashed in an attempt to preserve the uniqueness of the key. *Note:* No additional mitigation of potential collision of key spaces with SHA256 is being performed. With one billion messages there is approximately a 1 in 4.3 x 10<sup>60</sup> chance with SHA256 that two separate strings will generate an identical hash. The probability is negligible for most use cases; however, if very, very large numbers of keys are likely to be stored then consideration should be given to name-spacing or segregating data by how it will be used within the cache to avoid any potential for collisions.

# [Installation](#installation)
<a name="installation"></a>

```shell
npm install @mediaxpost/object-key-cache
```

# [Usage](#usage)
<a name="usage"></a>

```js
const ObjectKeyCache = require('@mediaxpost/object-key-cache');
const objKeyCache = new ObjectKeyCache();

const testObj = { name: 'test key' };
objKeyCache.connect()
  .then(() => {
    return objKeyCache.oset(testObj, 100);
  })
  .then(() => {
    return objKeyCache.oget(testObj);
  })
  .then((result) => {
    console.log(result); // 100
    return objKeyCache.close();
  })
  .catch((err) => {
    // Do something meaningful
  });
```

# [API Reference](#api)
<a name="api"></a>
With noted exceptions, all functions are Promise-based (meaning they return a Promise which should be handled)

## constructor(options [, redisCredentials] [, log])
Create a new ObjectKeyCache client with the passed options, credentials, and logger. The `options` support only value `failback` which defaults to `true` and causes any connection attempts to Redis to fail-back to the memory Cache. Any other options provided are passed along to the Redis or MemoryCache `createClient` function. If [`redisCredentials`](#redis-credentials) are passed, then ObjectKeyCache will attempt to connect to Redis. If they are omitted or set `null` then Memory Cache is used. The [`log`](#logging-obj) is a Logging object outlined below.

## .connect() ⇒ Promise
Connects to the cache and set the `isConnected` flag to `true`. The Promise resolves to the cache connection.

## .close() ⇒ Promise
Disconnects from the cache and set the `isConnected` flag to `false`. The promise resolves to the cache connection.

## .calcObjKey(obj) ⇒ string
Returns the SHA256 Hash of the message resulting from the JSON stringified `obj`.

## .clear() ⇒ Promise
Clears the cache for the currently connected database within the cache. This is equivalent to running `FLUSHDB`.  The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .oget(obj) ⇒ Promise
Retrieves a value stored with the object key `obj`. The promise resolves to the result or `null` if it doesn't exist.

## .oset(obj, value) ⇒ Promise
Sets a value with an object key `obj`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .odel(obj) ⇒ Promise
Deletes the object key `obj`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .ohget(hash, obj) ⇒ Promise
Retrieves the Hash object key `obj` field that is scoped to the `hash`. The promise resolves to the result or `null` if it doesn't exist.

## .ohset(hash, obj, value) ⇒ Promise
Sets the Hash object key `obj` field that is scoped to the `hash` to value `value`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .ohdel(hash, obj) ⇒ Promise
Deletes the object key `obj` field scoped to the `hash`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .get(key) ⇒ Promise
Retrieves the `key` from the cache. The promise resolves to the result or `null` if it does not exist.

## .set(key, value) ⇒ Promise
Sets the `key` to the `value`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .del(key) ⇒ Promise
Deletes the `key`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .hget(hash, field) ⇒ Promise
Retrieves the `field` that is scoped to the `hash`. The promise resolves to the result or `null` if it does not exist.

## .hset(hash, field, value) ⇒ Promise
Sets the `field` that is scoped to the `hash` to the `value`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').


## .hdel(hash, field) ⇒ Promise
Deletes the `field` scoped to the `hash`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

# [Appendix](#appendix)
<a name="appendix"></a>

## [Redis Credentials](#redis-credentials)
<a name="redis-credentials"></a>
The Redis credentials define how to connect to Redis and are an object as follows:
```js
{
  port: 6379,
  host: 'localhost'
}
```

## [Logging Object](#logging-obj)
<a name="logging-obj"></a>
The Logging object is an instance of any logging library, such as [Winston](https://www.npmjs.com/package/winston) or [Bunyan](https://www.npmjs.com/package/bunyan), which support the `.error(...)`, `.info(...)`, `.debug(...)`, and `.log(...)` methods. If this is not provided, then any debug or error messages are sent to `/dev/null`.

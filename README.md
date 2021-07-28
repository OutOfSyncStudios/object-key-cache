# object-key-cache

[![NPM](https://nodei.co/npm/@outofsync/object-key-cache.png?downloads=true)](https://nodei.co/npm/@outofsync/object-key-cache/)

[![Actual version published on npm](http://img.shields.io/npm/v/@outofsync/object-key-cache.svg)](https://www.npmjs.org/package/@outofsync/object-key-cache)
[![Master build](https://github.com/OutOfSyncStudios/object-key-cache/OutOfSyncStudios/object-key-cache/actions/workflows/build-master.yml)
[![Total npm module downloads](http://img.shields.io/npm/dt/@outofsync/object-key-cache.svg)](https://www.npmjs.org/package/@outofsync/object-key-cache)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/ccf8fe0a6c99425589f55b844aef0526)](https://www.codacy.com/gh/OutOfSyncStudios/object-key-cache/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=OutOfSyncStudios/object-key-cache&amp;utm_campaign=Badge_Grade)
[![Codacy Coverage Badge](https://app.codacy.com/project/badge/Coverage/ccf8fe0a6c99425589f55b844aef0526)](https://www.codacy.com/gh/OutOfSyncStudios/object-key-cache/dashboard?utm_source=github.com&utm_medium=referral&utm_content=OutOfSyncStudios/object-key-cache&utm_campaign=Badge_Coverage)
[![Dependencies badge](https://david-dm.org/OutOfSyncStudios/object-key-cache/status.svg)](https://david-dm.org/OutOfSyncStudios/object-key-cache?view=list)

`object-key-cache` is a promise-based, object-key, cache extension for the [Redis](https://www.npmjs.com/package/redis) and [memory-cache](https://www.npmjs.com/package/@outofsync/memory-cache) modules.

Object Key Cache converts JavaScript Objects (Maps) into the key value used to look up data from cache. This is done by serializing the object into JSON (e.g. `JSON.stringify`) and then performing a SHA256 has on the resulting JSON string. This process helps preserve the uniqueness of the key for performing lookups. Once the key has been generated, the key-value pair is passed into the associated Oxxx functions (e.g. oget, oset, etc.)

*Note:* SHA256 has a very low likelihood of key space collisions, but it is not impossible. With one billion messages there is approximately a 1 in 4.3 x 10<sup>60</sup> chance that two distinct strings will generate an identical SHA256 hash. This probability is negligible for most use cases; however, if a very large numbers of keys are expected to   be stored then consideration should be given to segregating data by a namespace based upon how it will be used within the cache to decrease any potential for collisions.

# [Installation](#installation)
<a name="installation"></a>

```shell
npm install @outofsync/object-key-cache
```

# [Usage](#usage)
<a name="usage"></a>

```js
const ObjectKeyCache = require('@outofsync/object-key-cache');
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
Create a new ObjectKeyCache client with the passed options, credentials, and logger. The `options` support only value `failover` which defaults to `true` and causes any connection attempts to Redis to fail-back to the memory Cache. Any other options provided are passed along to the Redis or MemoryCache `createClient` function. If [`redisCredentials`](#redis-credentials) are passed, then ObjectKeyCache will attempt to connect to Redis. If they are omitted or set `null` then Memory Cache is used. The [`log`](#logging-obj) is a Logging object outlined below.

## .attachToClient(redisClient)
Attaches an unconnected ObjectKeyCache to an already existing and connected RedisClient.

## .detachFromClient()
Detaches ObjectKeyCache from a connected RedisClient.

## .connect() &#x27fe; Promise
Connects to the cache and set the `connected` flag to `true`. The Promise resolves to the cache connection.

## .close() &#x27fe; Promise
Disconnects from the cache and set the `connected` flag to `false`. The promise resolves to the cache connection.

## .calcObjKey(obj) &#x27fe; string
Returns the SHA256 Hash of the message resulting from the JSON stringified `obj`.

## .clear() &#x27fe; Promise
Clears the cache for the currently connected database within the cache. This is equivalent to running `FLUSHDB`.  The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .oget(obj) &#x27fe; Promise
Retrieves a value stored with the object key `obj`. The promise resolves to the result or `null` if it doesn't exist.

## .oset(obj, value) &#x27fe; Promise
Sets a value with an object key `obj`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .odel(obj) &#x27fe; Promise
Deletes the object key `obj`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .ohget(hash, obj) &#x27fe; Promise
Retrieves the Hash object key `obj` field that is scoped to the `hash`. The promise resolves to the result or `null` if it doesn't exist.

## .ohset(hash, obj, value) &#x27fe; Promise
Sets the Hash object key `obj` field that is scoped to the `hash` to value `value`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .ohdel(hash, obj) &#x27fe; Promise
Deletes the object key `obj` field scoped to the `hash`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .get(key) &#x27fe; Promise
Retrieves the `key` from the cache. The promise resolves to the result or `null` if it does not exist.

## .set(key, value) &#x27fe; Promise
Sets the `key` to the `value`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .del(key) &#x27fe; Promise
Deletes the `key`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').

## .hget(hash, field) &#x27fe; Promise
Retrieves the `field` that is scoped to the `hash`. The promise resolves to the result or `null` if it does not exist.

## .hset(hash, field, value) &#x27fe; Promise
Sets the `field` that is scoped to the `hash` to the `value`. The promise resolves to the Redis/MemoryCache messages (usually 'OK').


## .hdel(hash, field) &#x27fe; Promise
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

## [License](#license)
<a name="license"></a>

Copyright (c) 2018-2019 Jay Reardon
Copyright (c) 2019-2021 Out of Sync Studios LLC -- Licensed under the MIT license.

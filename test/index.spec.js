/* eslint id-length: warn */
import { 
  beforeAll,
  describe, 
  expect, 
  test as it,
} from '@jest/globals';

// Dependancies
import isNil from 'lodash.isnil';
import MemoryCache from '@outofsync/memory-cache';
import ObjectKeyCache from '../index.js';

const testObj = { where: { id: -1, offset: 0, limit: 20, table: 'test' } };

describe('Object Key Cache - MemoryCache', () => {
  let cache;
  beforeAll(async() => {
    cache = await new ObjectKeyCache({});
  });

  it('constructor', () => {
    expect(cache instanceof ObjectKeyCache).toBe(true);
  });

  it('connect', (done) => {
    cache
      .connect()
      .then(() => {
        expect(cache.connected).toBe(true);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('set', (done) => {
    cache
      .set('TestKey', 'TestValue')
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('get', (done) => {
    cache
      .get('TestKey')
      .then((reply) => {
        expect(reply).toBe('TestValue');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('del', (done) => {
    cache
      .del('TestKey')
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('get (missing value)', (done) => {
    cache
      .get('TestKey')
      .then((reply) => {
        expect(isNil(reply)).toBe(true);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('setAsync', (done) => {
    cache
      .setAsync('TestKey', 'TestValue')
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('getAsync', (done) => {
    cache
      .getAsync('TestKey')
      .then((reply) => {
        expect(reply).toBe('TestValue');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('delAsync', (done) => {
    cache
      .delAsync('TestKey')
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('hset', (done) => {
    cache
      .hset('TestKey', 'TestField', 'TestValue')
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('hget', (done) => {
    cache
      .hget('TestKey', 'TestField')
      .then((reply) => {
        expect(reply).toBe('TestValue');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('hdel', (done) => {
    cache
      .hdel('TestKey', 'TestField')
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('hget (missing value)', (done) => {
    cache
      .hget('TestKey', 'TestField')
      .then((reply) => {
        expect(isNil(reply)).toBe(true);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('hsetAsync', (done) => {
    cache
      .hsetAsync('TestKey', 'TestField', 'TestValue')
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('hgetAsync', (done) => {
    cache
      .hgetAsync('TestKey', 'TestField')
      .then((reply) => {
        expect(reply).toBe('TestValue');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('hdelAsync', (done) => {
    cache
      .hdel('TestKey', 'TestField')
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('del (hset key)', (done) => {
    cache
      .del('TestKey')
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('get (test del hset key)', (done) => {
    cache
      .get('TestKey')
      .then((reply) => {
        expect(isNil(reply)).toBe(true);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('calcObjKey', () => {
    const key = cache.calcObjKey(testObj);
    expect(key).toBe('655be97c6157b0517d1d2fe680bd7ff2fab7437924088ac386b3a5a08308545c6dfe7246acd4f0c687fbe773ff873c1a2b56ba82f443d4ba5e97113002ba33f0');
  });

  it('oset', (done) => {
    cache
      .oset(testObj, JSON.stringify(testObj))
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('oget', (done) => {
    cache
      .oget(testObj)
      .then((reply) => {
        expect(reply).toBe(JSON.stringify(testObj));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('odel', (done) => {
    cache
      .odel(testObj)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('oget (missing value)', (done) => {
    cache
      .oget(testObj)
      .then((reply) => {
        expect(isNil(reply)).toBe(true);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('osetAsync', (done) => {
    cache
      .osetAsync(testObj, JSON.stringify(testObj))
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('ogetAsync', (done) => {
    cache
      .ogetAsync(testObj)
      .then((reply) => {
        expect(reply).toBe(JSON.stringify(testObj));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('odelAsync', (done) => {
    cache
      .odelAsync(testObj)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('ohset', (done) => {
    cache
      .ohset('TestKey', testObj, JSON.stringify(testObj))
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('ohget', (done) => {
    cache
      .ohget('TestKey', testObj)
      .then((reply) => {
        expect(reply).toBe(JSON.stringify(testObj));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('ohdel', (done) => {
    cache
      .ohdel('TestKey', testObj)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('ohget (missing value)', (done) => {
    cache
      .ohget('TestKey', testObj)
      .then((reply) => {
        expect(isNil(reply)).toBe(true);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('ohsetAsync', (done) => {
    cache
      .ohsetAsync('TestKey', testObj, JSON.stringify(testObj))
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('ohgetAsync', (done) => {
    cache
      .ohgetAsync('TestKey', testObj)
      .then((reply) => {
        expect(reply).toBe(JSON.stringify(testObj));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('ohdelAsync', (done) => {
    cache
      .ohdelAsync('TestKey', testObj)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('del (ohset key)', (done) => {
    cache
      .del('TestKey')
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('get (test del ohset key)', (done) => {
    cache
      .get('TestKey')
      .then((reply) => {
        expect(isNil(reply)).toBe(true);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('close', (done) => {
    cache
      .close()
      .then(() => {
        expect(cache.connected).toBe(false);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  // it('connect (bad credentials)', (done) => {
  //   tmpPort = cache.creds.port;
  //   cache.creds.port = 9999;
  //   cache.connect()
  //     .then(() => {
  //       cache.creds.port = tmpPort;
  //       done('Should not succeed with bad port');
  //     })
  //     .catch((err) => {
  //       cache.creds.port = tmpPort;
  //       done();
  //     });
  //   cache.creds.port = tmpPort;
  // });
  it('set (already closed)', (done) => {
    cache
      .set('TestKey', 'TestValue')
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('get (already closed)', (done) => {
    cache
      .get('TestKey')
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('del (already closed)', (done) => {
    cache
      .del('TestKey')
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('oset (already closed)', (done) => {
    cache
      .oset(testObj, JSON.stringify(testObj))
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('oget (already closed)', (done) => {
    cache
      .oget(testObj)
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('odel (already closed)', (done) => {
    cache
      .odel(testObj)
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('hset (already closed)', (done) => {
    cache
      .hset('TestKey', 'TestField', 'TestValue')
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('hget (already closed)', (done) => {
    cache
      .hget('TestKey', 'TestField')
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('hdel (already closed)', (done) => {
    cache
      .hdel('TestKey', 'TestField')
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('ohset (already closed)', (done) => {
    cache
      .ohset('TestKey', testObj, JSON.stringify(testObj))
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('ohget (already closed)', (done) => {
    cache
      .ohget('TestKey', testObj)
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('ohdel (already closed)', (done) => {
    cache
      .ohdel('TestKey', testObj)
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('clear (already closed)', (done) => {
    cache
      .clear()
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
  it('close (already closed)', (done) => {
    cache
      .close()
      .then(() => {
        done('Should not succeed with no connection!');
      })
      .catch(() => {
        done();
      });
  });
});

describe('Object Key Cache -- Redis', () => {
  let cache;
  beforeAll(async() => {
    cache = await new ObjectKeyCache({}, { port: 6379, host: 'localhost' });
  });

  it('constructor', () => {
    expect(cache instanceof ObjectKeyCache).toBe(true);    
  });

  it('connect', (done) => {
    cache
      .connect()
      .then(() => {
        expect(cache.connected).toBe(true);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('close', (done) => {
    cache
      .close()
      .then(() => {
        expect(cache.connected).toBe(false);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe('Object Key Cache -- Bad Redis Credentials', () => {
  let cache;
  beforeAll(async() => {
    cache = await new ObjectKeyCache({}, { port: 6379, host: 'localhost' });
  });

  it('constructor', () => {
    expect(cache instanceof ObjectKeyCache).toBe(true);    
  });

  it('connect', (done) => {
    cache
      .connect()
      .then(() => {
        expect(cache.connected).toBe(true);
        expect(cache instanceof ObjectKeyCache).toBe(true);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('close', (done) => {
    cache
      .close()
      .then(() => {
        expect(cache.connected).toBe(false);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe('ObjectKeyCache -- External Cache', () => {
  let client;
  let cache;
  beforeAll(() => {
    client = new MemoryCache();
    cache = new ObjectKeyCache();
  });

  it('attachToClient', () => {
    cache.attachToClient(client);
    expect(cache.connected).toBe(true);
  });

  it('detachFromClient', () => {
    cache.detachFromClient();
    expect(cache.connected).toBe(false);
    expect(cache.cache).toBe(null);
  });
});

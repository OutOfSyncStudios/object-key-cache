// test/index.js

// Dependancies
const isNil = require('lodash.isnil');
const chai = require('chai');
const expect = chai.expect;
const ObjectKeyCache = require('..');
const MemoryCache = require('@outofsync/memory-cache');

const testObj = { where: { id: -1, offset: 0, limit: 20, table: 'test' } };

describe('Object Key Cache - MemoryCache', () => {
  let cache;
  before(async() => {
    cache = await new ObjectKeyCache({});
  });

  it('constructor', () => {
    expect(cache).to.be.instanceof(ObjectKeyCache);
  });

  it('connect', (done) => {
    cache
      .connect()
      .then(() => {
        expect(cache.connected).to.be.equal(true);
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
        expect(reply).to.be.equal('TestValue');
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
        expect(isNil(reply)).to.be.equal(true);
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
        expect(reply).to.be.equal('TestValue');
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
        expect(reply).to.be.equal('TestValue');
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
        expect(isNil(reply)).to.be.equal(true);
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
        expect(reply).to.be.equal('TestValue');
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
        expect(isNil(reply)).to.be.equal(true);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('calcObjKey', () => {
    const key = cache.calcObjKey(testObj);
    expect(key).to.be.equal('ebc984a078ae1ec47f06abb928512cf1df81dd3722530e19d9ce6f5bccc34971');
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
        expect(reply).to.be.equal(JSON.stringify(testObj));
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
        expect(isNil(reply)).to.be.equal(true);
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
        expect(reply).to.be.equal(JSON.stringify(testObj));
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
        expect(reply).to.be.equal(JSON.stringify(testObj));
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
        expect(isNil(reply)).to.be.equal(true);
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
        expect(reply).to.be.equal(JSON.stringify(testObj));
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
        expect(isNil(reply)).to.be.equal(true);
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
        expect(cache.connected).to.be.equal(false);
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
  before(async() => {
    cache = await new ObjectKeyCache({}, { port: 6379, host: 'localhost' });
  });

  it('constructor', () => {
    expect(cache).to.be.instanceof(ObjectKeyCache);
  });

  it('connect', (done) => {
    cache
      .connect()
      .then(() => {
        expect(cache.connected).to.be.equal(true);
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
        expect(cache.connected).to.be.equal(false);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe('Object Key Cache -- Bad Redis Credentials', () => {
  let cache;
  before(async() => {
    cache = await new ObjectKeyCache({}, { port: 3000, host: 'localhost' });
  });

  it('constructor', () => {
    expect(cache).to.be.instanceof(ObjectKeyCache);
  });

  it('connect', (done) => {
    cache
      .connect()
      .then(() => {
        expect(cache.connected).to.be.equal(true);
        expect(cache.cache).to.be.instanceof(MemoryCache);
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
        expect(cache.connected).to.be.equal(false);
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
  before(() => {
    cache = new ObjectKeyCache();
    client = new MemoryCache();
  });

  it('attachToClient', () => {
    cache.attachToClient(client);
    expect(cache.connected).to.be.equal(true);
  });

  it('detachFromClient', () => {
    cache.detachFromClient();
    expect(cache.connected).to.be.equal(false);
    expect(cache.cache).to.be.equal(null);
  });
});

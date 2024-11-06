const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";

//
const client = redis.createClient(redisUrl);
// replace the util.promisify with util.promisifyAll
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

// add cache functionality into prototype for query customization

mongoose.Query.prototype.cache = async function () {
  this.useCache = true;
  return this;
};

// Overwrite the exec function
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  console.log("IM ABOUT TO RUN A QUERY");
  //console.log(this.getQuery());
  console.log(this.mongooseCollection.name);

  // this assaing will create a new object for the cache key
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );
  console.log({ key });

  // See if we have a value for 'key' in redis
  const cacheValue = await client.get(key);
  console.log({ cacheValue });

  if (cacheValue) {
    // we have a value in redis
    const doc = JSON.parse(cacheValue);
    console.log("Serving from cache");
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  // if we do, then return that value

  // if we don't, then run the query and store the result in redis

  const result = await exec.apply(this, arguments);
  console.log({ result });
  // expires in 10 seconds
  client.set(key, JSON.stringify(result), "EX", 10);
  console.log("Serving from database");

  return result;
};

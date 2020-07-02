const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
const util = require("util");
client.get = util.promisify(client.get);

exports.redisGet = async (key) => {
  return client.get(key);
};

exports.redisSet = (key, val) => {
  client.set(key, val, "EX", 60 * 60 * 24);
};
exports.closeInstance = () => {
  client.quit(() => {});
};

const crypto = require("crypto");

const store = {
  users: [],
  contacts: [],
  episodes: [],
  predictions: [],
  wearableReadings: [],
  voiceSamples: [],
  emergencyActions: [],
  twoFactorChallenges: [],
};

function now() {
  return new Date().toISOString();
}

function makeId() {
  return crypto.randomUUID();
}

function insert(collection, record) {
  const item = { id: makeId(), ...record, createdAt: record.createdAt || now(), updatedAt: now() };
  store[collection].push(item);
  return item;
}

function update(collection, id, patch) {
  const item = store[collection].find((entry) => entry.id === id);
  if (!item) return null;
  Object.assign(item, patch, { updatedAt: now() });
  return item;
}

function byUser(collection, userId) {
  return store[collection].filter((entry) => entry.userId === userId);
}

function resetStore() {
  for (const key of Object.keys(store)) {
    store[key] = [];
  }
}

module.exports = { store, insert, update, byUser, resetStore, now };

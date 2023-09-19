const collections = [];

module.exports = {
  async up(db) {
    await Promise.all(collections.map((name) => db.createCollection(name)));
  },

  async down(db) {
    await Promise.all(collections.map((name) => db.collection(name).drop()));
  },
};

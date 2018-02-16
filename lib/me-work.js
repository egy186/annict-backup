'use strict';

const Annict = require('annict').default;

const MeWork = class {
  constructor (token) {
    if (!token) {
      throw new Error('"token" is required');
    }
    this.annict = new Annict();
    this.annict.client.setHeader('Authorization', `Bearer ${token}`);
    this.perPage = 50;
  }

  async get (page = 1) {
    const res = await this.annict.Me.Work.get({
      page,
      per_page: this.perPage
    });
    const result = await res.json();
    return result;
  }
};

module.exports = MeWork;

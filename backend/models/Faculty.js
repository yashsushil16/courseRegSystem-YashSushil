// Faculty model using JSON file storage
const { Faculty: FacultyStore } = require('../dataStore');

class Faculty {
  constructor(data) {
    Object.assign(this, data);
  }

  static async findOne(query) {
    const data = await FacultyStore.findOne(query);
    return data ? new Faculty(data) : null;
  }

  static async findById(id) {
    const data = await FacultyStore.findById(id);
    return data ? new Faculty(data) : null;
  }

  static async find(query = {}) {
    const data = await FacultyStore.findAll(query);
    return data.map(item => new Faculty(item));
  }

  async save() {
    if (this._id) {
      return await FacultyStore.update(this._id, this);
    } else {
      const saved = await FacultyStore.create(this);
      Object.assign(this, saved);
      return saved;
    }
  }

  toObject() {
    const { password, ...rest } = this;
    return rest;
  }

  toJSON() {
    return this.toObject();
  }
}

module.exports = Faculty;

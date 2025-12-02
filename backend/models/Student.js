// Student model using JSON file storage
const { Student: StudentStore } = require('../dataStore');

class Student {
  constructor(data) {
    Object.assign(this, data);
  }

  static async findOne(query) {
    const data = await StudentStore.findOne(query);
    return data ? new Student(data) : null;
  }

  static async findById(id) {
    const data = await StudentStore.findById(id);
    return data ? new Student(data) : null;
  }

  static async find(query = {}) {
    const data = await StudentStore.findAll(query);
    return data.map(item => new Student(item));
  }

  async save() {
    if (this._id) {
      return await StudentStore.update(this._id, this);
    } else {
      const saved = await StudentStore.create(this);
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

module.exports = Student;

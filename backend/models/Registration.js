// Registration model using JSON file storage
const { Registration: RegistrationStore } = require('../dataStore');

class Registration {
  constructor(data) {
    Object.assign(this, data);
  }

  static async findOne(query) {
    const data = await RegistrationStore.findOne(query);
    return data ? new Registration(data) : null;
  }

  static async findById(id) {
    const data = await RegistrationStore.findById(id);
    return data ? new Registration(data) : null;
  }

  static async find(query = {}) {
    const data = await RegistrationStore.findAll(query);
    return data.map(item => new Registration(item));
  }

  async save() {
    if (this._id) {
      return await RegistrationStore.update(this._id, this);
    } else {
      const saved = await RegistrationStore.create(this);
      Object.assign(this, saved);
      return saved;
    }
  }

  async populate(fields) {
    if (fields.includes('course') && this.course) {
      const Course = require('./Course');
      this.course = await Course.findById(this.course);
    }
    if (fields.includes('student') && this.student) {
      const Student = require('./Student');
      this.student = await Student.findById(this.student);
    }
    return this;
  }

  toObject() {
    return { ...this };
  }

  toJSON() {
    return this.toObject();
  }
}

module.exports = Registration;

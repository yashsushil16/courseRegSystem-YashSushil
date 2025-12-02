// Course model using JSON file storage
const { Course: CourseStore } = require('../dataStore');

class Course {
  constructor(data) {
    Object.assign(this, data);
  }

  static async findOne(query) {
    const data = await CourseStore.findOne(query);
    return data ? new Course(data) : null;
  }

  static async findById(id) {
    const data = await CourseStore.findById(id);
    return data ? new Course(data) : null;
  }

  static async find(query = {}) {
    const data = await CourseStore.findAll(query);
    return data.map(item => new Course(item));
  }

  async save() {
    if (this._id) {
      return await CourseStore.update(this._id, this);
    } else {
      const saved = await CourseStore.create(this);
      Object.assign(this, saved);
      return saved;
    }
  }

  async populate(field) {
    if (field === 'faculty' && this.faculty) {
      const Faculty = require('./Faculty');
      this.faculty = await Faculty.findById(this.faculty);
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

// Add static populate method
Course.populate = async (items, field) => {
  if (field === 'faculty') {
    const Faculty = require('./Faculty');
    for (let item of items) {
      if (item.faculty && typeof item.faculty === 'string') {
        item.faculty = await Faculty.findById(item.faculty);
      }
    }
  }
  return items;
};

module.exports = Course;

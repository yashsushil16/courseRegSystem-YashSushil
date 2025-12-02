// JSON file-based data store (no MongoDB required)
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, 'data');
const files = {
  students: path.join(dataDir, 'students.json'),
  faculty: path.join(dataDir, 'faculty.json'),
  courses: path.join(dataDir, 'courses.json'),
  registrations: path.join(dataDir, 'registrations.json')
};

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize empty files if they don't exist
Object.values(files).forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
  }
});

// Helper functions
const readFile = (file) => {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeFile = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Generate ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Data Store Class
class DataStore {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.file = files[collectionName];
  }

  async findAll(query = {}) {
    let data = readFile(this.file);
    
    // Simple query filtering
    if (Object.keys(query).length > 0) {
      data = data.filter(item => {
        return Object.keys(query).every(key => {
          if (key === '$or') {
            return query[key].some(condition => {
              return Object.keys(condition).some(k => {
                if (typeof condition[k] === 'object' && condition[k].$regex) {
                  const regex = new RegExp(condition[k].$regex, condition[k].$options || '');
                  return regex.test(String(item[k] || ''));
                }
                return item[k] == condition[k];
              });
            });
          }
          if (typeof query[key] === 'object' && query[key].$regex) {
            const regex = new RegExp(query[key].$regex, query[key].$options || '');
            return regex.test(String(item[key] || ''));
          }
          // Handle undefined/null - if query value exists but item doesn't have the field, it's a mismatch
          if (item[key] === undefined && query[key] !== undefined) {
            return false;
          }
          return item[key] == query[key];
        });
      });
    }
    
    return data;
  }

  async findOne(query) {
    const data = readFile(this.file);
    return data.find(item => {
      return Object.keys(query).every(key => {
        if (key === '$or') {
          return query[key].some(condition => {
            return Object.keys(condition).some(k => item[k] == condition[k]);
          });
        }
        return item[key] == query[key];
      });
    });
  }

  async findById(id) {
    const data = readFile(this.file);
    return data.find(item => item._id === id || item.id === id);
  }

  async create(item) {
    const data = readFile(this.file);
    const newItem = {
      _id: generateId(),
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(newItem);
    writeFile(this.file, data);
    return newItem;
  }

  async update(id, updates) {
    const data = readFile(this.file);
    const index = data.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeFile(this.file, data);
    return data[index];
  }

  async delete(id) {
    const data = readFile(this.file);
    const index = data.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return false;
    
    data.splice(index, 1);
    writeFile(this.file, data);
    return true;
  }

  async deleteMany(query) {
    const data = readFile(this.file);
    const initialLength = data.length;
    const filtered = data.filter(item => {
      return !Object.keys(query).every(key => {
        return item[key] == query[key];
      });
    });
    writeFile(this.file, filtered);
    return initialLength - filtered.length;
  }

  async count(query = {}) {
    const data = await this.findAll(query);
    return data.length;
  }
}

// Export collections
module.exports = {
  Student: new DataStore('students'),
  Faculty: new DataStore('faculty'),
  Course: new DataStore('courses'),
  Registration: new DataStore('registrations')
};



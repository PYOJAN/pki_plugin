const { join } = require("path");
const { readJson, writeJson } = require("fs-extra");

class jsonDB {
  // #DATABASE_PATH = join(__dirname, "../../database", "setting.json");
  #DATABASE_PATH = join(process.env["USERPROFILE"], "setting.json");

  constructor(dbReletivePath = this.#DATABASE_PATH) {
    this.dbPath = dbReletivePath;
  }

  // Getting all the data from the database
  async findAll() {
    let data;
    try {
      data = await readJson(this.dbPath);
      return data ? { data } : { status: false, data: null };
    } catch (err) {
      return { data: null, status: false, message: "Data not found" };
    }
  }

  // Getting data from the database by id
  async findOne(searchKey) {
    let data;
    try {
      data = await readJson(this.dbPath);
      return data
        ? { data: data[searchKey] }
        : { status: false, message: `data not found ${searchKey}` };
    } catch (err) {
      return { data: null, status: false, message: err };
    }
  }

  // insert data in the database
  async insert(data = {}) {
    let dbData;
    try {
      dbData = await readJson(this.dbPath);
      dbData = { ...dbData, ...data };
      await writeJson(this.dbPath, dbData);
      return { status: true, data: dbData };
    } catch (err) {
      return { status: false, data: null, message: err };
    }
  }

  // update data in the database
  async update(searchKey, data = {}) {
    let dbData;
    try {
      dbData = await readJson(this.dbPath);
      const dataToBeUpdated = { ...dbData[searchKey], ...data };
      dbData = { ...dbData, [searchKey]: dataToBeUpdated };
      await writeJson(this.dbPath, dbData);
      return { status: true, data: dataToBeUpdated };
    } catch (err) {
      return { status: false, data: null, message: err };
    }
  }

  get DBPATH() {
    return this.dbPath;
  }
}

const dataBase = new jsonDB();

module.exports = dataBase;

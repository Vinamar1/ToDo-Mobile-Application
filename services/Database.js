import * as SQLite from 'expo-sqlite';
import * as _ from 'lodash';


const shortid = require('shortid');



const db = SQLite.openDatabase("ToDo.db");

export default {
   init: function () {
      try {
         console.log('Creating database tables');
         db.transaction(tx => {
            tx.executeSql("CREATE TABLE IF NOT EXISTS saved_task (id VARCHAR NOT NULL, taskName VARCHAR NOT NULL, taskCreatedAt TEXT, completedTasks VARCHAR NOT NULL, taskCategory VARCHAR NOT NULL, taskDesc VARCHAR NOT NULL )")
            // tx.executeSql("DROP TABLE saved_task")
         });
      }
      catch (e) {
         console.log('Creating database message', e.message)
      }
   },

   validateTableName: function (tableName) {
      const tables = [
         `saved_task`,
      ];
      if (tables.indexOf(tableName) == -1) {
         throw new Error('Invalid table name');
      }
      return true;
   },

   executeQuery: function (query) {
      return new Promise((resolve, reject) => {
         db.transaction(tx => {
            tx.executeSql(query, [], function (t, result) {
               resolve(result);
            }, function (t, error) {
               reject(error);
            });
         });
      });
   },

	/**
	 * Function to insert the data in any table in the local DB.
	 *
	 * @param {string} tableName
	 * @param {string} data
	 * 
	 */

   deleteTask: async function (id) {
      const query = `DELETE FROM saved_task where id='${id}'`;
      return this.executeQuery(query);
   },

   insert: function (tableName, data) {
      this.validateTableName(tableName);
      const query = `INSERT INTO ${tableName} (${Object.keys(data).join(',')}) VALUES ('${Object.values(data).join("','")}')`;
      return this.executeQuery(query);
   },

   insertOrReplace: function (tableName, data) {
      this.validateTableName(tableName);
      const query = `INSERT OR REPLACE INTO ${tableName} (${Object.keys(data).join(',')}) VALUES ('${Object.values(data).join("','")}')`;
      // console.log(query);
      return this.executeQuery(query);
   },

   updateTask: async function (id, data) {
      let query = `UPDATE saved_task SET completedTasks = '${data}' WHERE id='${id}'`;
      const result = await this.executeQuery(query);
      console.log("Database@updateTasks", result);
      return result;
   },

   /**
    * Function to select all data from any table in the local DB.
    *
    * @param {string} tableName
    * @param {string} [condition={}]
    * 
    */
   select: function (tableName, condition = {}) {
      this.validateTableName(tableName);
      let query = `SELECT * FROM ${tableName} WHERE 1`;
      if (_.size(condition) > 0) {
         _.map(condition, (v, k) => {
            query += ` AND ${k} = '${v}'`;
         });
      }
      console.log(query);
      return this.executeQuery(query);
   },

   saveTask: async function (data, id) {
      const query = `INSERT INTO saved_task (${Object.keys(data).join(',')})VALUES ('${Object.values(data).join("','")}')`;
      return await this.executeQuery(query);
   },
}



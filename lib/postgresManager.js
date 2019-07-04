require('dotenv').config();
const {Client} = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect(function(err) {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
});

exports.registerUser = function(userId,callback) {

  var query = `INSERT INTO line_user (line_user_id) VALUES ($1);`;
  client.query(query,[userId])
      .then(result=>{
          callback();
          client.end()
      }).catch(err=>{
          console.error('error running query', err);
          client.end()
      })
}

// exports.add_words = function(callback) {
//
// }

// exports.delete_words = function(callback) {
//
// }
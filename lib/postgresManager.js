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

//フォロー時のデータベース登録
exports.registerUser = function(userId,userName,callback) {

  var insertQuery = `INSERT INTO line_user (line_user_id,name) VALUES ($1,$2);`;
  client.query(insertQuery,[userId,userName])
      .then(result=>{
          callback();
          client.end();
      }).catch(err=>{
          console.error('error running query', err);
          client.end();
      })
}

exports.getAllUser = function(){
    var getQuery = `SELECT * FROM line_user;`;
    return client.query(getQuery)

}

exports.getQuestions = function(){
    var getQuery = `SELECT * FROM questions q INNER JOIN question_choices c on q.id = c.question_id WHERE q.id=1;`
    return client.query(getQuery)
}

// exports.add_words = function(callback) {
//
// }

// exports.delete_words = function(callback) {
//
// }
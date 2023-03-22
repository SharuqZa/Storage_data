const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();

app.use(bodyParser.json());

// Storage //
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})
const upload = multer({
  
      storage: storage

    })

app.use(bodyParser.json());

// Connection //
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'data'
});

 // Post //
  app.post('/upload', upload.single('images'),(req, res) => {
    const { filename, mimetype, path, size} = req.file;
    const sql = 'INSERT INTO images (originalname,type,path,size) VALUES (?, ?, ?, ?)';
    const values = [filename, mimetype, path, size];

    connection.query(sql, values, (err, results,fields) => {
      if (err) throw err;
    
      res.status(200).json({ message: 'image upload successfully' });
    
    });
});
 // Put Update value //

 app.put('/upload/:id', (req, res) => {

   const data = [req.body.originalname, req.params.id];

  connection.query('UPDATE images SET originalname = ?, updated_at=CURRENT_TIMESTAMP  WHERE id = ?',data,
  (err,results,fields) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating data');
      } else {
        res.send('Data updated successfully');
      }
    }
  );
});

// Delete Value //

app.delete('/upload/:id', (req, res) => {

  connection.query('DELETE FROM images WHERE id =' + req.params.id,
 (err,results,fields) => {
     if (err) {
       console.log(err);
       res.status(500).send('Error Deleting data');
     } else {
       res.send('Data Deleted successfully');
     }
   }
 );
});

 // Port Connection //
app.listen(3000, () => {
  console.log('server running on port 3000');
});
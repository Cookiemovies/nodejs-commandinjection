var express = require('express')
var app = express()
const child_process = require('child_process');

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/outfile', function (req, res) {

  child_process.exec(
      'cat ' + req.query.file, (error, stdout, stderr) => {
        if (error) {
        console.log('error: ', error.messsage)
        return;
      }
      if (stderr) {
        console.log('stderr: ', stderr)
        return;
      }
      console.log('OUTPUT:\r\n', stdout);
    });
  res.send('Possible Command Injection!: Will output a file to console: ' + req.query.file)
});

app.get('/outsafe', function (req, res) {

  const filename = req.query.filename;

  if  (
      (filename.includes(",")) 
      || 
      (filename.includes(";"))
      || 
      (filename.includes("&"))
      || 
      (filename.includes("|"))
      ) {
        res.send('Filename could not be validated: ' + filename)
        console.log("Filename could not be validated: " + filename);
    return;
  }

  child_process.execFile(
      'cat', [filename], (error, stdout, stderr) => {
        if (error) {
        console.log('error: ', error.messsage)
        return;
      }
      if (stderr) {
        console.log('stderr: ', stderr)
        return;
      }
      console.log('OUTPUT:\r\n', stdout);
    });
  res.send('Will output a file to console: ' + filename)
});

app.post('/hello', function (req, res) {
  res.json({
    name: 'hello',
    message: 'I am message'
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

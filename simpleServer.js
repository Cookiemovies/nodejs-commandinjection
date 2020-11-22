var express = require('express')
var app = express()
const child_process = require('child_process');
app.disable("x-powered-by");

app.get('/', function (req, res) {
  res.send('<html><body><h1>Welcome to the code injection test</h1><p>Problem: <a href="http://localhost:3000/outfile?filename=outputfile.txt|ls -a">http://localhost:3000/outfile?filename=outputfile.txt|ls -a</a></p><p>Safe: <a href="http://localhost:3000/outsafe?filename=outputfile.txt|ls%20-a">http://localhost:3000/outsafe?filename=outputfile.txt|ls -a</a></p></body></html>')
})

app.get('/outfile', function (req, res) {

  child_process.exec(
      'cat ' + req.query.filename, (error, stdout, stderr) => {
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
  res.send('<html><body><h1>Possible Command Injection!: Will output a file to console: ' + req.query.filename + ' </h1></body></html>')
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
        res.send('<html><body><h1>Filename could not be validated: ' + encodeURI(filename) + ' </h1></body></html>');
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
  res.send('<html><body><h1>Will output a file to console: ' + encodeURI(filename) + ' </h1></body></html>');
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

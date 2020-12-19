var express = require("express");
var app = express();

const child_process = require("child_process");
app.disable("x-powered-by");

const htmlbody = "<html><body>";
const bodyhtml = "</body></html>";
const homepage = '<p><a href="http://localhost:3000/">BACK</a></p>';
const welcome = "<h1>Welcome to the code and SQL injection test</h1>";
const novalidation = "Filename could not be validated: ";
const fileoutput = "Will output a file to console: ";
const possible = "Possible Command Injection! ";
const problem =
  '<p>Problem: <a href="http://localhost:3000/outfile?filename=outputfile.txt|ls -a">http://localhost:3000/outfile?filename=outputfile.txt|ls -a</a></p>';
const safe1 =
  '<p>Safe 1: <a href="http://localhost:3000/outsafe?filename=outputfile.txt|ls%20-a">http://localhost:3000/outsafe?filename=outputfile.txt|ls -a</a></p>';
const safe2 =
  '<p>Safe 2: <a href="http://localhost:3000/outsafe?filename=outputfile.txt">http://localhost:3000/outsafe?filename=outputfile.txt</a></p>';
const sql =
  '<p>SQL: <a href="http://localhost:3000/sql?price=50">http://localhost:3000/sql?price=50</a></p>';
const sqlinj =
  '<p>SQL Injection: <a href="http://localhost:3000/sql?price=50;SELECT * FROM PRODUCTS">http://localhost:3000/sql?price=50;SELECT * FROM PRODUCTS</a></p>';

app.get("/", function (req, res) {
  res.send(
    htmlbody + welcome + problem + safe1 + safe2 + sql + sqlinj + bodyhtml
  );
});

app.get("/outfile", function (req, res) {
  child_process.exec("cat " + req.query.filename, (error, stdout, stderr) => {
    if (error) {
      console.log("error: ", error.messsage);
      return;
    }
    if (stderr) {
      console.log("stderr: ", stderr);
      return;
    }
    console.log("OUTPUT:\r\n", stdout);
  });
  res.send(
    htmlbody +
      "<h1>" +
      possible +
      "</h1><h1>" +
      fileoutput +
      req.query.filename +
      "</h1>" +
      homepage +
      bodyhtml
  );
});

app.get("/outsafe", function (req, res) {
  const filename = req.query.filename;

  if (
    filename.includes(",") ||
    filename.includes(";") ||
    filename.includes("&") ||
    filename.includes("|")
  ) {
    res.send(
      htmlbody +
        "<h1>" +
        novalidation +
        encodeURI(filename) +
        " </h1>" +
        homepage +
        bodyhtml
    );
    console.log(novalidation + filename);
    return;
  }

  child_process.execFile("cat", [filename], (error, stdout, stderr) => {
    if (error) {
      console.log("error: ", error.messsage);
      return;
    }
    if (stderr) {
      console.log("stderr: ", stderr);
      return;
    }
    console.log("OUTPUT:\r\n", stdout);
  });
  res.send(
    htmlbody +
      "<h1>" +
      fileoutput +
      encodeURI(filename) +
      " </h1>" +
      homepage +
      bodyhtml
  );
});

//MSSQL Connection
var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var TYPES = require("tedious").TYPES;

// const servername = 'COOKIE-LAPTOP\SQLEXPRESS';
const servername = "localhost";
const database = "Northwind";
const user = "node";
const pass = "node";

app.get("/sql", function (req, res) {
  var config = {
    server: servername,
    authentication: {
      type: "default",
      options: {
        userName: user,
        password: pass,
      },
    },
    options: {
      encrypt: false,
      database: database,
      validateBulkLoadParameters: false,
    },
  };

  var connection = new Connection(config);

  var htmlhead =
    "<html><head><style>table { width:400pt; } table, th, td {border: 1px solid black; border-collapse: collapse; } th, td { padding: 15px ; text-align: middle; } #t01 tr:nth-child(even) { background-color: #eee; } #t01 tr:nth-child(odd) { background-color: #fff; } #t01 th { background-color: black; color: white; }</style></head><body>";
  var resultrows =
    '<table id="t01"><tr><th>ID</th><th>Product</th><th>UnitPrice</th></tr>';

  connection.connect(function (err) {
    if (err) {
      console.log("ERROR IN LOGIN:" + err);
      res.send(
        "<html><body><h1>ERROR IN LOGIN: " + err + "</h1></body></html>"
      );
    } else {
      var price = req.query.price;

      /*
        var reg = new RegExp('^[0-9]+$');
        if (!(reg.test(price)))
        {
          price = '40';
        }
        */

      if (price == undefined) {
        readDB("50");
      } else {
        readDB(price);
      }
    }
  });

  connection.on("debug", function (text) {
    console.log("DEBUG MESSAGE: " + text);
  });

  function readDB(UnitPrice) {
    var request = new Request(
      "SELECT ProductID, ProductName, UnitPrice FROM Products WHERE UnitPrice > " +
        UnitPrice +
        ";",
      function (err, rowCount) {
        if (err) {
          console.log("ERROR IN REQUEST:" + err);
        } else {
          console.log("Returned " + rowCount + " rows");
        }
        connection.close();
        res.send(
          htmlhead +
            "<h1>Northwind Products</h1>" +
            resultrows +
            "</table>" +
            bodyhtml
        );
      }
    );

    var result = "<tr>";

    console.log("REQUEST ON GETROWS");
    request.on("row", function (columns) {
      columns.forEach(function (column) {
        if (column.value === null) {
          console.log("NULL");
        } else {
          result += "<td>" + column.value + "</td>";
        }
      });
      resultrows += result + "</tr>";
      result = "<tr>";
    });

    request.on("done", function (rowCount, more) {
      console.log(rowCount + " rows returned");
    });
    connection.execSql(request);
  }
});

app.listen(3000, function () {
  console.log("Node app listening on port 3000!");
});

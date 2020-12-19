# Command and SQL Injection in a Nodejs + Express Server
The parameter filename on the URL /outfile runs an EXEC function which is insecure

Standard URL  
http://localhost:3000/outfile?filename=outputfile.txt

URL with Code injection  
http://localhost:3000/outfile?filename=outputfile.txt|ls%20-la

Safe URL  
http://localhost:3000/outsafe?filename=outputfile.txt  
http://localhost:3000/outsafe?filename=outputfile.txt|ls%20-la

This URL uses the EXECFILE function which can not chain commands
The filename is also validated whether it does contain suspicious characters
Additionally the Webpage output of the filename is URI encoded so safe for output

SQL Injection  
http://localhost:3000/sql?price=50  
http://localhost:3000/sql?price=50;SELECT%20*%20FROM%20PRODUCTS  


# Install and run

To install this repository on your computer you need Node.js.  
Before you can run it you need SQL Server / Express installed as well and the Northwind database imported.  
  
```
git clone https://github.com/Cookiemovies/nodejs-commandinjection  
npm install  
```

## Install SQL Server Express, Management Studio and the Northwind database

Download SQL Server and Management Studio from the Microsoft website.
Google for the Northwind database and find an Export
Import the database at command line or in Management Studio
Setup the database with your credentials.

MS SQL Server Express can be found here:
https://www.microsoft.com/en-us/download/details.aspx?id=101064  
  
The Northwind database example for import can be found here:
https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/northwind-pubs
  
SQL Server Management Studio can be downloaded here:  
https://go.microsoft.com/fwlink/?linkid=2147207&clcid=0x409  

## Run
  
```
npm start  
```
  
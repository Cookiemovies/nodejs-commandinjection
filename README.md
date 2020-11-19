# Command Injection in a Nodejs Server
The parameter file on the URL runs an EXEC function which is insecure

Standard URL:
http://localhost:3000/outfile?file=contrast_security.yaml

URL with Code injection
http://localhost:3000/outfile?file=contrast_security.yaml|ls%20-la

Safe URL for Code Injection
http://localhost:3000/outsafe?filename=contrast_security.yaml

This URL uses the EXECFILE function which can not chain commands
The filename is also validated whether it does contain suspicious characters
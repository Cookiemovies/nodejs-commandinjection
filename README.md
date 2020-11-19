# Command Injection in a Nodejs Server
The parameter filename on the URL /outfile runs an EXEC function which is insecure

Standard URL:
http://localhost:3000/outfile?filename=contrast_security.yaml

URL with Code injection
http://localhost:3000/outfile?filename=contrast_security.yaml|ls%20-la

Safe URL
http://localhost:3000/outsafe?filename=contrast_security.yaml
http://localhost:3000/outsafe?filename=contrast_security.yaml|ls%20-la

This URL uses the EXECFILE function which can not chain commands
The filename is also validated whether it does contain suspicious characters
Additionally the Webpage output of the filename is URI encoded so safe for output
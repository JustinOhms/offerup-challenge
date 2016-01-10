# OfferUp Challenge

justinohms@gmail.com

## Notes:
- The vagrant file provided is configured to work with the parallels provider and uses a basic parallels ubuntu-14.04 box, adjust as needed.

- To enable node debug port forwarding (port 5858) Run the `sshdebug.sh` script from the host to enable nodejs debug forwarding of port 5858 out of the client.  For some reason vagrant's built in port forwarding does not work with the debugger. This script will create the necessary ssh tunnel and port forwarding.  It will also leave the ssh session open to set up dependencies and start the service. *(see following notes)*

- These next two steps are needed because I have not set up a vm image for vagrant yet.  You should only need to do them once.  
 - Install *node* and *npm*.  The easiest way will be with ubuntu package manager.   
`sudo apt-get install nodejs`    
`sudo apt-get install npm`  
`sudo ln -s /usr/bin/nodejs /usr/bin/node`

 - There are not many npm dependencies but you will need to install them in the vm.
`cd /vagrant/server/; npm install`

- I also have not currently set up the server to automatically start so you will need to ssh into the server and manually start the node server.  *(you can reuse the session that was opened by the sshdebug.sh script)*   
 `node /vagrant/server/server.js`   
or for development with supervisor and debug enabled   
 `supervisor --debug /vagrant/server/server.js`


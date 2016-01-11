# OfferUp Challenge

justinohms@gmail.com

## Notes:
- The vagrant file provided is configured to work with the parallels provider and uses a basic parallels ubuntu-14.04 box, adjust as needed.

- The vagrant file forwards the hosts local port 80 to the client port 8080.  Make adjustments as needed if the host's port 80 is otherwise in use. 

- To enable node debug port forwarding (port 5858) Run the `sshdebug.sh` script from the host to enable nodejs debug forwarding of port 5858 out of the client.  For some reason vagrant's built in port forwarding does not work with the debugger. This script will create the necessary ssh tunnel and port forwarding.  It will also leave the ssh session open to set up dependencies and start the service. *(see following notes)*

- These next few steps are needed because I have not set up a vm image for vagrant yet.  You should only need to do them once.  
 - Install *node* and *npm*.  The easiest way will be with ubuntu package manager.   
 You should also set up a symbolic link in */usr/bin* and install *supervisor* and *mocha* modules globally.
`sudo apt-get install nodejs`    
`sudo apt-get install npm`  
`sudo ln -s /usr/bin/nodejs /usr/bin/node`
`sudo npm install -g supervisor` 
`sudo npm install -g mocha`
 
 - There are not many project npm dependencies but you will need to install them in the vm.
`cd /vagrant/server/; npm install`

- Install postgres native drivers. Install postgres libraries for ubuntu.   
`sudo apt-get install libpq-dev`   

 

- I also have not currently set up the server to automatically start so you will need to ssh into the server and manually start the node server.  *(you can reuse the session that was opened by the sshdebug.sh script)*   
 `node /vagrant/server/server.js`   
or for development with supervisor and debug enabled   
 `supervisor --debug /vagrant/server/server.js`
 
- To run tests in watch mode (on change reload)  
 `mocha --watch`


# P2

## Starting the servers
To start the servers run the bat file if you are on windows or bash file if you are on mac. This will start two terminals where the back-end and front-end will run. It will also open a webpage with access to the front-end server.

## Debugging on the front-end server
The front-end is written with react this means that to be able to easily debug the code you can download the [browser extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) for react development.

## Debugging on the back-end server
The back-end server is run using nodemon which means that you will not have to restart the code after each change in the code.

## Adding changes to be commited
To add changes to files you write a git add command for each file you want to include in the commit:
```
git add <file name>
```

## Commiting and pushing to the github
For the safety of the project you have to upload changes to a branch before merging it with the main branch. To do this write the following commands in the terminal after adding the wanted changes:
```
git commit -m "<Your commit message>"
git checkout -b <The name of your branch>
git push -u origin <The name of your branch>
```

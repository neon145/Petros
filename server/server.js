const fs = require('fs');
const express = require('express');
const dirTree = require("directory-tree");

const server = express();

server.use(express.json());

server.listen(8080, () => {
    console.log('Server initiated');
})

server.get('/test', (req, res) => {
    res.send({message:"Petros is running..."})
});

server.post('/dir', (req, res) => {
    let {URI} = req.body;
    
    let mkPath = URI.replace('.','./server/data')
    
    fs.mkdir(mkPath,{recursive: true}, function(err) {
        if (err) {
            console.log(err)
            res.send({message:"Failed to create directory"})
        } else {
            console.log("New directory successfully created.")
            res.send({message:"New directory successfully created"})
        }
    })
})
server.post('/file', (req, res) => {
    let {URI,data} = req.body;
    
    let mkPath = URI.replace('.','./server/data')
    
    fs.writeFile(mkPath,data, function(err) {
        if (err) {
            console.log(err)
            res.send({message:"Failed to create file"})
        } else {
            console.log("New file successfully created.")
            res.send({message:"New file successfully created"})
        }
    })
})
server.get('/tree', (req, res) => {
    let {path} = req.query
    path = path.replace(".",'./server/data')
    const tree = dirTree(path);
    console.log(tree)
    res.send({message: tree})
})
server.get('/list', (req, res) => {
    let {path} = req.query
    path = path.replace(".",'./server/data')
    let files = []
    fs.readdirSync(path).forEach(file => {
        files.push(file)
    });
    res.send({message: files})
      
})
server.post('/rmdir', (req, res) => {
    let {path} = req.body
    path = path.replace(".",'./server/data')
    
    fs.rmdir(path, e=>{
        if (e) {
            console.log(e)
            res.send({message:"Failed to remove directory"})
        } else {
            console.log("directory successfully deleted.")
            res.send({message:"Directory successfully deleted"})
        }
    })
})

server.post('/rm', (req, res) => {
    let {path} = req.body
    path = path.replace(".","./server/data")
    fs.unlink(path, e=>{
        if (e) {
            console.log(e)
            res.send({message:"Failed to remove File"})
        } else {
            console.log("File successfully deleted.")
            res.send({message:"File successfully deleted"})
        }
    })
})
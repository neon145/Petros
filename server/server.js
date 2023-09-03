const fs = require('fs');
const express = require('express');
const dirTree = require("directory-tree");
const {exec} = require("child_process");
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
    URI = `./server/data/${URI}`
    
    fs.mkdir(URI,{recursive: true}, function(err) {
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
    
    URI = `./server/data/${URI}`
    
    fs.writeFile(URI,data, function(err) {
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
    let {URI} = req.query
    URI = `./server/data/${URI}`
    const tree = dirTree(URI);
    console.log(tree)
    res.send({message: tree})
})
server.get('/list', (req, res) => {
    let {URI} = req.query
    URI = `./server/data/${URI}`
    let files = []
    fs.readdirSync(URI).forEach(file => {
        files.push(file)
    });
    res.send({message: files})
      
})
server.post('/rmdir', (req, res) => {
    let {URI} = req.body
    URI = `./server/data/${URI}`
    
    fs.rm(URI,{recursive:true}, e=>{
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
    let {URI} = req.body
    URI = `./server/data/${URI}`
    fs.unlink(URI, e=>{
        if (e) {
            console.log(e)
            res.send({message:"Failed to remove File"})
        } else {
            console.log("File successfully deleted.")
            res.send({message:"File successfully deleted"})
        }
    })
})

server.get('/cat',(req, res) =>{
    let {URI} = req.query
    URI = `./server/data/${URI}`

    fs.readFile(URI, (e, data) =>{
        if (e) {
            console.log(e)
            res.send({message:"Failed to read File"})
        } else {
            console.log("File successfully read.")
            res.send({message:data.toString()})
        }
    })
})

server.post("/exec", (req, res) => {
    let {key,command} = req.body
    console.log("execution called")
    if (key === "exec") {
        exec(command,(err, stdout, stderr) => {
            if (err) {
                console.log(`error: ${error.message}`);
                res.send({message:error.message});
            }
            if (stderr) {
                console.log(`error: ${stderr}`);
                res.send({message:stderr});
            }
            console.log(stdout);
            res.send({message:stdout});

        })
    }
    else {
        res.send({message:"incorrect key"});
    }

})
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 8080;
const AVL = require('./AVL')
const CSVinfo = require('./readCSV')

let avlTree = null;

function buildAvlTree(){
    let results = [];
    avlTree = new AVL()
    let buildTree = new Promise((resolve, reject) => {
        fs.createReadStream('Raw Data.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                const gameObjects = CSVinfo.CSVResultsToObject(results); //stores gameObjList
                for (const game of gameObjects){
                    avlTree.root = avlTree.insertNode(avlTree.root, game)
                }
                resolve(avlTree); //waits till tree built
            })
            .on('error', reject)
    });
    return buildTree;
}

async function startServer(){
    //need to start a server and listen to api requests
    try {
        avlTree = await buildAvlTree(); // wait for the tree to be built
        app.get('/api/search', (req,res) => {
            const filters = req.query //.../api/search?genre=Sports&platform=Wii&year=2009 becomes an obj: {genre: 'Sports',platform: 'Wii',year: '2009'}
            const result = avlTree.BFS(filters)
            res.json({
                result
            });
        })
        app.listen(port , ()=>{
            console.log("Server running")
        });
    } catch (error){
        console.log("Something went wrong: ", error)
    }
}

startServer();
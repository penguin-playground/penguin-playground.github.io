const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 8080;

function buildAvlTree(){
    let results = [];
    const avlTree = new AVL()
    let buildTree = new Promise((resolve, reject) => {
        fs.createReadStream('Raw Data.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                const gameObjects = CSVResultsToObject(results); //stores gameObjList
                for (const game in gameObjects){
                    avlTree.insertNode(avlTree.root, game)
                }
                resolve(avlTree); //waits till tree built
            })
            .on('error', reject)
    });
}

async function startServer(){
    //need to start a server and listen to api requests
}
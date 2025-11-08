const fs = require("fs");
const csv = require("csv-parser");
const results = [];
fs.createReadStream('Raw Data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        const gameObjects = CSVResultsToObject(results); //stores gameObjList
        const json = JSON.stringify(gameObjects, null, 0)
        fs.writeFile('data.json', json, (err) => {
            if(err){
                console.log("Something went wrong with creating json file");
            } else {
                console.log("Converted to json")
            }
        });
    })
    .on('error', (err) => {
        console.log("Error in fs.createReadStream")
    })

class Game {
    constructor(Name, Platform, Year_of_Release, Genre, Publisher, Global_Sales, Critic_Score, User_Score, Developer, Rating) {
        this.Name = Name;
        this.Platform = Platform;
        this.Year_of_Release = Year_of_Release;
        this.Genre = Genre;
        this.Publisher = Publisher;
        this.Global_Sales = Global_Sales;
        this.Critic_Score = Critic_Score;
        this.User_Score = User_Score;
        this.Developer = Developer;
        this.Rating = Rating;
    }
}

function CSVResultsToObject(results){
    const gameObjList = [];
    for (let i = 0; i < results.length; i++) {
        const row = results[i];
        const gameObj = new Game(
            row.Name || "Not Specified",
            row.Platform || "Not Specified",
            row.Year_of_Release || "Not Specified",
            row.Genre || "Not Specified",
            row.Publisher || "Not Specified",
            row.Global_Sales || "Not Specified",
            row.Critic_Score || "Not Specified",
            row.User_Score || "Not Specified",
            row.Developer || "Not Specified",
            row.Rating || "Not Specified"
        );
        gameObjList.push(gameObj);
    }
    return gameObjList;
}

module.exports = {
    Game:Game,
    CSVResultsToObject:CSVResultsToObject,
};
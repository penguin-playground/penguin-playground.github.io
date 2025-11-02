const csv = require('csv-parser')
const fs = require('fs')
const results = [];


class game {
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

fs.createReadStream('Raw Data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        CSVResultsToObject(results)
    });

function CSVResultsToObject(results){
    const gameObjList = [];
    for(let i = 0; i < results.length;i++){
        let currentResults = results[i];
        const gameObj = new game(currentResults)
        gameObjList.push(gameObj)
    }
    return gameObjList;
}


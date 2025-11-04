const apiKey = "234f4811a29b4c78a8d5561438f2e01b";
const apiURL = `https://api.rawg.io/api/games?key=${apiKey}&page_size=6`;
const gameContainer = document.getElementById("games-container");
const AVL = require('./AVL')
const CSVinfo = require('./readCSV')


document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

    function toggleTheme() {
        body.classList.toggle('dark-theme');

        if (body.classList.contains('dark-theme')){
            themeToggle.textContent = 'Light';
        } else {
            themeToggle.textContent = 'Dark';
        }
    }

    themeToggle.addEventListener('click', toggleTheme);
});

async function getGames() {
    
}

const select = document.getElementById('sort-by');
const div = document.getElementById('search-algorithm');

select.addEventListener('change', function() {
    if (this.value != '0') {
        div.style.display = 'none';
    }
    else {
        div.style.display = 'block';
    }
});

function buildAvlTree(){
    let salesTree = new AVL(globalSalesComparison)
    let criticTree = new AVL(criticScoreComparison)
    let userTree = new AVL(userScoreComparison)
    const listOfAvlTrees = [salesTree, criticTree, userTree];
    fetch('data.json')
        .then(response => {
            if(!response.ok){
                throw new Error("Issue creating avl trees in front end")
            }
            return response.json();
        })
        .then(data => {
            for(let i = 0; i < data.length; i++){
                salesTree.root = salesTree.insertNode(this.root,game)
                criticTree.root = criticTree.insertNode(this.root,game)
                userTree.root = userTree.insertNode(this.root,game)
            }
        })
}


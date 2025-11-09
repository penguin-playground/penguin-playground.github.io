//HEADER SECTION
class Node {
    constructor(game) {
        this.game = game;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}


//Comparing global sales (helper function)
function globalSalesComparison(a, b) {
    //Handles cells with missing/non-numerical data
    if(a.Global_Sales == "N/A" || a.Global_Sales =="tbd"){
        return -1;
    }
    if(b.Global_Sales == "N/A" || b.Global_Sales =="tbd"){
        return 1;
    }
    const salesA = Number(a.Global_Sales);
    const salesB = Number(b.Global_Sales);
    if (salesA < salesB) return -1;
    if (salesA > salesB) return 1;
    //Check names if first attributes are equal
    const nameA = a.Name.toLowerCase();
    const nameB = b.Name.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    //Return 0 if completely equal
    return 0;
}
//Comparing critic scores (helper function)
function criticScoreComparison(a, b) {
    //Handles cells with missing/non-numerical data
    if(a.Critic_Score == "N/A" || a.Critic_Score =="tbd"){
        return -1;
    }
    if(b.Critic_Score == "N/A" || b.Critic_Score =="tbd"){
        return 1;
    }
    const criticScoreA = Number(a.Critic_Score);
    const criticScoreB = Number(b.Critic_Score);
    if (criticScoreA < criticScoreB) return -1;
    if (criticScoreA > criticScoreB) return 1;
    //Check names if first attributes are equal
    const nameA = a.Name.toLowerCase();
    const nameB = b.Name.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    //Return 0 if completely equal
    return 0;
}
//Comparing user scores (helper function)
function userScoreComparison(a, b) {
    //Handles cells with missing/non-numerical data
    if(a.User_Score == "N/A" || a.User_Score =="tbd"){
        return -1;
    }
    if(b.User_Score == "N/A" || b.User_Score =="tbd"){
        return 1;
    }
    const userScoreA = Number(a.User_Score);
    const userScoreB = Number(b.User_Score);
    if (userScoreA < userScoreB) return -1;
    if (userScoreA > userScoreB) return 1;
    //Check names if first attributes are equal
    const nameA = a.Name.toLowerCase();
    const nameB = b.Name.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    //Return 0 if completely equal
    return 0;
}
//SOURCE SECTION
class AVL {
    //Constructor
    constructor(comparisonFunction) {
        this.root = null;
        this.comparisonFunction = comparisonFunction;
    }
    
    //Inserting node to BST
    insertNode(root, game) {
        if (root === null) return new Node(game);
        // Standard insertion with call to helper function
        const cmp = this.comparisonFunction(game, root.game);
        if (cmp < 0) {
            root.left = this.insertNode(root.left, game);
        } else {
            root.right = this.insertNode(root.right, game);
        }
        // Update height
        root.height = 1 + Math.max(this.getHeight(root.left), this.getHeight(root.right));
        // Get balance factor
        let balance = this.getBalanceFactor(root);
        // All rotation cases
        // LL Case
        if (balance > 1 && this.comparisonFunction(game, root.left.game) < 0) {
            return this.rotateRight(root);
        }
        // RR Case
        if (balance < -1 && this.comparisonFunction(game, root.right.game) > 0) {
            return this.rotateLeft(root);
        }
        // LR Case
        if (balance > 1 && this.comparisonFunction(game, root.left.game) > 0) {
            root.left = this.rotateLeft(root.left);
            return this.rotateRight(root);
        }
        // RL Case
        if (balance < -1 && this.comparisonFunction(game, root.right.game) < 0) {
            root.right = this.rotateRight(root.right);
            return this.rotateLeft(root);
        }
        return root;
    }

    //Returns height of tree
    getHeight(node) {
        return node ? node.height : 0;
    }

    //Returns balance factor of tree
    getBalanceFactor(node) {
        if (!node) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    //Rotate right function called when inserting node
    rotateRight(node) {
        let temp = node.left;
        node.left = temp.right;
        temp.right = node;

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        temp.height = 1 + Math.max(this.getHeight(temp.left), this.getHeight(temp.right));

        return temp;
    }

    //Rotate left function called when inserting node
    rotateLeft(node) {
        let temp = node.right;
        node.right = temp.left;
        temp.left = node;

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        temp.height = 1 + Math.max(this.getHeight(temp.left), this.getHeight(temp.right));

        return temp;
    }

    //Filters the games displayed based on user's selection
    filterGame(game, filters) {
        if (!filters || Object.keys(filters).length === 0) return true;
        //Loops through every filter key
        for (let key in filters) {
            if (Array.isArray(filters[key])) {
                //Checks if any filtered values match the game's values for given key
                if (!filters[key].some(f => String(game[key]).toLowerCase().includes(String(f).toLowerCase()))) return false;
            } else {
                //Does same check but for non-array filter values
                if (!String(game[key]).toLowerCase().includes(String(filters[key]).toLowerCase())) return false;
            }
        }
        return true;
    }

    //Used for InorderSearch to traverse recursively
    inorderHelper(node, outputV, filters, count) {
        if (!node) return;
        this.inorderHelper(node.right, outputV, filters, count);
        count.nodesPassed++;
        if (this.filterGame(node.game, filters)) {
            //Creates copy of current node's game object w/ how many nodes visited to append object to array
            outputV.push({...node.game, nodesPassed: count.nodesPassed});
        }
        this.inorderHelper(node.left, outputV, filters, count);
    }

    //Inorder search that primarily calls helper functions
    InorderSearch(filters = {}) {
        //Initializes array of game objects
        let outputV = [];
        //Initializes count object with nodesPassed property
        let count = {nodesPassed: 0};
        this.inorderHelper(this.root, outputV, filters, count);
        return outputV;
    }

    //BFS search using queue to traverse
    BFS(filters){
        if (!this.root) {
            return []
        }
        let queue = [];
        queue.push(this.root);
        let outputArr = [];
        let nodesPassed = 0;
        while(queue.length > 0){
            let currentNode = queue.shift()
            nodesPassed++;
            if(this.filterGame(currentNode.game, filters)){ //check if the current game object matches the filters
                //Pushes copy of current node's game object w/ nodesPassed count
                outputArr.push({...currentNode.game, nodesPassed})
            }
            if(currentNode.left){
                queue.push(currentNode.left)
            }
            if(currentNode.right){
                queue.push(currentNode.right)
            }
        }
        return outputArr //return an array of game objects that match the given filter
    }

    //Destructor helper function (optional in JS)
    deleteTree(node) {
        if (!node) return;
        this.deleteTree(node.left);
        this.deleteTree(node.right);
        node.left = null;
        node.right = null;
    }

    //Destructor (optional in JS)
    destructor() {
        this.deleteTree(this.root);
        this.root = null;
    }
}

window.AVL = AVL;
window.globalSalesComparison = globalSalesComparison;
window.criticScoreComparison = criticScoreComparison;
window.userScoreComparison = userScoreComparison;

/*
module.exports = {
    AVL,
    globalSalesComparison,
    criticScoreComparison,
    userScoreComparison
}*/
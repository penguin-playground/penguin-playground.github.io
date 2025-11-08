//HEADER SECTION
class Node {
    constructor(game) {
        this.game = game;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}


//Comparing games helper function
function globalSalesComparison(a, b) {
    if(a.Global_Sales == "Not Specified" || a.Global_Sales =="tbd"){
        return -1;
    }
    if(b.Global_Sales == "Not Specified" || b.Global_Sales =="tbd"){
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
function criticScoreComparison(a, b) {
    if(a.Critic_Score == "Not Specified" || a.Critic_Score =="tbd"){
        return -1;
    }
    if(b.Critic_Score == "Not Specified" || b.Critic_Score =="tbd"){
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
function userScoreComparison(a, b) {
    if(a.User_Score == "Not Specified" || a.User_Score =="tbd"){
        return -1;
    }
    if(b.User_Score == "Not Specified" || b.User_Score =="tbd"){
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
    
    //Inserting node to BST (no checks besides balancing)
    insertNode(root, game) {
        if (root === null) return new Node(game);
        //Standard insertion with call to helper function
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
        //All rotation cases
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

    //Recursive helper function performing a depth-first search
    searchNameHelper(node, name) {
        if (!node) return false;

        let foundCurr = false;
        if (node.game.Name === name) {
            console.log(node.game.Name);
            foundCurr = true;
        }

        return foundCurr || this.searchNameHelper(node.left, name) || this.searchNameHelper(node.right, name);
    }

    //Mainly used to call helper function above
    searchByName(name) {
        if (!this.root || !this.searchNameHelper(this.root, name)) {
            console.log("unsuccessful");
            return false;
        }
        return true;
    }

    //Filters the games displayed based on user's selection
    filterGame(game, filters) {
        if (!filters || Object.keys(filters).length === 0) return true;
        for (let key in filters) {
            if (Array.isArray(filters[key])) {
                if (!filters[key].some(f => String(game[key]).toLowerCase().includes(String(f).toLowerCase()))) return false;
            } else {
                if (!String(game[key]).toLowerCase().includes(String(filters[key]).toLowerCase())) return false;
            }
        }
        return true;
    }

    //Used for printInorder to traverse recursively with node and output parameter
    inorderHelper(node, outputV, filters, count) {
        if (!node) return;
        this.inorderHelper(node.right, outputV, filters, count);
        count.nodesPassed++;
        if (this.filterGame(node.game, filters)) {
            outputV.push({...node.game, nodesPassed: count.nodesPassed});
        }
        this.inorderHelper(node.left, outputV, filters, count);
    }

    //Inorder search that primarily calls helper function
    InorderSearch(filters = {}) {
        let outputV = [];
        let count = {nodesPassed: 0};
        this.inorderHelper(this.root, outputV, filters, count);
        return outputV;
    }

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


    
    //COULD USE POSTORDER AND PREORDER LATER BUT IS COMMENTED OUT FOR NOW
    // //Used for printPreorder to traverse recursively with node and output parameter
    // preorderHelper(node, outputV) {
    //     if (!node) return;
    //     outputV.push(node.student.name);
    //     this.preorderHelper(node.left, outputV);
    //     this.preorderHelper(node.right, outputV);
    // }

    // //Primarily calls helper function
    // printPreorder() {
    //     let outputV = [];
    //     this.preorderHelper(this.root, outputV);
    //     console.log(outputV.join(", "));
    //     return outputV;
    // }

    // //Used for printPostorder to traverse recursively with node and output parameter
    // postorderHelper(node, outputV) {
    //     if (!node) return;
    //     this.postorderHelper(node.left, outputV);
    //     this.postorderHelper(node.right, outputV);
    //     outputV.push(node.student.name);
    // }

    // //Primarily calls helper function
    // printPostorder() {
    //     let outputV = [];
    //     this.postorderHelper(this.root, outputV);
    //     console.log(outputV.join(", "));
    //     return outputV;
    // }

    //Work already done for this function via getHeight function
    printLevelCount() {
        if (!this.root) {
            console.log(0);
            return 0;
        } else {
            console.log(this.getHeight(this.root));
            return this.getHeight(this.root);
        }
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
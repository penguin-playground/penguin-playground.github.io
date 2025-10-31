//HEADER SECTION
class Student {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}

class Node {
    constructor(student) {
        this.student = student;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

//SOURCE SECTION
class AVL {
    constructor() {
        this.root = null;
    }
    //Inserting node to BST (no checks besides balancing)
    insertNode(root, student) {
        //Standard tree insertion
        if (root === null) {
            return new Node(student);
        }
        if (student.id < root.student.id) {
            root.left = this.insertNode(root.left, student);
        } else if (student.id > root.student.id) {
            root.right = this.insertNode(root.right, student);
        } else {
            return root;
        }

        root.height = 1 + Math.max(this.getHeight(root.left), this.getHeight(root.right));

        //Balancing tree
        let balance = this.getBalanceFactor(root);

        // LL Case
        if (balance > 1 && student.id < root.left.student.id) {
            return this.rotateRight(root);
        }
        // RR Case
        if (balance < -1 && student.id > root.right.student.id) {
            return this.rotateLeft(root);
        }
        // LR Case
        if (balance > 1 && student.id > root.left.student.id) {
            root.left = this.rotateLeft(root.left);
            return this.rotateRight(root);
        }
        // RL Case
        if (balance < -1 && student.id < root.right.student.id) {
            root.right = this.rotateRight(root.right);
            return this.rotateLeft(root);
        }

        return root;
    }

    //Removing node from BST
    removeNode(root, id) {
        if (root === null) return root;

        if (root.student.id < id) {
            root.right = this.removeNode(root.right, id);
        } else if (root.student.id > id) {
            root.left = this.removeNode(root.left, id);
        } else {
            //If node has no left child or no children at all
            if (root.left === null) return root.right;
            //If node has no right child
            if (root.right === null) return root.left;

            //If node has left & right child
            let next = root.right;
            while (next.left !== null) next = next.left;

            root.student = next.student;
            root.right = this.removeNode(root.right, next.student.id);
        }

        root.height = 1 + Math.max(this.getHeight(root.left), this.getHeight(root.right));
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

    //Inserting student into tree (with several checks except balancing)
    insert(name, idStr) {
        //Checking if ID length is 8
        if (idStr.length !== 8) {
            console.log("unsuccessful");
            return false;
        }

        //Checking if name is empty
        if (!name) {
            console.log("unsuccessful");
            return false;
        }
        
        //VERY DIFFERENT FROM C++ (MAYBE ERRORS?) (DELETE COMMENT LATER)
        //Checking if name only has letters and spaces
        for (let c of name) {
            if (!(/[a-zA-Z\s]/.test(c))) {
                console.log("unsuccessful");
                return false;
            }
        }
        let id = parseInt(idStr);

        //Checking for dupes
        let temp = this.root;
        while (temp) {
            if (id === temp.student.id) {
                console.log("unsuccessful");
                return false;
            }
            temp = id < temp.student.id ? temp.left : temp.right;
        }

        let s = new Student(name, id);
        this.root = this.insertNode(this.root, s);
        console.log("successful");
        return true;
    }
    //END OF DIFFERENT SECTION (DELETE COMMENT LATER)

    //Checks if ID exists in tree (used for remove function, not search)
    searchIDHelper(id) {
        let temp = this.root;
        while (temp) {
            if (temp.student.id === id) return true;
            temp = id < temp.student.id ? temp.left : temp.right;
        }
        return false;
    }

    //Mainly used to call helper function above
    remove(id) {
        if (this.searchIDHelper(id)) {
            this.root = this.removeNode(this.root, id);
            console.log("successful");
            return true;
        }
        console.log("unsuccessful");
        return false;
    }

    //Performs a binary search to find correct id, if it exists
    search(id) {
        let temp = this.root;
        while (temp) {
            if (temp.student.id === id) {
                console.log(temp.student.name);
                return true;
            }
            temp = id < temp.student.id ? temp.left : temp.right;
        }
        console.log("unsuccessful");
        return false;
    }

    //Recursive helper function performing a depth-first search
    searchNameHelper(node, name) {
        if (!node) return false;

        let foundCurr = false;
        if (node.student.name === name) {
            console.log(node.student.id);
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

    //Used for printInorder to traverse recursively with node and output parameter
    inorderHelper(node, outputV) {
        if (!node) return;
        this.inorderHelper(node.left, outputV);
        outputV.push(node.student.name);
        this.inorderHelper(node.right, outputV);
    }

    //Primarily calls helper function
    printInorder() {
        let outputV = [];
        this.inorderHelper(this.root, outputV);
        console.log(outputV.join(", "));
        return outputV;
    }

    //Used for printPreorder to traverse recursively with node and output parameter
    preorderHelper(node, outputV) {
        if (!node) return;
        outputV.push(node.student.name);
        this.preorderHelper(node.left, outputV);
        this.preorderHelper(node.right, outputV);
    }

    //Primarily calls helper function
    printPreorder() {
        let outputV = [];
        this.preorderHelper(this.root, outputV);
        console.log(outputV.join(", "));
        return outputV;
    }

    //Used for printPostorder to traverse recursively with node and output parameter
    postorderHelper(node, outputV) {
        if (!node) return;
        this.postorderHelper(node.left, outputV);
        this.postorderHelper(node.right, outputV);
        outputV.push(node.student.name);
    }

    //Primarily calls helper function
    printPostorder() {
        let outputV = [];
        this.postorderHelper(this.root, outputV);
        console.log(outputV.join(", "));
        return outputV;
    }

    //Work already done for this function via private getHeight function
    printLevelCount() {
        if (!this.root) {
            console.log(0);
            return 0;
        } else {
            console.log(this.getHeight(this.root));
            return this.getHeight(this.root);
        }
    }

    //Performs inorder traversal recursively
    removeInorderHelper(node, ids) {
        if (!node) return;
        this.removeInorderHelper(node.left, ids);
        ids.push(node.student.id);
        this.removeInorderHelper(node.right, ids);
    }

    //Uses sorted list (via inorder traversal of helper function) of student ID's to remove Nth one
    removeInorder(N) {
        if (!this.root) {
            console.log("unsuccessful");
            return false;
        }
        let ids = [];
        this.removeInorderHelper(this.root, ids);
        if (N < 0 || N >= ids.length) {
            console.log("unsuccessful");
            return false;
        }
        this.remove(ids[N]);
        return true;
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
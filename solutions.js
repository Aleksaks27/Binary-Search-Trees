class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(arr) {
        // Save the original array of elements for use in later methods. Using the sorting
        // algorithm and set notation, order elements and remove duplicates.
        this.arr = this.mergeSort(Array.from(new Set(arr)));
        this.root = this.buildTree(this.arr);
        
    }

    // Sorting algorithm written during an earlier task
    mergeSort(arr) {
    if (arr.length === 1) return arr;
    let h1 = this.mergeSort(arr.slice(0, arr.length / 2)); 
    let h2 = this.mergeSort(arr.slice(arr.length / 2, arr.length));
    let output = [];
    for (let i = 0; i < (2 * arr.length); i++) {
        if (h1[0] < h2[0] || h2.length === 0) {
            output.push(h1[0]);
            h1.shift();
        }
        else {
            output.push(h2[0]);
            h2.shift();
        }
        i++;
    }
    return output;
}

    // Recursively build the balanced binary tree by splitting array into sub-arrays
    buildTree(arr) {
        if (arr.length === 0) return null;
        let midpoint = Math.floor(arr.length / 2);
        let child = new Node(arr[midpoint]);
        child.left = this.buildTree(arr.slice(0, midpoint));
        child.right = this.buildTree(arr.slice(midpoint + 1, arr.length));
        return child;
    }

    // A printing function, provided in the task instructions
    printTree(node, prefix = "", isLeft = true) {
        if (node === null) {
          return;
        }
        if (node.right !== null) {
          this.printTree(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
        if (node.left !== null) {
          this.printTree(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    }

    // Start from root node. Depending on values of subsequent branches, navigate to the
    // correct position by comparing values to num and then insert a new node.
    insert(num) {        
        let current = this.root;
        while (current.left || current.right) {
            if (num < current.value && current.left) current = current.left;
            else if (num > current.value && current.right) current = current.right;
            else break;
        }
        if (num > current.value) current.right = new Node(num);
        else current.left = new Node(num);

        this.arr.push(num);
        this.arr = this.mergeSort(this.arr);
    }

    // Navigate the tree until you find a child node with a value of num. Set this to null.
    delete(num) {
        if (num === this.root.value) {
            this.root = null;
            return;
        }
        let current = this.root;
        while (current.left.value !== num && current.right.value !== num) {
            if (num < current.value) current = current.left;
            else current = current.right;
        }
        if (current.left.value === num) current.left = null;
        else if (current.right.value === num) current.right = null;

        // Update the original array by deleting the relevant number and its children
        for (let i = 0; i < this.arr.length; i++) {
            if (!this.find(this.arr[i])) {
                this.arr.splice(i, 1);
                i--;
            }
        }
    }

    // Navigate the tree by comparing node values to num. If num is not present, return null
    find(num) {
        let current = this.root;
        while (current && current.value !== num) {
            if (num < current.value) current = current.left;
            else current = current.right;
        }
        return current;
    }

    // Breadth-first traversal. At each level of the tree, push the node into the queue. 
    // If a callback is passed, apply that function to the node's value, otherwise print
    // the value. Then add the node's children to the queue and repeat the process.
    levelOrder(callback) {
        let queue = [];
        queue.push(this.root);
        for (let item of queue) {
            if (callback) callback(item.value);
            else console.log(item.value);

            if (item.left) queue.push(item.left);
            if (item.right) queue.push(item.right);
        }
    }

    // Depth-first tree traversals. Callback is optional.
    inOrder(node, callback) {
        if (node === null) return;

        if (node.left) this.inOrder(node.left, callback);

        if (callback) callback(node.value);
        else console.log(node.value);

        if (node.right) this.inOrder(node.right, callback);
    }

    preOrder(node, callback) {
        if (node === null) return;

        if (callback) callback(node.value);
        else console.log(node.value);

        if (node.left) this.preOrder(node.left, callback);
        if (node.right) this.preOrder(node.right, callback);
    }

    postOrder(node, callback) {
        if (node === null) return;

        if (node.left) this.postOrder(node.left);
        if (node.right) this.postOrder(node.right);

        if (callback) callback(node.value);
        else console.log(node.value);
    }

    // This calculates the distance from the root node to a node with the given value;
    height(num) {
        let count = 0;
        let current = this.root;

        while (current.value !== num) {
            if (num < current.value) current = current.left;
            else current = current.right;
        }

        while (current) {
            if (current.left) {
                current = current.left;
                count++;
            }
            else {
                current = current.right;
                if(current) count++
            }
        }
        return count;
    }

    // This calculates the distance from a node with a given value to the root node
    depth(num) {
        let count = 0;
        let current = this.root;
        while (current.value !== num) {
            if (num < current.value) {
                current = current.left;
                count++;
            }
            else {
                current = current.right;
                count++
            }
        }
        return count;
    }

    // This checks whether the depths of left and right sub-trees differ by more than 1 level. Note
    // that no matter which elements are added to this.arr, isBalanced() always considers the
    // original node to be the midpoint.
    isBalanced() {
        let midpoint = this.root.value;
        let left = this.arr.slice(0, midpoint);
        let right = this.arr.slice(midpoint + 1, this.arr.length);
        let leftDepth = [];
        let rightDepth = [];

        for (let num of left) {
            leftDepth.push(this.depth(num));
        }
        for (let num of right) {
            rightDepth.push(this.depth(num));
        }

        return Math.abs(Math.max(...leftDepth) - Math.max(...rightDepth)) <= 1;
    }

    // Based on the updated array of elements, this will rebalance the tree by setting 
    // a new root node.
    rebalance() {
        this.root = this.buildTree(this.arr);
        this.printTree(this.root);
    }
}
import _ from "lodash"; // this can be optimized import

const Node = (key) => ({
  key: key,
  left: null,
  right: null
});

/** isLeafNode check Start*/
const isLeafNode = (node) => !node || (!node.left && !node.right);
/** End */

/** Insertion Start */
const insertNode = (node, key) => {
  if (node == null) return;

  // can have compareFn here, to make generic
  if (key < node.key) {
    if (!node.left) {
      node.left = new Node(key);
    } else {
      insertNode(node.left, key);
    }
  } else {
    if (!node.right) {
      node.right = new Node(key);
    } else {
      insertNode(node.right, key);
    }
  }
};
/** End */

/** In-Order Traversal Start */
const traverseNode = (node, callbk) => {
  if (!node) return;

  traverseNode(node.left, callbk);

  callbk(node.key);

  traverseNode(node.right, callbk);
};

/** End */

/** Min/Max tree nodes Start */
const minNode = (node) => {
  if (node.left) return minNode(node.left);
  return node;
};

const maxNode = (node) => {
  if (node.right) return maxNode(node.right);
  return node;
};
/** End */

/** Search Start */
const searchNode = (node, key) => {
  if (!node) return null;

  // compare funcs can be parameterzied to make this generic
  if (key === node.key) {
    return node;
  }

  return searchNode(key < node.key ? node.left : node.right, key);
};
/** End */

/** Remove node Start */
const removeNode = (node, key) => {
  if (!node) return null;

  if (key < node.key) {
    node.left = removeNode(node.left, key);
    return node;
  } else if (key > node.key) {
    node.right = removeNode(node.right, key);
    return node;
  } else {
    // key eqals node.key; thus, we now will start removing this node

    // if is leaf node
    if (isLeafNode(node)) {
      node = null;
      return node;
    }

    // if has onle one child, then simply swap and delete
    if (!node.left) {
      node = node.right;
      return node;
    } else if (!node.right) {
      node = node.left;
      return node;
    }

    // if has both children
    const minSuccessor = minNode(node.right);
    node.key = minSuccessor.key;
    node.right = removeNode(node.right, minSuccessor.key);
    return node;
  }
};
/** End */

/** Depth of a node Start */
const nodeDepth = (node, key) => {
  if (!node || key === node.key) {
    return {
      found: !!node && key === node.key,
      depth: 0
    };
  }

  const { found, depth } = nodeDepth(
    key < node.key ? node.left : node.right,
    key
  );

  return { found: found, depth: 1 + depth };
};
/** End */

/** Height of a Tree Start (max depth of any node in tree ) */
const nodeHeight = (node) => {
  if (!node) return 0;

  return 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right));
};
/** End */

const BinarySearchTree = (key) => {
  let root = key ? new Node(key) : null;

  const insert = (key) => {
    if (!root) {
      root = new Node(key);
      instance.root = root;
      return instance;
    }
    insertNode(root, key);
  };

  //in-order traversal (minor updates to change to pre or post order)
  const traverse = (callbk = (key) => console.log(key)) => {
    if (!root) return;
    traverseNode(root, callbk);
  };

  const min = () => {
    if (!root) return null;
    return minNode(root);
  };

  const max = () => {
    if (!root) return null;
    return maxNode(root);
  };

  const search = (key) => {
    if (!root) return null;
    return searchNode(root, key);
  };

  const isLeaf = (key) => {
    if (!root) return true;
    const node = search(key);
    return isLeafNode(node);
  };

  const remove = (key) => {
    root = removeNode(root, key);
    instance.root = root;
    return instance;
  };

  const depth = (key) => {
    if (!root || _.isUndefined(key) || root.key === key) return 0;
    const { found, depth } = nodeDepth(root, key);
    if (found) return depth;
    return 0;
  };

  const height = () => {
    return nodeHeight(root);
  };

  let instance = {
    root,
    isLeaf,
    insert,
    traverse,
    min,
    max,
    search,
    remove,
    depth,
    height
  };

  return instance;
};

function test() {
  const myTree = new BinarySearchTree();

  console.log("inserting to tree ", myTree.root);

  const toInsert = [8, 4, 10, 2, 6, 1, 3, 5, 7, 9, 11];

  _.forEach(toInsert, (elem) => {
    myTree.insert(elem);
  });

  console.log("traversing in-order in tree ", myTree.root);

  const sortedTreekeys = [];
  myTree.traverse((key) => {
    sortedTreekeys.push(key);
  });

  console.log("Sorted Tree keys: ", sortedTreekeys);

  console.log("minTreeNode is:", myTree.min());

  console.log("maxTreeNode is:", myTree.max());

  console.log("Tree node search result:", myTree.search(6));

  console.log("final tree: ", myTree.root);

  console.log("isLeaf", myTree.isLeaf(1));

  console.log("depth of node:", myTree.depth(1));

  console.log("height of tree:", myTree.height());

  myTree.remove(4);

  console.log("post removal final tree: ", myTree.root);
}

test();

const fs = require('fs');
const path = require('path');

const getPathNode = ({pathStr, relativePathStr, pathToNode}) => {
    if (!fs.existsSync(pathStr)) {
        return;
    }

    const pathArr = pathStr.split(/(\\|\/)/);
    const name = pathArr.pop();
    pathArr.pop();
    const parent = pathArr.join('');

    const val = {
        parent,
        path: pathStr,
        relativePath: relativePathStr,
        name,
        type: 'directory',
        pathToNode
    }

    const stat = fs.statSync(pathStr);
    if (!stat.isDirectory()) {
        val.type = 'file';
        return new Node(val, []);
    }

    let subPathObjs = fs.readdirSync(pathStr).map((subPath, index) => ({
        pathStr: path.join(pathStr, subPath),
        relativePathStr: path.join(relativePathStr, subPath),
        pathToNode: `${pathToNode}.children[${index}]`
    }));

    return new Node(val, subPathObjs);
}

function Node(val,children) {
  this.val = val;
  this.children = children;
};

// 2. 层序（文件&文件夹）数组
var levelOrderDir = function(rootPath) {
    if (!rootPath) { return []; }
    let res = [], queue = [{pathStr: rootPath, index: 0, pathToNode: 'root', relativePathStr: ''}], curr;
    while(queue.length > 0) {
        let level = [], levellen = queue.length;
        for (let i=0; i< levellen; i++) {
            curr = getPathNode(queue.shift());
            queue.push(...curr.children);
            level.push(curr.val);
        }
        res.push(level);
    }
    return res;
};

var dirTreeIter = function(pathObj) {
    if (!pathObj.pathStr) { return {}; }
    const root = getPathNode(pathObj);

    return {
        ...root.val,
        children: root.children.map((pathObj)=> dirTreeIter(pathObj))
    };
};

// 3.树形结构(文件&文件夹)
const dirTree = function(rootPath) {
    return dirTreeIter({pathStr: rootPath, index: 0, pathToNode: 'root', relativePathStr: ''})
}

module.exports = {
    levelOrderDir,
    dirTree
}
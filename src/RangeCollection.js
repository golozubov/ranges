import { InvalidRangeError } from './InvalidRangeError';

// Task: Implement a 'Range Collection' class.
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

class RangeTreeNode {
    constructor(lowerBound, upperBound) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.left = null;
        this.right = null;
    }

    isLeaf() {
        return !this.left && !this.right;
    }

    rangeFitInto(range) {
        return this.lowerBound <= range[0] && range[1] <= this.upperBound;
    }

    fitIntoRange(range) {
        return range[0] <= this.lowerBound && this.upperBound <= range[1];
    }

    pointIsInClosedInterval(x) {
        return this.lowerBound <= x && x <= this.upperBound;
    }

    addRangeToLeaf(range) {
        if (this.rangeFitInto(range)) {
            return this;
        }

        if (this.fitIntoRange(range)) {
            [this.lowerBound, this.upperBound] = range;
            return this;
        }

        if (this.pointIsInClosedInterval(range[0]) || this.pointIsInClosedInterval(range[1])) {
            this.lowerBound = Math.min(this.lowerBound, range[0]);
            this.upperBound = Math.max(this.upperBound, range[1]);
            return this;
        }

        const newNode = new RangeTreeNode(Math.min(this.lowerBound, range[0]), Math.max(this.upperBound, range[1]));

        if (this.lowerBound < range[0]) {
            newNode.left = this;
            newNode.right = new RangeTreeNode(range[0], range[1]);
        } else {
            newNode.left = new RangeTreeNode(range[0], range[1]);
            newNode.right = this;
        }

        return newNode;
    }

    removeRangeFromLeaf(range) {
        if (this.lowerBound >= range[1] || this.upperBound <= range[0]) {
            return this;
        }

        if (this.fitIntoRange(range)) {
            return null;
        }

        if (this.lowerBound < range[0] && this.upperBound > range[1]) {
            this.left = new RangeTreeNode(this.lowerBound, range[0]);
            this.right = new RangeTreeNode(range[1], this.upperBound);
            return this;
        }

        if (this.upperBound > range[1]) {
            [, this.lowerBound] = range;
            return this;
        }

        [this.upperBound] = range;
        return this;
    }

    toString() {
        return `[${this.lowerBound}; ${this.upperBound})`;
    }
}

/**
 * RangeCollection class
 * NOTE: Feel free to add any extra member variables/functions you like.
 */
export class RangeCollection {
    constructor() {
        this.tree = null;
    }

    /**
     * Adds a range to the collection
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    add(range) {
        this._checkRange(range);

        if (this._isTrivial(range)) {
            return;
        }

        if (!this.tree) {
            this.tree = new RangeTreeNode(range[0], range[1]);
            return;
        }

        this.tree = this._addRecursive(this.tree, range);
    }

    /**
     * Removes a range from the collection
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    remove(range) {
        this._checkRange(range);

        if (this._isTrivial(range)) {
            return;
        }

        if (!this.tree) {
            return;
        }

        this.tree = this._removeRecursive(this.tree, range);
    }

    /**
     * Prints out the list of ranges in the range collection
     */
    print() {
        if (!this.tree) {
            return '';
        }

        return this._printRecursive(this.tree);
    }

    ///////////////////////////////////////////////////////////////////////////

    _removeRecursive(node, range) {
        if (node.isLeaf()) {
            return node.removeRangeFromLeaf(range);
        }

        if (node.lowerBound >= range[1] || node.upperBound <= range[0]) {
            return node;
        }

        if (node.left && range[0] <= node.left.upperBound) {
            node.left = this._removeRecursive(node.left, range);
        }

        if (node.right && range[1] >= node.right.lowerBound) {
            node.right = this._removeRecursive(node.right, range);
        }

        if (!node.left && !node.right) {
            return null;
        }

        if (!node.left) {
            return node.right;
        }

        if (!node.right) {
            return node.left;
        }

        node.lowerBound = node.left.lowerBound;
        node.upperBound = node.right.upperBound;

        return node;
    }

    _printRecursive(node) {
        if (node.isLeaf()) {
            return node.toString();
        }

        let output = '';

        if (node.left) {
            output = this._printRecursive(node.left);
        }

        if (node.right) {
            output = `${output} ${this._printRecursive(node.right)}`;
        }

        return output;
    }

    _addRecursive(node, range) {
        if (node.isLeaf()) {
            return node.addRangeToLeaf(range);
        }

        if (node.left && range[0] <= node.left.upperBound) {
            node.left = this._addRecursive(node.left, range);
            node.lowerBound = node.left.lowerBound;
        } else {
            node.right = this._addRecursive(node.right, range);
            node.upperBound = node.right.upperBound;
        }

        if (node.left.upperBound >= node.right.lowerBound) {
            node.upperBound = Math.max(node.right.upperBound, node.left.upperBound);
            node.left = node.right = null;
        }

        return node;
    }

    _checkRange(range) {
        if (!range || !Array.isArray(range) || range.length !== 2) {
            throw new InvalidRangeError(`Provided range '${range}' is invalid. Valid range is an array of length 2.`);
        }

        if (range.map((v) => !Number.isInteger(v)).filter((v) => !!v).length) {
            throw new InvalidRangeError(`Provided range '${range}' is invalid. Valid range should contain only integer numbers.`);
        }

        if (range[0] > range[1]) {
            throw new InvalidRangeError(`Provided range '${range}' is invalid. Start of range should be less than or equal to finish.`);
        }
    }

    _isTrivial(range) {
        return range[0] === range[1];
    }
}

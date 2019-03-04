import { InvalidRangeError } from './InvalidRangeError';
import { RangeTreeNode } from './RangeTreeNode';


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

export class RangeTreeNode {
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

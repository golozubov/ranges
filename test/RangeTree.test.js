/* eslint-env node, mocha */
import { InvalidRangeError } from '../src/InvalidRangeError';
import { RangeCollection } from '../src/RangeCollection';


describe('RangeTree', () => {
    describe('Empty', () => {
        it('print() should return empty string', () => {
            const rc = new RangeCollection();
            const collection = rc.print();
            collection.should.eql('');
        });

        it('add(trivial range) should result to empty collection', () => {
            const rc = new RangeCollection();
            rc.add([1, 1]);
            const collection = rc.print();
            collection.should.eql('');
        });

        it('add(non-trivial range) should result to the range', () => {
            const rc = new RangeCollection();
            rc.add([1, 2]);
            const collection = rc.print();
            collection.should.eql('[1; 2)');
        });

        it('remove(trivial range) should result to empty collection', () => {
            const rc = new RangeCollection();
            rc.remove([1, 1]);
            const collection = rc.print();
            collection.should.eql('');
        });

        it('remove(non-trivial range) should result to empty collection', () => {
            const rc = new RangeCollection();
            rc.remove([1, 2]);
            const collection = rc.print();
            collection.should.eql('');
        });
    });

    describe('Empty after non-empty state', () => {
        let rc;
        beforeEach(() => {
            rc = new RangeCollection();
            rc.add([1, 4]);
            rc.remove([1, 4]);
        });

        it('print() should return empty string', () => {
            const collection = rc.print();
            collection.should.eql('');
        });

        it('add(trivial range) should result to empty collection', () => {
            rc.add([1, 1]);
            const collection = rc.print();
            collection.should.eql('');
        });

        it('add(non-trivial range) should result to the range', () => {
            rc.add([1, 2]);
            const collection = rc.print();
            collection.should.eql('[1; 2)');
        });

        it('remove(trivial range) should result to empty collection', () => {
            rc.remove([1, 1]);
            const collection = rc.print();
            collection.should.eql('');
        });

        it('remove(non-trivial range) should result to empty collection', () => {
            rc.remove([1, 2]);
            const collection = rc.print();
            collection.should.eql('');
        });
    });

    describe('One-level tree (leaf)', () => {
        it('print() should return range', () => {
            const rc = new RangeCollection();
            rc.add([1, 2]);
            const collection = rc.print();
            collection.should.eql('[1; 2)');
        });

        it('print() should return range even for big numbers', () => {
            const rc = new RangeCollection();
            rc.add([Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]);
            const collection = rc.print();
            collection.should.eql(`[${Number.MIN_SAFE_INTEGER}; ${Number.MAX_SAFE_INTEGER})`);
        });

        describe('add()', () => {
            let rc;
            beforeEach(() => {
                rc = new RangeCollection();
                rc.add([1, 4]);
            });

            it('add(trivial range) should not change tree', () => {
                rc.add([100, 100]);
                const collection = rc.print();
                collection.should.eql('[1; 4)');
            });

            it('add(equal range) should not change tree', () => {
                rc.add([1, 4]);
                const collection = rc.print();
                collection.should.eql('[1; 4)');
            });

            it('add(nested range) should not change tree', () => {
                rc.add([2, 3]);
                const collection = rc.print();
                collection.should.eql('[1; 4)');
            });

            it('add(enclosing range) should result to enclosing range', () => {
                rc.add([-10, 300]);
                let collection = rc.print();
                collection.should.eql('[-10; 300)');

                rc.add([-10, 3000]);
                collection = rc.print();
                collection.should.eql('[-10; 3000)');

                rc.add([-100, 3000]);
                collection = rc.print();
                collection.should.eql('[-100; 3000)');
            });

            it('add(right-adjacent range) should result to union of two ranges', () => {
                rc.add([4, 10]);
                const collection = rc.print();
                collection.should.eql('[1; 10)');
            });

            it('add(left-adjacent range) should result to union of two ranges', () => {
                rc.add([-10, 1]);
                const collection = rc.print();
                collection.should.eql('[-10; 4)');
            });

            it('add(right-overlapping range) should result to union of two ranges', () => {
                rc.add([2, 10]);
                const collection = rc.print();
                collection.should.eql('[1; 10)');
            });

            it('add(left-overlapping range) should result to union of two ranges', () => {
                rc.add([-10, 2]);
                const collection = rc.print();
                collection.should.eql('[-10; 4)');
            });

            it('add(isolated range to right) should result to collection of two ranges', () => {
                rc.add([10, 20]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20)');
            });

            it('add(isolated range to left) should result to collection of two ranges', () => {
                rc.add([-10, -5]);
                const collection = rc.print();
                collection.should.eql('[-10; -5) [1; 4)');
            });
        });

        describe('remove()', () => {
            let rc;
            beforeEach(() => {
                rc = new RangeCollection();
                rc.add([1, 4]);
            });

            it('remove(trivial range) should not change tree', () => {
                rc.remove([100, 100]);
                let collection = rc.print();
                collection.should.eql('[1; 4)');

                rc.remove([1, 1]);
                collection = rc.print();
                collection.should.eql('[1; 4)');

                rc.remove([2, 2]);
                collection = rc.print();
                collection.should.eql('[1; 4)');

                rc.remove([4, 4]);
                collection = rc.print();
                collection.should.eql('[1; 4)');
            });

            it('remove(equal range) should result to empty tree', () => {
                rc.remove([1, 4]);
                const collection = rc.print();
                collection.should.eql('');
            });

            it('remove(nested range) should result to collection of two ranges', () => {
                rc.remove([2, 3]);
                const collection = rc.print();
                collection.should.eql('[1; 2) [3; 4)');
            });

            it('remove(enclosing range) should result to empty tree', () => {
                rc.remove([-10, 300]);
                const collection = rc.print();
                collection.should.eql('');
            });

            it('remove(right-adjacent range) should not change tree', () => {
                rc.remove([4, 10]);
                const collection = rc.print();
                collection.should.eql('[1; 4)');
            });

            it('remove(left-adjacent range) should not change tree', () => {
                rc.remove([-10, 1]);
                const collection = rc.print();
                collection.should.eql('[1; 4)');
            });

            it('remove(right-overlapping range) should result to subtraction of second range from original', () => {
                rc.remove([2, 10]);
                const collection = rc.print();
                collection.should.eql('[1; 2)');
            });

            it('remove(left-overlapping range) should result to subtraction of second range from original', () => {
                rc.remove([-10, 2]);
                const collection = rc.print();
                collection.should.eql('[2; 4)');
            });

            it('remove(isolated range from right) should not change tree', () => {
                rc.remove([10, 20]);
                const collection = rc.print();
                collection.should.eql('[1; 4)');
            });

            it('remove(isolated range from left) should not change tree', () => {
                rc.remove([-10, -5]);
                const collection = rc.print();
                collection.should.eql('[1; 4)');
            });
        });
    });

    describe('Two-level tree', () => {
        it('print() should return range', () => {
            const rc = new RangeCollection();
            rc.add([1, 2]);
            rc.add([3, 4]);
            const collection = rc.print();
            collection.should.eql('[1; 2) [3; 4)');
        });

        it('print() should return range even for big numbers', () => {
            const rc = new RangeCollection();
            rc.add([Number.MIN_SAFE_INTEGER, 0]);
            rc.add([2, Number.MAX_SAFE_INTEGER]);
            const collection = rc.print();
            collection.should.eql(`[${Number.MIN_SAFE_INTEGER}; 0) [2; ${Number.MAX_SAFE_INTEGER})`);
        });

        describe('add()', () => {
            let rc;
            beforeEach(() => {
                rc = new RangeCollection();
                rc.add([1, 4]);
                rc.add([10, 20]);
            });

            it('add(trivial range) should not change tree', () => {
                rc.add([100, 100]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20)');
            });

            it('add(already present range) should not change tree', () => {
                rc.add([1, 4]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20)');
            });

            it('add(nested range) should not change tree', () => {
                rc.add([2, 3]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20)');
            });

            it('add(enclosing range) should result to enclosing range', () => {
                rc.add([-10, 300]);
                const collection = rc.print();
                collection.should.eql('[-10; 300)');
            });

            it('add(isolated range to right) should result to collection of three ranges', () => {
                rc.add([30, 40]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20) [30; 40)');
            });

            it('add(isolated range to left) should result to collection of three ranges', () => {
                rc.add([-10, -5]);
                const collection = rc.print();
                collection.should.eql('[-10; -5) [1; 4) [10; 20)');
            });

            it('add(right child overlapping range) should result to expansion of the second range', () => {
                rc.add([19, 40]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 40)');
            });

            it('add(left child overlapping range) should result to expansion of the first range', () => {
                rc.add([-10, 2]);
                const collection = rc.print();
                collection.should.eql('[-10; 4) [10; 20)');
            });

            it('add(right child-adjacent range) should result to expansion of the second range', () => {
                rc.add([20, 30]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 30)');
            });

            it('add(left child-adjacent range) should result to expansion of the first range', () => {
                rc.add([-10, 1]);
                const collection = rc.print();
                collection.should.eql('[-10; 4) [10; 20)');
            });

            it('add(left child right-overlapping range) should result to expansion of the left child range', () => {
                rc.add([2, 7]);
                const collection = rc.print();
                collection.should.eql('[1; 7) [10; 20)');
            });

            it('add(right child left-overlapping range) should result to expansion of the right child range', () => {
                rc.add([7, 15]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [7; 20)');
            });

            it('add(center-overlapping range - for both children) should result to union of ranges', () => {
                rc.add([2, 15]);
                const collection = rc.print();
                collection.should.eql('[1; 20)');
            });

            it('add(center-adjacent range) should result to union of ranges', () => {
                rc.add([4, 10]);
                const collection = rc.print();
                collection.should.eql('[1; 20)');
            });

            it('add(non-overlapping range to center) should result to collection of three ranges', () => {
                rc.add([6, 8]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [6; 8) [10; 20)');
            });
        });

        describe('remove()', () => {
            let rc;
            beforeEach(() => {
                rc = new RangeCollection();
                rc.add([1, 4]);
                rc.add([10, 20]);
            });

            it('remove(trivial range) should not change tree', () => {
                rc.remove([100, 100]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20)');
            });

            it('remove(already present range) should result to single range', () => {
                rc.remove([1, 4]);
                const collection = rc.print();
                collection.should.eql('[10; 20)');
            });

            it('remove(nested range from left child) should result to collection of three ranges', () => {
                rc.remove([2, 3]);
                const collection = rc.print();
                collection.should.eql('[1; 2) [3; 4) [10; 20)');
            });

            it('remove(nested range from right child) should result to collection of three ranges', () => {
                rc.remove([12, 16]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 12) [16; 20)');
            });

            it('remove(enclosing range) should result to empty tree', () => {
                rc.remove([-10, 300]);
                const collection = rc.print();
                collection.should.eql('');
            });

            it('remove(isolated range from right) should not change tree', () => {
                rc.remove([30, 40]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20)');
            });

            it('remove(isolated range from left) should not change tree', () => {
                rc.remove([-10, -5]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20)');
            });

            it('remove(right child overlapping range) should result to subtraction of range from right child range', () => {
                rc.remove([15, 40]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 15)');
            });

            it('remove(left child overlapping range) should result to subtraction of range from left child range', () => {
                rc.remove([-10, 2]);
                const collection = rc.print();
                collection.should.eql('[2; 4) [10; 20)');
            });

            it('remove(left child enclosing range) should result to single range', () => {
                rc.remove([0, 15]);
                const collection = rc.print();
                collection.should.eql('[15; 20)');
            });

            it('remove(right child enclosing range) should result to single range', () => {
                rc.remove([3, 50]);
                const collection = rc.print();
                collection.should.eql('[1; 3)');
            });

            it('remove(right child-adjacent range) should not change tree', () => {
                rc.remove([20, 30]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20)');
            });

            it('remove(left child-adjacent range) should not change tree', () => {
                rc.remove([-10, 1]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20)');
            });

            it('remove(left child right-overlapping range) should result to subtraction of range from left child range', () => {
                rc.remove([2, 7]);
                const collection = rc.print();
                collection.should.eql('[1; 2) [10; 20)');
            });

            it('remove(right child left-overlapping range) should result to subtraction of range from left child range', () => {
                rc.remove([7, 15]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [15; 20)');
            });

            it('remove(center-overlapping range - for both children) should result to difference of ranges', () => {
                rc.remove([2, 15]);
                const collection = rc.print();
                collection.should.eql('[1; 2) [15; 20)');
            });

            it('remove(center-adjacent range) should not change tree', () => {
                rc.remove([4, 10]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20)');
            });

            it('remove(non-overlapping range from center) should not change tree', () => {
                rc.remove([6, 8]);
                const collection = rc.print();
                collection.should.eql('[1; 4) [10; 20)');
            });
        });
    });

    describe('Range validation', () => {
        const invalidRangesChecker = (fn) => {
            it('null', () => {
                fn(null).should.throw(InvalidRangeError, /null/);
            });

            it('undefined', () => {
                fn(undefined).should.throw(InvalidRangeError, /undefined/);
            });

            it('number', () => {
                fn(42.5).should.throw(InvalidRangeError, /42.5/);
            });

            it('NaN', () => {
                fn(NaN).should.throw(InvalidRangeError, /NaN/);
            });

            it('string', () => {
                fn('test').should.throw(InvalidRangeError, /test/);
            });

            it('object', () => {
                fn({ a: 1 }).should.throw(InvalidRangeError, /\[object Object\]/);
            });

            it('function', () => {
                fn(() => 'test').should.throw(InvalidRangeError);
            });

            it('empty array', () => {
                fn([]).should.throw(InvalidRangeError);
            });

            it('array of length 1', () => {
                fn([1]).should.throw(InvalidRangeError);
            });

            it('array of length 3', () => {
                fn([1, 2, 3]).should.throw(InvalidRangeError);
            });

            it('array of length 2 containing null', () => {
                fn([null, 2]).should.throw(InvalidRangeError);
                fn([1, null]).should.throw(InvalidRangeError);
                fn([null, null]).should.throw(InvalidRangeError);
            });

            it('array of length 2 containing undefined', () => {
                fn([undefined, 2]).should.throw(InvalidRangeError);
                fn([1, undefined]).should.throw(InvalidRangeError);
                fn([undefined, undefined]).should.throw(InvalidRangeError);
            });

            it('array of length 2 containing float number', () => {
                fn([2.54, 33]).should.throw(InvalidRangeError);
                fn([1, 2.54]).should.throw(InvalidRangeError);
                fn([2.54, 5.54]).should.throw(InvalidRangeError);
            });

            it('array of length 2 containing NaN', () => {
                fn([NaN, 2]).should.throw(InvalidRangeError);
                fn([1, NaN]).should.throw(InvalidRangeError);
                fn([NaN, NaN]).should.throw(InvalidRangeError);
            });

            it('array of length 2 containing string', () => {
                fn(['test', 2]).should.throw(InvalidRangeError);
                fn(['test', 'test']).should.throw(InvalidRangeError);
                fn([1, 'test']).should.throw(InvalidRangeError);
            });

            it('array of length 2 containing object', () => {
                fn([{}, 2]).should.throw(InvalidRangeError);
                fn([{}, {}]).should.throw(InvalidRangeError);
                fn([1, {}]).should.throw(InvalidRangeError);
            });

            it('array of length 2 containing function', () => {
                fn([() => {}, 2]).should.throw(InvalidRangeError);
                fn([1, () => {}]).should.throw(InvalidRangeError);
                fn([() => {}, () => {}]).should.throw(InvalidRangeError);
            });

            it('array of length 2 containing empty array', () => {
                fn([[], 2]).should.throw(InvalidRangeError);
                fn([1, []]).should.throw(InvalidRangeError);
                fn([[], []]).should.throw(InvalidRangeError);
            });
        };

        let rc;
        beforeEach(() => {
            rc = new RangeCollection();
        });

        describe('add() should handle unexpected arguments', () => {
            const adder = (arg) => () => rc.add(arg);
            invalidRangesChecker(adder);
        });

        describe('remove() should handle unexpected arguments', () => {
            const remover = (arg) => () => rc.remove(arg);
            invalidRangesChecker(remover);
        });
    });
});

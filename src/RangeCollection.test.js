/* eslint-env node, mocha */
import { RangeCollection } from './RangeCollection';


describe('RangeCollection', () => {
    it('should pass initial tests', () => {
        // Example run
        const rc = new RangeCollection();

        rc.add([1, 5]);
        let collection = rc.print();
        // Should display: [1, 5)
        collection.should.eql('[1; 5)');

        rc.add([10, 20]);
        collection = rc.print();
        // Should display: [1, 5) [10, 20)
        collection.should.eql('[1; 5) [10; 20)');

        rc.add([20, 20]);
        collection = rc.print();
        // Should display: [1, 5) [10, 20)
        collection.should.eql('[1; 5) [10; 20)');

        rc.add([20, 21]);
        collection = rc.print();
        // Should display: [1, 5) [10, 21)
        collection.should.eql('[1; 5) [10; 21)');

        rc.add([2, 4]);
        collection = rc.print();
        // Should display: [1, 5) [10, 21)
        collection.should.eql('[1; 5) [10; 21)');

        rc.add([3, 8]);
        collection = rc.print();
        // Should display: [1, 8) [10, 21)
        collection.should.eql('[1; 8) [10; 21)');

        rc.remove([10, 10]);
        collection = rc.print();
        // Should display: [1, 8) [10, 21)
        collection.should.eql('[1; 8) [10; 21)');


        rc.remove([10, 11]);
        collection = rc.print();
        // Should display: [1, 8) [11, 21)
        collection.should.eql('[1; 8) [11; 21)');

        rc.remove([15, 17]);
        collection = rc.print();
        // Should display: [1, 8) [11, 15) [17, 21)
        collection.should.eql('[1; 8) [11; 15) [17; 21)');

        rc.remove([3, 19]);
        collection = rc.print();
        // Should display: [1, 3) [19, 21)
        collection.should.eql('[1; 3) [19; 21)');
    });
});

Range Collection
================

A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.

A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201).

RangeCollection class is a simple implementation of ranges storage. 

It's based on binary tree, where leaves store original ranges.

Usage
-----
```js
const rc = new RangeCollection();

rc.add([1, 5]);

rc.print();  // => '[1; 5)'

rc.remove([3, 4]);

rc.print();  // => '[1; 3) [4; 5)'
```

Installation
------------
You need Node.js v10.15.1 to run this. So the simplest way to install it is to use [nvm](https://github.com/creationix/nvm).
Run the next commands:
```
$ nvm use
$ npm ci
```

Testing
-------
```
$ npm test
```

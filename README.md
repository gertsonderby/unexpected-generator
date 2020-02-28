# unexpected-generator

[![Depfu](https://badges.depfu.com/badges/133b69aab4dac3cf2951bf2b6f76fb30/count.svg)](https://depfu.com/github/gertsonderby/unexpected-generator?project_id=8116)
[![Build Status](https://travis-ci.com/gertsonderby/unexpected-generator.svg?branch=master)](https://travis-ci.com/gertsonderby/unexpected-generator)

![http://www.shalominthewilderness.com/2013/07/horse-progress-days.html](https://i.imgur.com/7gSeZyn.jpg)

Plugin for unexpected providing support for generators and iterators. It adds a type for iterators. Generators are tested by testing the iterator resulting from calling them.

## Assertions

### `<iterator> [not] to be done`

Asserts that the iterator is done, and that no further calls to `next()` will yield. Negating it to assert that it does yield will cause the iterator to advance one step, but any value is discarded.

### `<iterator> to yield item <any>`

Asserts that the iterator yields, and that the value yielded matches the given item.

### `<iterator> to yield items <array>`

Asserts that the iterator yields enough times and the correct items to match the list of items given in the array. If it is done before yielding the expected amount of items, the assertion will fail.

### `<iterator> to be done with <any>`

Sends the given value to the iterator as a parameter of the `next()` call, and expects the iterator to be done at this point. If the iterator instead yields, the assertion fails.

### `<iterator> yielding with <any> <assertion?>`

Sends the given value to the iterator as a parameter of the `next()` call, and shifts the resulting value to the following assertion, if any. If the iterator is done, this assertion fails.

---

MIT Licensed, © 2017 Gert Sønderby

import unexpectedGenerator from './unexpectedGenerator';

function makeIterator(array) {
  var nextIndex = 0;

  return {
    next: function() {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { done: true };
    },
  };
}

function* argGenerator(max) {
  let count = 0;
  while (count < max) {
    // Increments counter with the number next() is called with
    count += yield count;
  }
  return;
}

function* accepterGenerator() {
  yield Promise.resolve();
}

describe('unexpected-generators plugin', () => {
  it('is an unexpected plugin', () => {
    return expect(unexpectedGenerator, 'to satisfy', {
      name: 'unexpected-generators',
      installInto: expect.it('to be a function'),
    });
  });

  describe('iterators', () => {
    let testExpect;
    let testIterator;
    beforeEach(() => {
      testExpect = expect.clone().use(unexpectedGenerator);
      testIterator = makeIterator(['this', 'is', 'a', 'test']);
    });

    it('<iterator> to yield item <any>', () =>
      expect(
        () => testExpect(testIterator, 'to yield item', 'this'),
        'not to error',
      ));

    it('<iterator> to yield item <any>, diff', () =>
      expect(
        () => testExpect(testIterator, 'to yield item', 'is'),
        'to error',
        "expected iterator to yield item 'is'\n\n-this\n+is",
      ));

    it('<iterator> to yield item <any>, iterator done', () => {
      testIterator.next();
      testIterator.next();
      testIterator.next();
      testIterator.next();
      return expect(
        () => testExpect(testIterator, 'to yield item', 'anything'),
        'to error',
        "Iterator was expected to yield 'anything' but was done",
      );
    });

    it('<iterator> to yield items <array>', () =>
      expect(
        () =>
          testExpect(testIterator, 'to yield items', [
            'this',
            'is',
            'a',
            'test',
          ]),
        'not to error',
      ));

    it('<iterator> to yield items <array>, subject too short', () =>
      expect(
        () =>
          testExpect(testIterator, 'to yield items', [
            'far ',
            'too',
            'long',
            'this',
            'is',
            'a',
            'test',
          ]),
        'to error',
        'Iterator was expected to yield at least 7 values but was done after 4',
      ));

    it('<iterator> to yield items <array>, diff', () =>
      expect(
        () =>
          testExpect(testIterator, 'to yield items', [
            'not',
            'really',
            'a',
            'test',
          ]),
        'to error',
        "expected iterator to yield items [ 'not', 'really', 'a', 'test' ]\n" +
          '\n' +
          '[\n' +
          "  'this', // should equal 'not'\n" +
          '          //\n' +
          '          // -this\n' +
          '          // +not\n' +
          "  'is', // should equal 'really'\n" +
          '        //\n' +
          '        // -is\n' +
          '        // +really\n' +
          "  'a',\n" +
          "  'test'\n" +
          ']',
      ));

    it('<iterator> yielding with <any>', () =>
      expect(
        () => testExpect(argGenerator(4), 'yielding with', 2),
        'not to error',
      ).then(value => expect(value, 'to be', 0)));

    it('<iterator> yielding with <any> <assertion>', () =>
      expect(
        () => testExpect(argGenerator(4), 'yielding with', 2, 'to be', 0),
        'not to error',
      ));

    it('<iterator> yielding with <any>, iterator done', () =>
      expect(
        () => testExpect(argGenerator(0), 'yielding with', 2),
        'to error',
        'Iterator was expected to yield but was done',
      ));

    it('<iterator> to be done, pass', () =>
      expect(() => testExpect(argGenerator(0), 'to be done'), 'not to error'));

    it('<iterator> to be done, fail', () =>
      expect(
        () => testExpect(argGenerator(5), 'to be done'),
        'to error',
        'expected iterator to be done',
      ));

    it('<iterator> not to be done, pass', () =>
      expect(
        () => testExpect(argGenerator(5), 'not to be done'),
        'not to error',
      ));

    it('<iterator> not to be done, fail', () =>
      expect(
        () => testExpect(argGenerator(0), 'not to be done'),
        'to error',
        'expected iterator not to be done',
      ));

    it('<iterator> to be done with <any>, pass', () =>
      expect(
        () =>
          testExpect(
            accepterGenerator(),
            'to yield item',
            testExpect.it('to be a', 'Promise'),
          ).and('to be done with', 2),
        'not to error',
      ));

    it('<iterator> to be done with <any>, fail', () =>
      expect(
        () => testExpect(accepterGenerator(), 'to be done with', 2),
        'to error',
        'expected iterator to be done with 2',
      ));
  });
});

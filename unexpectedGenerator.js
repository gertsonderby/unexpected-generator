export default {
  name: 'unexpected-generators',
  installInto: expect => {
    expect.addType({
      name: 'iterator',
      identify: subject =>
        subject && subject.next && typeof subject.next === 'function',
      inspect: () => 'iterator',
    });

    expect.addAssertion(
      '<iterator> to yield item <any>',
      (expect, subject, pattern) => {
        const yielded = subject.next();
        if (yielded.done) {
          expect.errorMode = 'bubble';
          expect.fail(
            'Iterator was expected to yield {0} but was done',
            pattern,
          );
        }
        expect(yielded.value, 'to satisfy', pattern);
      },
    );

    expect.addAssertion(
      '<iterator> to yield items <array>',
      (expect, subject, pattern) => {
        const yieldedValues = [];
        for (let i = 0; i < pattern.length; i += 1) {
          const yielded = subject.next();
          if (yielded.done) {
            expect.errorMode = 'bubble';
            expect.fail(
              'Iterator was expected to yield at least {0} values but was done after {1}',
              pattern.length,
              i,
            );
          }
          yieldedValues.push(yielded.value);
        }
        expect(yieldedValues, 'to satisfy', pattern);
      },
    );

    expect.addAssertion(
      '<iterator> yielding with <any> <assertion?>',
      (expect, subject, arg) => {
        const { done, value } = subject.next(arg);
        if (done) {
          expect.errorMode = 'bubble';
          expect.fail('Iterator was expected to yield but was done');
        }
        return expect.shift(value);
      },
    );

    expect.addAssertion('<iterator> [not] to be done', (expect, subject) => {
      const yielded = subject.next();
      return expect(yielded.done, '[not] to be true');
    });

    expect.addAssertion(
      '<iterator> to be done with <any>',
      (expect, subject, arg) => {
        const { done } = subject.next(arg);
        return expect(done, 'to be true');
      },
    );
  },
};

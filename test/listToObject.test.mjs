import { listToObject } from '../solution';

test('listToObject', () => {
    expect(
        listToObject([
            {
                name: 'foo',
                value: 1,
            },
            {
                name: 'bar',
                value: 2,
            },
            {
                name: 'foobar',
                value: [{}],
            }
        ])
    ).toEqual({
        foo: 1,
        bar: 2,
        foobar: [{}]
    });
});

test('listToObject should not copy references', () => {
    const obj = {};
    const result = listToObject([
        {
            name: 'foo',
            value: obj,
        }
    ]);

    expect(result.foo).not.toBe(obj);
});
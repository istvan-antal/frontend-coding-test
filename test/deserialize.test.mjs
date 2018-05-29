import { deserialize } from '../solution';

test('deserialize', () => {
    expect(deserialize({
        row1_name: 'baz',
        row0_name: 'foo',
        row1_value: 6,
        row0_value: 5,
        total: 2,
    })).toEqual({
        row: [
            {
                name: 'foo',
                value: 5,
            },
            {
                name: 'baz',
                value: 6,
            },
        ],
        total: 2,
    });
});

test('deserialize nested', () => {
    expect(deserialize({
        row1_name: 'baz',
        row0_name: 'foo',
        row1_value: 6,
        row0_value: 5,
        row1_hits: {
            hit0_time: 't:1527494940547',
            hit1_time: 't:1527581340547',
        },
        total: 2,
    })).toEqual({
        row: [
            {
                name: 'foo',
                value: 5,
            },
            {
                name: 'baz',
                value: 6,
                hits: {
                    hit: [
                        { time: '28/05/2018' },
                        { time: '29/05/2018' }
                    ]
                }
            },
        ],
        total: 2,
    });
});
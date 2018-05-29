import { serialize } from '../solution';

test('serialize', () => {
    expect(serialize({
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
    })).toEqual({
            row1_name: 'baz',
            row0_name: 'foo',
            row1_value: 6,
            row0_value: 5,
            total: 2,
    });
});

test('serialize nested', () => {
    expect(serialize({
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
    })).toEqual({
            row1_name: 'baz',
            row0_name: 'foo',
            row1_value: 6,
            row0_value: 5,
            row1_hits: {
                hit0_time: '28/05/2018',
                hit1_time: '29/05/2018',
            },
            total: 2,
        });
});
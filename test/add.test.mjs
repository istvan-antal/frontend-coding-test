import { add } from '../solution';

test('add(a, b)', () => {
    expect(add(2, 2)).toBe(4);
});

test('add with more than 2 arguments', () => {
    expect(add(1, 2, 3)).toBe(6);
});
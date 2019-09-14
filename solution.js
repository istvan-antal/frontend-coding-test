import { clone } from 'lodash';

export const add = (a, b, ...args) => {
    return args.reduce((acc, cur) => acc + cur, 0) + a + b;
};

export const listToObject = list => {
    return list.reduce(
        (acc, { name, value }) => ({ ...acc, [name]: clone(value) }),
        {}
    );
};

export const objectToList = obj => {
    return Object.entries(obj).map(([key, val]) => ({
        name: key,
        value: clone(val),
    }));
};

export const deserialize = data => {
    return Object.entries(data)
        .sort((a, b) => (a <= b ? -1 : 1))
        .reduce(reduceData, {});
};

/**
 * For every key value pair in the reducer:
 * - split key into the row name and the property name
 * - check if value (property) is an object
 *   - if it is, repeat previous steps 
 *   - if it isn't, process the value 
 * - check if key contains a property name, 
 *   - if it does, add property to the row
 *   - if it doesn't, return a value
 * - add row to the accumulator
 * - check if it's the last iteration
 *   - if it is, combine the rows with the same name
 * - return the accumulator 
 */
const reduceData = (acc, [key, val], idx, src) => {
    const [rowName, propName] = key.split('_');
    const isObject = val !== null && typeof val === 'object';
    const prop = isObject ? deserialize(val) : processProp(val, propName);
    const row = propName ? { ...(acc[rowName] || {}), [propName]: prop } : val;

    acc = { ...acc, ...{ [rowName]: row } };

    return idx === src.length - 1 ? combineRows(acc) : acc;
};


/**
 * Combine rows with the same name and return a new object
 */
const combineRows = rows => {
    return Object.entries(rows).reduce((acc, [key, val]) => {
        const [rowName, index] = key.split(/(\d$)/g);
        const row = acc[rowName] || [];

        return { ...acc, [rowName]: index ? [...row, val] : val };
    }, {});
};

/**
 * Check if property is a timestamp and return a formated date if it is
 */
const processProp = (prop, propName) => {
    const isProp = propName && propName !== '';
    const isTime = isProp && /t:\d*/.test(prop);

    return isTime ? formatTime(prop) : prop;
};

const formatTime = timestamp => {
    const time = new Date(parseInt(timestamp.split(':')[1]));
    const date = toDoubleDigits(time.getDate());
    const month = toDoubleDigits(time.getMonth() + 1);
    const year = time.getFullYear();

    return `${date}/${month}/${year}`;
};

/**
 * Convert a single digit to a double digit format, eg 2 -> 02
 */
const toDoubleDigits = date => {
    return date < 10 ? '0' + date : date;
};

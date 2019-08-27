import { format } from "date-fns";

// add
export const add = (...args) => args.reduce((acc, value) => acc + value, 0);

// Deserialize
export const deserialize = data =>
  Object.keys(data).reduce((acc, key) => {
    const [nameIdx, field] = key.split("_");

    // obtain the match with digits, if they exists like 'row1' or no like 'total'
    const match = nameIdx.match(/\d+/);

    if (!!match) {
      // gets the number, that is the index
      const idx = parseInt(match[0], 10);
      // as the match tells us from which index the digits start we just have to slice
      const name = nameIdx.slice(0, match.index);

      // this 'if' is just to be defensive
      if (!isNaN(idx)) {
        if (!acc[name]) {
          acc[name] = [];
        }
        if (!acc[name][idx]) {
          acc[name][idx] = {};
        }
        if (typeof data[key] === "object") {
          acc[name][idx][field] = deserialize(data[key]);
        } else if (/t:\d+/.test(data[key])) {
          // if it is a date, as jest does not control well the locales,
          // I decided to use date-fns
          const time = parseInt(data[key].split(":")[1], 10);
          acc[name][idx][field] = format(new Date(time), "dd/MM/y");
        } else {
          acc[name][idx][field] = data[key];
        }
      }
    } else {
      acc[key] = data[key];
    }

    return acc;
  }, {});

// ListToObject
export const listToObject = data =>
  data.reduce(
    (acc, item) => ({
      ...acc,
      [item.name]: valueOf(item.value)
    }),
    {}
  );

// objectToList
export const objectToList = data =>
  Object.keys(data).map(key => ({ name: key, value: valueOf(data[key]) }));

//helpers
const valueOf = value =>
  typeof value === "object" ? cloneObject(value) : value;

const cloneObject = obj => JSON.parse(JSON.stringify(obj));

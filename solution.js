import moment from 'moment';

export const add = (...values) => {

    return values.reduce((acc, val)=> {
        return acc+ val
    },0);
};

export const objectToList = obj => {

    return Object.keys(obj).map(key=> {
        return {name:key, value: getValue(obj[key])}
    });
};


export const listToObject = data =>
    data.reduce(
        (acc, item) => ({
            ...acc,
            [item.name]: getValue(item.value)
        }),
        {}
    );

export const deserialize = (obj) => {
    let result = {};
    const keys = Object.keys(obj);
    const separatedKeys = keys.map(k=> k.split('_')).sort();

    const arrPropName = separatedKeys.find(s=> s.length > 1)[0].replace(/[0-9]/g,'');

    result[arrPropName] = [];

    let startPropIndex = -1;
    let objectInArrProp;
    separatedKeys.forEach(separatedKey=> {
        if(separatedKey.length > 1){
            const propWithIndex = separatedKey[0];

            const currentPropIndex = Number(propWithIndex.match(/\d+/g)[0]);


            let value = obj[separatedKey.join('_')];
            if(currentPropIndex > startPropIndex){
                startPropIndex = currentPropIndex;
                objectInArrProp = { [separatedKey[1]] : parseValue(value)};
                result[arrPropName].push(objectInArrProp);
            }else{
                objectInArrProp[separatedKey[1]] = parseValue(value);
            }
        }
       else{
           result[separatedKey[0]] = obj[separatedKey[0]];
        }
    });

    return result;
};


const parseValue = value => {
    if(value instanceof Object )
        return deserialize(value);

    if(value.toString().startsWith('t:'))
        return moment(Number(value.substr(2))).format('DD/MM/YYYY');

    return value;
};

const getValue = value =>
    typeof value === "object" ? makeClone(value) : value;

const makeClone = obj => JSON.parse(JSON.stringify(obj));

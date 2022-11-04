import deepMerge from 'deepmerge'

export const at = (obj: object, location: string) => {
    // We are going to keep a record of where we are, and dive the object.
    let currentLocation = obj;
    // We are going to split the location by the dots, and then loop through each one.
    const locationArray = location.split('.');
    for (const location of locationArray) {
        // If we are at the end of the object, we can return the value.
        if (currentLocation[location] === undefined) {
            return undefined;
        }
        // Otherwise, we will dive into the object.
        currentLocation = currentLocation[location];
    }
    return currentLocation;
}

export const listContainsByKey = <T>(list: T[], key: keyof T, value: any): boolean => {
    return list.some((item: T) => item[key] === value);
}

export const listContainsByManyKeys = <T>(list: T[], key: (keyof T)[], value: any[]): boolean => {
    return key.some((k: keyof T, idx: number) => listContainsByKey(list, k, value[idx]));
}

export const merge = (...objs: object[]): object => deepMerge.all(objs);
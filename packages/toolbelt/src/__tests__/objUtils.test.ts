import { at, listContainsByKey, listContainsByManyKeys } from '../objUtils';

describe('objUtils', () => {
    describe('at', () => {
        let test = { a: 1, b: { c: 2, d: 3, e: { f: 4 } } };

        it('should return a value at the top level', () => {
            expect(at(test, 'a')).toBe(1);
        });

        it('should return undefined if there is no value', () => {
            expect(at(test, 'c')).toBeUndefined();
        })

        it('should be able to deep dive a value', () => {
            expect(at(test, 'b.c')).toBe(2);
        })

        it('should be able to handle a missing deep object', () => {
            expect(at(test, 'b.h')).toBe(undefined);
        })
    })

    describe('listContainsByKey', () => {
        let items = [{ name: 'bob', last: 'steven', age: 90, alive: true }, { name: 'janice', last: 'walters', age: 40, alive: false }, { name: 'bodhi', last: 'ash', age: 4, alive: true }];

        it('should return true if there are matching cases', () => {
            expect(listContainsByKey(items, 'alive', true)).toBeTruthy();
        })

        it('should return false if there are no matching', () => {
            expect(listContainsByKey(items, 'age', 100)).toBeFalsy()
        })
    });

    describe('listContainsByManyKeys', () => {
        let items = [{ name: 'bob', last: 'steven', age: 90, alive: true }, { name: 'janice', last: 'walters', age: 40, alive: false }, { name: 'bodhi', last: 'ash', age: 4, alive: true }];

        it('should handle a straight truthy case', () => {
            expect(listContainsByManyKeys(items, ['alive', 'age'], [true, 90])).toBeTruthy()
        })

        it('should handle a straight falsy case', () => {
            expect(listContainsByManyKeys(items, ['name', 'age'], ['fred', 100])).toBeFalsy();
        })

        it('should handle a partial case', () => {
            expect(listContainsByManyKeys(items, ['name', 'last'], ['bodhi', 'fred'])).toBeTruthy();
        })
    })
})
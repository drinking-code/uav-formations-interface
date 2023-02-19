import _ from 'lodash'

export class TwoKeyMap {
    /**
     * Mapping the first key to maps that then map the second key to the data.
     * @type Map<any, Map<any, any>>
     * */
    data = new Map()

    _ensureKeys(firstKey, secondKey) {
        if (!this.data.has(firstKey)) {
            this.data.set(firstKey, new Map())
        }
        if (!this.data.get(firstKey).has(secondKey)) {
            this.data.get(firstKey).set(secondKey, null)
        }
    }

    get(firstKey, secondKey) {
        return this.data.get(firstKey).get(secondKey)
    }

    set(firstKey, secondKey, value) {
        this._ensureKeys(firstKey, secondKey)
        this.data.get(firstKey).set(secondKey, value)
        return this
    }

    has(firstKey, secondKey) {
        return this.data.has(firstKey) && this.data.get(firstKey).has(secondKey)
    }

    get size() {
        return this.sizeDeep.reduce((a, b) => a + b)
    }

    get sizeDeep() {
        return Array.from(this.data.values()).map(map => map.size)
    }
}

/**
 * Two key map where .get() and .has() return values if the given key is equal to the stored one (as opposed to the same).
 * This enables retrieval of values stored with an object as a key by using an equal (but not the same) object for querying.
 * */
class TwoKeyMapLaxSecondKey extends TwoKeyMap {
    _matchSecondKey(firstKey, secondKey) {
        const keys = this.data.get(firstKey).keys()
        return Array.from(keys).find(key => _.isEqual(key, secondKey))
    }

    get(firstKey, secondKey) {
        if (!this.data.has(firstKey)) return undefined
        secondKey = this._matchSecondKey(firstKey, secondKey)
        if (!secondKey) return undefined
        return this.data.get(firstKey).get(secondKey)
    }

    has(firstKey, secondKey) {
        if (!this.data.has(firstKey)) return false
        secondKey = this._matchSecondKey(firstKey, secondKey)
        return !!secondKey

    }
}

export class FormationCache extends TwoKeyMapLaxSecondKey {
    defaultResult = {
        formation: [],
        isComplete: false,
    }

    ensureKeys(stl, options) {
        super._ensureKeys(stl, options)
        if (this.get(stl, options) === null)
            this.set(stl, options, {...this.defaultResult})
    }

    getResult(stl, options) {
        this.ensureKeys(stl, options)
        return this.get(stl, options).formation
    }

    isComplete(stl, options) {
        return this.get(stl, options).isComplete
    }

    setComplete(stl, options) {
        this.ensureKeys(stl, options)
        this.get(stl, options).isComplete = true
    }

    addPoint(stl, options, ...points) {
        this.ensureKeys(stl, options)
        this.get(stl, options).formation.push(...points)
    }
}

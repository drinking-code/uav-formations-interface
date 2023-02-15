export class FormationCache extends TwoKeyMap {
    defaultResult = {
        formation: [],
        isComplete: false,
    }

    ensureKeys(firstKey, secondKey) {
        super.ensureKeys(firstKey, secondKey)
        if (this.get(firstKey, secondKey) === null)
            this.set(firstKey, secondKey, {...this.defaultResult})
    }

    getResult(stl, options) {
        this.ensureKeys(stl, options)
        return this.get(stl, options)
    }

    isComplete(stl, options) {
        return this.get(stl, options).isComplete
    }

    setComplete(stl, options) {
        this.get(stl, options).isComplete = true
    }

    addPoint(stl, options, ...points) {
        this.get(stl, options).formation.push(...points)
    }
}

class TwoKeyMap {
    /**
     * Mapping the first key to maps that then map the second key to the data.
     * */
    data = new Map()

    ensureKeys(firstKey, secondKey) {
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
        this.ensureKeys(firstKey, secondKey)
        this.data.get(firstKey).set(secondKey, value)
        return this
    }

    has(firstKey, secondKey) {
        return this.data.has(firstKey) && this.data.get(firstKey).has(secondKey)
    }
}

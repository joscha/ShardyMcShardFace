export class CiParallelVarsMock {
    constructor(private __index: number, private __total: number) {}
    get index() {
        return this.__index;
    }

    get total() {
        return this.__total;
    }
    __setIndex(index: number) {
        this.__index = index;
        return this;
    }
    __setTotal(total: number) {
        this.__total = total;
        return this;
    }
}

module.exports = new CiParallelVarsMock(1, 10);

export default class Array2D<T> {
    private dat: (T | undefined)[][] = [];

    constructor(rows: number = 0, cols: number = 0, fill: T | undefined = undefined) {
        this.dat = new Array(rows).fill(new Array(cols).fill(fill));
    }

    get(row: number, col: number): T | undefined {
        return this.dat[row][col];
    }

    set(row: number, col: number, value: T): void {
        if (col >= this.dat[row].length) {
            this.dat = [...this.dat, new Array(col - this.dat[row].length).fill(undefined)];
        }
        this.dat[row][col] = value;
    }
}
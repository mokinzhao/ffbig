
enum RangeBoundaries {
    start = 0,
    end = 1,
}

interface INewRange {
    key: [number, number];
    getRange: (range: [number, number]) => number[];
}

class RangeList {
    /**
     * Create a range of numbers
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     * @return {Array<number>}
     */
    private static createRange(range: [number, number]): number[] {
        // get start and end of the range
        const start: number = range[RangeBoundaries.start];
        const end: number = range[RangeBoundaries.end] - 1;


        const res: number[] = [];
        for (let i = start; i <= end; i++) {
            res.push(i);
        }
        return res;
    }

    private static handleException(range: [number, number]): void {
        if (
            isNaN(range[RangeBoundaries.start]) || isNaN(range[RangeBoundaries.end])
            ||
            range.length > 2
        ) {
            throw new Error('RangeList requires an array of two numbers as an input!');
        }
    }

    private rangeList: INewRange[] = [];

    /**
     * Adds a range to the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    public add(range: [number, number]): void {
        RangeList.handleException(range);

        // get start and end of the range
        const inputRangeStart: number = range[RangeBoundaries.start];
        const inputRangeEnd: number = range[RangeBoundaries.end];

        if (this.rangeList.length > 0) {
            // verify ranges if we have more then one

            const rangeListLen = this.rangeList.length;
            for (let i = 0; i < rangeListLen; i++) {
                const iKeyStart: number = this.rangeList[i].key[RangeBoundaries.start];

                for (let j = i; j < rangeListLen; j++) {
                    const jKeyStart: number = this.rangeList[j].key[RangeBoundaries.start];
                    const jKeyEnd: number = this.rangeList[j].key[RangeBoundaries.end];

                    if (inputRangeStart >= iKeyStart && inputRangeEnd <= jKeyEnd) {
                        // Handle: [20, 20), [2, 4)
                        // When rangeList: [1, 5) [10, 20)
                        // Should display: [1, 5) [10, 20)

                        // rangeList already includes this range
                        // do nothing
                        return;
                    }
                    else if (inputRangeEnd > jKeyEnd && inputRangeStart <= jKeyEnd) {
                        // Handle: [20, 21), [3, 8)
                        // When rangeList: [1, 5) [10, 20)
                        // Should display: [1, 8) [10, 21)

                        // extend array with a new range
                        this.rangeList[j].key = [jKeyStart, inputRangeEnd];
                    }
                }
            }
        }

        this.saveRange(range);
    }

    /**
     * Removes a range from the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    public remove(range: [number, number]): void  {
        RangeList.handleException(range);

        // get start and end of the range
        const inputRangeStart: number = range[RangeBoundaries.start];
        const inputRangeEnd: number = range[RangeBoundaries.end];

        let deleteElIndex = -1;

        const rangeListLen = this.rangeList.length;
        for (let i = 0; i < rangeListLen; i++) {
            const iKeyStart: number = this.rangeList[i].key[RangeBoundaries.start];
            const iKeyEnd: number = this.rangeList[i].key[RangeBoundaries.end];

            if (
                inputRangeStart > iKeyStart && inputRangeEnd < iKeyEnd
                &&
                iKeyEnd - inputRangeEnd > 1
            ) {
                // Handle: [15, 17)
                // When rangeList: [1, 8) [11, 21)
                // Should display: [1, 8) [11, 15) [17, 21)

                this.rangeList[i].key = [inputRangeEnd, iKeyEnd];

                // cut and insert before current range
                this.rangeList.splice(i, 0, {
                    getRange: RangeList.createRange,
                    key: [iKeyStart, inputRangeStart],
                });
            }
            else if (inputRangeStart >= iKeyStart && inputRangeEnd <= iKeyEnd) {
                // Handle: [10, 11)
                // When rangeList: [1, 5) [10, 21)
                // Should display: [1, 8) [11, 21)

                this.rangeList[i].key = [inputRangeEnd, iKeyEnd];
            }
            else if (this.rangeList.length >= 2) {
                // find the tail of the input range if we have more then 2 elements
                // Handle: [3, 19)
                // When rangeList: [1, 8) [11, 15) [17, 21)
                // Should display: [1, 3) [19, 21)

                for (let j = i + 1; j < rangeListLen; j++) {
                    // current range
                    const jKeyEnd: number = this.rangeList[j].key[RangeBoundaries.end];

                    if (
                        inputRangeStart <= iKeyEnd
                        &&
                        inputRangeEnd < jKeyEnd
                    ) {
                        this.rangeList[i].key = [iKeyStart, inputRangeStart];

                        this.rangeList[j].key = [inputRangeEnd, jKeyEnd];

                        // mark unused ranges
                        deleteElIndex = i;
                        break;
                    }
                }
            }
        }

        if (deleteElIndex > 0) {
            // remove unused range
            this.rangeList.splice(deleteElIndex, 1);
        }
    }

    /**
     * Prints out the list of ranges in the range list
     */
    public print(): void {
        let output = '';
        for (const item of this.rangeList) {
            output += `${item.getRange(item.key)} `;
        }
        console.log(output);
    }

    private saveRange(range: [number, number]): void {
        const newRange: INewRange = {
            getRange: RangeList.createRange,
            key: range,
        };

        this.rangeList.push(newRange);

        // make sure that ranges sorted in incremental order
        this.rangeList.sort((a, b) => a.key[RangeBoundaries.start] - b.key[RangeBoundaries.start]);
    }
}

// Example run
const rl = new RangeList();

rl.add([1, 5]);
rl.print();
// Should display: [1, 5)

rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)

rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)

rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)

rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)

rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)

rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)

rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)

rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)

rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)
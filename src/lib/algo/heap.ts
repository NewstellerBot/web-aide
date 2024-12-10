class Heap<T> {
  heap: T[];
  comparator: (a: T, b: T) => number;

  constructor(
    heap: T[] | null | undefined,
    comparator: (a: T, b: T) => number,
  ) {
    this.heap = heap ?? [];
    this.comparator = comparator;
    this._buildHeap();
  }

  left = (i: number) => 2 * i + 1;
  right = (i: number) => 2 * i + 2;

  heapify = (i: number) => {
    const l = this.left(i);
    const r = this.right(i);
    let smallest = i;

    if (
      l < this.heap.length &&
      this.comparator(this.heap[l]!, this.heap[i]!) < 0
    ) {
      smallest = l;
    }

    if (
      r < this.heap.length &&
      this.comparator(this.heap[r]!, this.heap[smallest]!) < 0
    ) {
      smallest = r;
    }

    if (smallest !== i) {
      [this.heap[i], this.heap[smallest]] = [
        this.heap[smallest]!,
        this.heap[i]!,
      ];
      this.heapify(smallest);
    }
  };

  _buildHeap = () => {
    for (let i = Math.floor(this.heap.length / 2); i >= 0; i--) {
      this.heapify(i);
    }
  };

  extract = () => {
    if (this.heap.length === 0) {
      throw new Error("Heap underflow");
    }

    const min = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1]!;
    this.heap.pop();
    this.heapify(0);

    return min;
  };

  insert = (key: T) => {
    this.heap.push(key);
    let i = this.heap.length - 1;

    while (
      i > 0 &&
      this.comparator(this.heap[i]!, this.heap[Math.floor((i - 1) / 2)]!) < 0
    ) {
      const temp = this.heap[i]!;
      this.heap[i] = this.heap[Math.floor((i - 1) / 2)]!;
      this.heap[Math.floor((i - 1) / 2)] = temp;
      i = Math.floor((i - 1) / 2);
    }
  };

  peek = () => {
    if (this.heap.length === 0) {
      throw new Error("Heap underflow");
    }

    return this.heap[0];
  };

  // * @returns {Number}
  size = () => this.heap.length;
}

export default Heap;

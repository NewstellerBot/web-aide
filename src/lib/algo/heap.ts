class Heap<T> {
  heap: T[];
  private comparator: (a: T, b: T) => number;
  // alias for extract
  pop = () => this.extract();

  constructor(heap: T[] = [], comparator: (a: T, b: T) => number) {
    this.heap = [...heap];
    this.comparator = comparator;
    this._buildHeap();
  }

  // Calculate the index of the parent of the node at index i
  private parent(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  // Calculate the index of the left child of the node at index i
  private left(i: number): number {
    return 2 * i + 1;
  }

  // Calculate the index of the right child of the node at
  private right(i: number): number {
    return 2 * i + 2;
  }

  /**
   * Heapify the node at index i.
   */
  heapify(i: number): void {
    const n = this.heap.length;
    if (i >= n) {
      return; // Out of range, nothing to heapify
    }

    const l = this.left(i);
    const r = this.right(i);

    let smallest = i;

    // Check left child
    if (l < n && this.comparator(this.heap[l]!, this.heap[i]!) < 0) {
      smallest = l;
    }

    // Check right child
    if (r < n && this.comparator(this.heap[r]!, this.heap[smallest]!) < 0) {
      smallest = r;
    }

    if (smallest !== i) {
      const temp = this.heap[i]!;
      this.heap[i] = this.heap[smallest]!;
      this.heap[smallest] = temp;
      this.heapify(smallest);
    }
  }

  /**
   * Builds the heap from the initial array.
   * Only nodes from floor(n/2)-1 down to 0 need to be heapified.
   */
  private _buildHeap(): void {
    const start = Math.floor(this.heap.length / 2) - 1;
    for (let i = start; i >= 0; i--) {
      this.heapify(i);
    }
  }

  /**
   * Removes and returns the root element (the minimum in a min-heap).
   */
  public extract(): T {
    if (this.heap.length === 0) {
      throw new Error("Heap underflow");
    }

    // The root element is always at index 0
    const root = this.heap[0]!;
    const last = this.heap.pop();

    // If there's still elements left, move the last element to the root and heapify
    if (last !== undefined && this.heap.length > 0) {
      this.heap[0] = last;
      this.heapify(0);
    }

    return root;
  }

  /**
   * Inserts a new key into the heap.
   */
  public insert(key: T): void {
    this.heap.push(key);
    let i = this.heap.length - 1;

    // Bubble up the inserted element if it is smaller than its parent
    while (i > 0) {
      const p = this.parent(i);
      // Safe because i < length and p < i thus p is also valid
      if (this.comparator(this.heap[i]!, this.heap[p]!) < 0) {
        const temp = this.heap[i]!;
        this.heap[i] = this.heap[p]!;
        this.heap[p] = temp;
        i = p;
      } else {
        break;
      }
    }
  }

  /**
   * Returns the root element without removing it.
   */
  public peek(): T {
    if (this.heap.length === 0) {
      throw new Error("Heap is empty");
    }
    return this.heap[0]!;
  }

  /**
   * Returns the number of elements in the heap.
   */
  public size(): number {
    return this.heap.length;
  }
}

export default Heap;

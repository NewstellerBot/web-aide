import Heap from "../../src/lib/algo/heap";
import Graph from "../../src/lib/algo/graph";

const removeDependencies = <
  T extends {
    id: string | number;
    dependencies: string[] | number[];
    context: string[] | number[];
  },
>(
  queue: Heap<T>,
  extracted: T,
) => {
  queue.heap.forEach((node, i) => {
    const deps = queue.heap[i]?.dependencies.filter((d) => d !== extracted.id);
    const el = queue.heap[i];
    if (deps && el) el.dependencies = deps as typeof el.dependencies;
  });
};

test("heap operations", () => {
  const heap = new Heap<number>(null, (a, b) => a - b);
  heap.insert(4);
  heap.insert(3);
  heap.insert(2);
  heap.insert(1);
  heap.insert(0);
  expect(heap.extract()).toBe(0);
  expect(heap.extract()).toBe(1);
  expect(heap.extract()).toBe(2);
  expect(heap.extract()).toBe(3);
  expect(heap.extract()).toBe(4);
});

test("heapify", () => {
  const heap = new Heap([4, 3, 2, 1, 0], (a, b) => a - b);
  heap._buildHeap();
  expect(heap.heap).toEqual([0, 1, 2, 4, 3]);
});

test("heapify with custom comparator", () => {
  const nodes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

  const edges = [
    { id: "id", source: 1, target: 2 },
    { id: "id", source: 1, target: 4 },
    { id: "id", source: 2, target: 4 },
    { id: "id", source: 4, target: 3 },
  ];

  //        2
  //       / \uni
  //   1 -    \
  //       \   \
  //        - - 4 - 3

  const g = new Graph(nodes, edges);

  expect(g.isCyclical()).toBe(false);

  const queue = new Heap(
    g.buildQueue(),
    (a, b) => a.dependencies.length - b.dependencies.length,
  );

  let extracted = queue.peek()!;
  removeDependencies(queue, extracted);
  queue.extract();
  expect(extracted.id).toBe(1);

  extracted = queue.peek()!;
  removeDependencies(queue, extracted);
  queue.extract();
  expect(extracted.id).toBe(2);

  extracted = queue.peek()!;
  removeDependencies(queue, extracted);
  queue.extract();
  expect(extracted.id).toBe(4);

  extracted = queue.peek()!;
  removeDependencies(queue, extracted);
  queue.extract();
  expect(extracted.id).toBe(3);

  expect(() => queue.extract()).toThrow("Heap underflow");
});

test("basic usage with actual nodes", () => {
  const nodes = [
    {
      id: "84ea1fb2-11db-46ec-9c64-5881524372fc",
      position: { x: 817, y: 198 },
      prompt: "asdf",
      isConnectable: true,
      type: "prompt",
      measured: { width: 661, height: 32 },
      selected: false,
      dragging: false,
      dependencies: [],
      context: [],
    },
    {
      id: "584f0457-e35f-4d99-b813-35d4c3d2e040",
      position: { x: 404, y: 178.625 },
      prompt: "asdf",
      isConnectable: true,
      type: "constant",
      measured: { width: 661, height: 32 },
      selected: false,
      dragging: false,
      dependencies: ["9f52cb6b-ffbd-41c8-98b3-7d492ed77e94"],
      context: [],
    },
    {
      id: "9f52cb6b-ffbd-41c8-98b3-7d492ed77e94",
      position: { x: 635.375, y: 363 },
      prompt: "afsdasdf",
      isConnectable: true,
      type: "prompt",
      measured: { width: 661, height: 32 },
      selected: true,
      dragging: false,
      dependencies: ["84ea1fb2-11db-46ec-9c64-5881524372fc"],
      context: [],
    },
  ];

  const queue = new Heap(
    nodes,
    (a, b) => a.dependencies.length - b.dependencies.length,
  );

  let extracted = queue.extract()!;
  expect(extracted.id).toBe("84ea1fb2-11db-46ec-9c64-5881524372fc");
  removeDependencies(queue, extracted);

  extracted = queue.extract()!;
  // make sure no dependecies are left
  expect(extracted.dependencies.length).toBe(0);
  expect(extracted.id).toBe("9f52cb6b-ffbd-41c8-98b3-7d492ed77e94");
  removeDependencies(queue, extracted);

  extracted = queue.extract()!;
  // make sure no dependecies are left
  expect(extracted.dependencies.length).toBe(0);
  expect(extracted.id).toBe("584f0457-e35f-4d99-b813-35d4c3d2e040");
  removeDependencies(queue, extracted);
});

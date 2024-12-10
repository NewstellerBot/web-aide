import Graph from "../../src/lib/algo/graph";

test("cyclicalities in graph", () => {
  // basic test
  const nodes = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
  ];

  const edges = [
    {
      source: 1,
      target: 2,
    },
    {
      source: 2,
      target: 3,
    },
    {
      source: 3,
      target: 4,
    },
  ];
  const g1 = new Graph(nodes, edges);
  expect(g1.isCyclical()).toBe(false);

  edges.push({
    source: 4,
    target: 1,
  });

  const g2 = new Graph(nodes, edges);
  expect(g2.isCyclical()).toBe(true);
});

test("target not in nodes should throw", () => {
  const nNodes = 100;
  const nodes = [...Array(nNodes).keys()].map((i) => ({ id: i }));
  // create a chain with last node point to non-existing target
  const edges = nodes.flatMap(({ id }) =>
    id !== 1 ? { source: 0, target: id + 1 } : [],
  );

  expect(() => {
    new Graph(nodes, edges);
  }).toThrow();
});

test("building queue", () => {
  const nodes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const edges = [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 3, target: 4 },
    { source: 2, target: 4 },
  ];

  const g = new Graph(nodes, edges);

  expect(g.buildQueue()).toEqual([
    { id: 1, dependencies: [], context: [] },
    { id: 2, dependencies: [1], context: [] },
    { id: 3, dependencies: [1], context: [] },
    { id: 4, dependencies: [2, 3], context: [] },
  ]);
});

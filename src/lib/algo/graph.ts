type Node<T, N> = {
  id: T;
  data?: N;
};

type Edge<T> = {
  source: T;
  target: T;
};

export type QueueNode<T, N> = Node<T, N> & {
  dependencies: T[];
  context: string[];
};

class Graph<T, N> {
  adjacencyList: Map<T, T[]>;
  nodes: Node<T, N>[];
  edges: Edge<T>[];
  queue: QueueNode<T, N>[];

  constructor(nodes: Node<T, N>[], edges: Edge<T>[]) {
    this.adjacencyList = new Map<T, T[]>();
    this.nodes = nodes;
    this.edges = edges;
    this.queue = [];
    this.buildGraph();
  }

  private buildGraph(): void {
    this.nodes.forEach((node) => {
      this.adjacencyList.set(node.id, []);
    });

    this.edges.forEach((edge) => {
      if (!this.adjacencyList.has(edge.source)) {
        throw new Error(`No source node found for ID ${String(edge.source)}`);
      }
      if (!this.adjacencyList.has(edge.target)) {
        throw new Error(`No target node found for ID ${String(edge.target)}`);
      }

      this.adjacencyList.get(edge.source)!.push(edge.target);
    });
  }

  isCyclical(): boolean {
    const visited = new Set<T>();
    const recStack = new Set<T>();

    for (const node of this.nodes) {
      if (this._isCyclicalUtil(node.id, visited, recStack)) {
        return true;
      }
    }

    return false;
  }

  private _isCyclicalUtil(
    nodeId: T,
    visited: Set<T>,
    recStack: Set<T>,
  ): boolean {
    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = this.adjacencyList.get(nodeId);
      if (neighbors === undefined) {
        throw new Error(
          `Adjacency list does not exist for ID ${String(nodeId)}`,
        );
      }

      for (const neighbor of neighbors) {
        if (
          !visited.has(neighbor) &&
          this._isCyclicalUtil(neighbor, visited, recStack)
        ) {
          return true;
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  buildQueue(): QueueNode<T, N>[] {
    const queue: QueueNode<T, N>[] = this.nodes.map((node) => ({
      ...node,
      dependencies: [] as T[],
      context: [],
    }));

    queue.forEach((node) => {
      const neighbors = this.adjacencyList.get(node.id);
      if (neighbors === undefined) {
        throw new Error(`Neighbors are undefined for ID ${String(node.id)}`);
      }

      neighbors.forEach((neighbor) => {
        const targetNode = queue.find((n) => n.id === neighbor);
        if (targetNode) {
          targetNode.dependencies.push(node.id);
        }
      });
    });

    this.queue = queue;
    return queue;
  }
}

export default Graph;

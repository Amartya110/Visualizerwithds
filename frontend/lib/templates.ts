export const ALGORITHM_TEMPLATES = {
    "Binary Search": {
        code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1

# Test case with 30 elements
arr = [i * 2 for i in range(30)] 
target = 42
result = binary_search(arr, target)
print(f"Index of {target}: {result}")`,
        description: "Find a target efficiently in a sorted array."
    },
    "DFS (Graph)": {
        code: `def dfs(graph, node, visited):
    if node not in visited:
        visited.add(node)
        print(f"Visited: {node}")
        
        for neighbor in graph[node]:
            dfs(graph, neighbor, visited)

# Adjacency List
graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}
visited = set()
dfs(graph, 'A', visited)`,
        description: "Depth-First Search traverses a graph deeper before backtracking."
    },
    "BFS (Graph)": {
        code: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        node = queue.popleft()
        print(f"Visited: {node}")
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}
bfs(graph, 'A')`,
        description: "Breadth-First Search visits all neighbors at the present depth first."
    }
};

export type AlgorithmType = keyof typeof ALGORITHM_TEMPLATES;

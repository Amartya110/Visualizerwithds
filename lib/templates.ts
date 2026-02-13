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
        description: "Find a target efficiently in a sorted array.",
        notes: `
### Binary Search (O(log N))

**Concept:**
Binary Search is a classic **Divide and Conquer** algorithm used to find an element in a **sorted array**.  
Instead of checking every element one by one (which takes O(N)), we eliminate half of the search space at each step.

**Real World Analogy:**
Imagine searching for a word in a physical dictionary:
- You open it to the middle.
- If your word comes *after* the current page, you ignore the first half and only look in the second half.
- You repeat this process until you find the word.

**How It Works:**
1.  **Initialize Pointers:** Set \`left\` to the start (0) and \`right\` to the end (len-1) of the array.
2.  **Calculate Mid:** Find the middle index: \`mid = (left + right) // 2\`.
3.  **Compare:**
    - If \`arr[mid] == target\`: Success! Return the index.
    - If \`arr[mid] < target\`: The target *must* be in the right half. Update \`left = mid + 1\`.
    - If \`arr[mid] > target\`: The target *must* be in the left half. Update \`right = mid - 1\`.
4.  **Repeat:** Continue while \`left <= right\`. If pointers cross, the element doesn't exist.

**Complexity Analysis:**
- **Time Complexity:** **O(log N)**. Since we divide the search space by 2 each time, for 1 million elements, it only takes ~20 comparisons!
- **Space Complexity:** **O(1)**. No extra space is needed (iterative approach).

**Key Takeaways:**
- The array **MUST be sorted**.
- Be careful with the \`while left <= right\` condition (using \`<\` can miss the last element).
`
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
        description: "Depth-First Search traverses a graph deeper before backtracking.",
        notes: `
### Depth-First Search (DFS) (O(V + E))

**Concept:**
DFS is a graph traversal algorithm that explores as deep as possible along each branch before backtracking. It's like exploring a maze by following a path until you hit a dead end, then stepping back to the last fork and trying a different path.

**Implementation Strategy:**
DFS uses a **Stack** data structure (LIFO - Last In First Out). This is naturally implemented using **Recursion** (which uses the call stack).

**Steps:**
1.  Start at a source node.
2.  Mark the current node as **visited**.
3.  For every neighbor of the current node:
    - If the neighbor has not been visited, recursively enable DFS on it.
4.  Backtrack when all neighbors are visited.

**Complexity Analysis:**
- **Time:** **O(V + E)**, where V is vertices and E is edges. We visit every node and edge once.
- **Space:** **O(V)** in the worst case (stack depth for a linear graph).

**Common Use Cases:**
- **Cycle Detection:** If we encounter a visited node in the current recursion stack, there's a cycle.
- **Pathfinding:** Finding *any* path between two nodes (not necessarily the shortest).
- **Topological Sort:** Ordering tasks with dependencies.
- **Solving Puzzles:** Like mazes or Sudoku.
`
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
        description: "Breadth-First Search visits all neighbors at the present depth first.",
        notes: `
### Breadth-First Search (BFS) (O(V + E))

**Concept:**
BFS explores a graph layer by layer. It starts at a source node and visits all its immediate neighbors first, then moves to the neighbors' neighbors, and so on. It spreads out like a ripple in a pond.

**Implementation Strategy:**
BFS uses a **Queue** data structure (FIFO - First In First Out) to keep track of nodes to visit.

**Steps:**
1.  Initialize a \`queue\` with the starting node.
2.  Mark the start node as **visited**.
3.  While the queue is **not empty**:
    - **Dequeue** a node from the front.
    - **Process** it (e.g., print it).
    - **Enqueue** all unvisited neighbors and mark them as visited.

**Complexity Analysis:**
- **Time:** **O(V + E)**. Every node and edge is processed once.
- **Space:** **O(V)**. In the worst case, the queue might hold all leaf nodes (often V/2).

**Common Use Cases:**
- **Shortest Path:** In an unweighted graph, BFS guarantees the shortest path (minimum number of edges) to any node.
- **Level Order Traversal:** Printing a tree level by level.
- **Connected Components:** Finding all nodes reachable from a source.
- **Web Crawlers:** Exploring links up to a certain depth.
`
    },
    "Prefix Sum": {
        code: `def prefix_sum(arr):
    n = len(arr)
    prefix = [0] * n
    prefix[0] = arr[0]
    
    for i in range(1, n):
        prefix[i] = prefix[i-1] + arr[i]
        
    return prefix

def range_sum(prefix, L, R):
    if L == 0:
        return prefix[R]
    return prefix[R] - prefix[L-1]

# Test Case
arr = [1, 2, 3, 4, 5, 6]
print(f"Original: {arr}")

psum = prefix_sum(arr)
print(f"Prefix Sum: {psum}")

# Calculate sum of range [1, 4] (indexes) -> 2+3+4+5 = 14
L, R = 1, 4
total = range_sum(psum, L, R)
print(f"Sum[{L}, {R}]: {total}")`,
        description: "Precompute sums to answer range queries in O(1).",
        notes: `
### Prefix Sum Array

**Concept:**
The Prefix Sum technique allows us to calculate the **sum of any subarray** in **O(1)** time, after an **O(N)** preprocessing step. This is incredibly useful for problems involving multiple range sum queries.

**How It Works:**
We create a new array \`P\` where \`P[i]\` stores the sum of all elements from index \`0\` to \`i\`.

**Formulas:**
1.  **Preprocessing (Build):**
    \`\`\`python
    P[i] = P[i-1] + arr[i]
    \`\`\`
2.  **Range Query (L, R):**
    To find the sum of \`arr[L...R]\`, we take the sum up to \`R\` and subtract the sum up to \`L-1\`.
    \`\`\`python
    Sum(L, R) = P[R] - P[L-1]  (if L > 0)
    Sum(0, R) = P[R]           (if L == 0)
    \`\`\`

**Example Walkthrough:**
Input: \`[1, 2, 3, 4, 5]\`
Prefix: \`[1, 3, 6, 10, 15]\`

Query: Sum from index 1 to 3 (\`2 + 3 + 4 = 9\`).
Formula: \`P[3] - P[0]\` = \`10 - 1\` = **9**.

**Complexity Analysis:**
- **Preprocessing Time:** O(N)
- **Query Time:** O(1)
- **Space:** O(N) for the prefix array.

**Use Cases:**
- Range Sum Queries.
- Finding if a subarray with sum 0 exists.
- 2D Prefix Sums (for submatrix sums in images/grids).
`
    },
    "Binary Search (Answer)": {
        code: `def check(weights, capacity, days):
    required_days = 1
    current_load = 0
    
    for w in weights:
        if current_load + w > capacity:
            required_days += 1
            current_load = 0
        current_load += w
        
    return required_days <= days

def ship_within_days(weights, days):
    # Search range for capacity
    left = max(weights)
    right = sum(weights)
    ans = right
    
    while left <= right:
        mid = (left + right) // 2
        
        if check(weights, mid, days):
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
            
    return ans

# Test Case: Ship weights within 5 days
weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
days = 5
min_capacity = ship_within_days(weights, days)
print(f"Minimum Capacity: {min_capacity}")`,
        description: "Binary Search on the answer space (e.g. minimizing capacity).",
        notes: `
### Binary Search on Answer

**Concept:**
Sometimes we don't search for an element in an explicit array. Instead, we search for the **optimal value** (the answer itself) within a range of possible values.
This applies when the problem has a **monotonic property**:  
"If \`X\` is a valid solution, then all values \`> X\` are also valid (or vice versa)."

**The Pattern:**
1.  **Define the Search Space:** Identify the minimum possible answer (\`low\`) and maximum possible answer (\`high\`).
2.  **Check Function:** Write a function \`check(value)\` that returns \`True\` if the value is feasible.
3.  **Binary Search:**
    - Calculate \`mid\`.
    - If \`check(mid)\` is True: We found a potential answer! Store it, and try to find a *better* one (e.g., smaller).
    - If \`check(mid)\` is False: The answer is not possible here, move to the valid side.

**Example Problem: Capacity to Ship Packages**
Given weights and D days, what is the **minimum capacity** of the ship?
- **Low:** \`max(weights)\` (Must carry at least the heaviest item).
- **High:** \`sum(weights)\` (Carrying everything in 1 day).
- **Check(capacity):** Can we ship everything within D days using this capacity?

**Complexity Analysis:**
- **Time:** \`O(N * log(SearchSpace))\`. The log factor comes from binary searching the range, and N from the check function.
- **Space:** \`O(1)\`.

**Key Hint:**
Look for keywords like **"Minimize the Maximum"** or **"Maximize the Minimum"**.
`
    }
};

export type AlgorithmType = keyof typeof ALGORITHM_TEMPLATES;

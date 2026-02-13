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
    },
    "Bubble Sort": {
        code: `def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n):
        # Last i elements are already in place
        for j in range(0, n-i-1):
            
            # Swap if the element found is greater
            # than the next element
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                
# Test Case
arr = [64, 34, 25, 12, 22, 11, 90]
print(f"Original: {arr}")

bubble_sort(arr)

print(f"Sorted: {arr}")`,
        description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        notes: `
### Bubble Sort (O(N²))

**Concept:**
Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order.

**How It Works:**
1.  traverse from left and compare adjacent elements and the higher one is placed at right side. 
2.  In this way, the largest element moves to the rightmost end at first. 
3.  This process is then continued to find the second largest and place it and so on representing the "bubbles" moving to the top.

**Complexity Analysis:**
- **Time Complexity:** O(N²) in worst and average case. O(N) in best case (already sorted).
- **Space Complexity:** O(1).
`
    },
    "Merge Sort": {
        code: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]

        merge_sort(L)
        merge_sort(R)

        i = j = k = 0

        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1

        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1

        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1

# Test Case
arr = [12, 11, 13, 5, 6, 7]
print(f"Original: {arr}")
merge_sort(arr)
print(f"Sorted: {arr}")`,
        description: "A Divide and Conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
        notes: `
### Merge Sort (O(N log N))

**Concept:**
Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.

**Key Steps:**
1.  **Divide:** Find the middle point to divide the array into two halves: m = (l+r)/2
2.  **Conquer:** Call mergeSort for first half: Call mergeSort(arr, l, m)
3.  **Conquer:** Call mergeSort for second half: Call mergeSort(arr, m+1, r)
4.  **Combine:** Merge the two halves sorted in step 2 and 3: Call merge(arr, l, m, r)

**Complexity Analysis:**
- **Time Complexity:** O(N log N) in all 3 cases (worst, average and best) as merge sort always divides the array into two halves and takes linear time to merge two halves.
- **Space Complexity:** O(N) due to the temporary arrays used for merging.
`
    },
    "Quick Sort": {
        code: `def partition(arr, low, high):
    i = (low - 1)         # index of smaller element
    pivot = arr[high]     # pivot

    for j in range(low, high):
        if arr[j] <= pivot:
            i = i + 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return (i + 1)

def quick_sort(arr, low, high):
    if len(arr) == 1:
        return arr
    if low < high:
        pi = partition(arr, low, high)

        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

# Test Case
arr = [10, 7, 8, 9, 1, 5]
n = len(arr)
print(f"Original: {arr}")
quick_sort(arr, 0, n - 1)
print(f"Sorted: {arr}")`,
        description: "A Divide and Conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot.",
        notes: `
### Quick Sort (O(N log N))

**Concept:**
QuickSort is a Divide and Conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot.

**Key Steps:**
1.  **Pivot Selection:** Pick an element as a pivot (last element in this implementation).
2.  **Partitioning:** Rearrange the array so that all elements with values less than the pivot come before the pivot, while all elements with values greater than the pivot come after it.
3.  **Recursion:** Recursively apply the above steps to the sub-array of elements with smaller values and separately to the sub-array of elements with greater values.

**Complexity Analysis:**
- **Time Complexity:** 
    - Best/Average: O(N log N)
    - Worst: O(N²) (when array is already sorted)
- **Space Complexity:** O(log N) due to recursive stack.
`
    },
    // --- Dynamic Programming ---
    "Fibonacci (DP)": {
        code: `def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
        
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]

# Test Case
n = 10
memo = {}
result = fibonacci(n, memo)
print(f"Fibonacci({n}) = {result}")
print(f"Memo Table: {memo}")`,
        description: "Calculate the Nth Fibonacci number using memoization to avoid redundant calculations.",
        notes: `
### Fibonacci Sequence (Memoization)

**Concept:**
The Fibonacci sequence is a series of numbers where a number is the addition of the last two numbers, starting with 0 and 1.
Using recursion without memoization leads to O(2^N) complexity. With memoization, we store results of subproblems.

**Memoization:**
We use a dictionary or array \`memo\` to store \`fib(n)\` once computed.
If we need \`fib(n)\` again, we return the stored value.

**Complexity Analysis:**
- **Time Complexity:** O(N). Each number is computed once.
- **Space Complexity:** O(N) for recursion stack and memo table.
`
    },
    "Knapsack (DP)": {
        code: `def knapsack(weights, values, capacity):
    n = len(weights)
    # Initialize DP table
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                # Max of including or excluding
                include = values[i-1] + dp[i-1][w-weights[i-1]]
                exclude = dp[i-1][w]
                dp[i][w] = max(include, exclude)
            else:
                exclude = dp[i-1][w]
                dp[i][w] = exclude
                
    return dp[n][capacity]

# Test Case
weights = [10, 20, 30]
values = [60, 100, 120]
capacity = 50
max_val = knapsack(weights, values, capacity)
print(f"Max Value: {max_val}")`,
        description: "Solve the 0/1 Knapsack problem using dynamic programming (tabulation).",
        notes: `
### 0/1 Knapsack Problem (Tabulation)

**Concept:**
Given a set of items, each with a weight and a value, determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible.

**DP State:**
\`dp[i][w]\` represents the maximum value using a subset of the first \`i\` items with a capacity of \`w\`.

**Transitions:**
- If current item weight <= current capacity:
  \`dp[i][w] = max(value[i] + dp[i-1][w-weight[i]], dp[i-1][w])\`
- Else:
  \`dp[i][w] = dp[i-1][w]\`

**Complexity Analysis:**
- **Time Complexity:** O(N * W), where N is number of items and W is capacity.
- **Space Complexity:** O(N * W) for the table.
`
    },
    // --- Trees ---
    "BST (Insert)": {
        code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def insert(root, val):
    if not root:
        return TreeNode(val)
    
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
        
    return root

# Construct BST
values = [10, 5, 15, 3, 7, 18]
root = None

for v in values:
    root = insert(root, v)

# Visualize root
print(f"Root: {root.val}")`,
        description: "Insert nodes into a Binary Search Tree while maintaining BST property.",
        notes: `
### Binary Search Tree (Insertion)

**Concept:**
A Binary Search Tree (BST) is a hierarchical data structure where for each node:
- The left subtree contains only nodes with values **less than** the node's value.
- The right subtree contains only nodes with values **greater than** the node's value.

**Insertion Logic:**
1.  Start at the root.
2.  If the value to insert is less than the current node, go left.
3.  If greater, go right.
4.  If current node is None, create the new node here.

**Complexity Analysis:**
- **Time Complexity:** O(H), where H is height of tree.
  - Average: O(log N)
  - Worst: O(N) (skewed tree)
- **Space Complexity:** O(H) for recursion stack.
`
    },
    "BST (Search)": {
        code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def search(root, target):
    if not root or root.val == target:
        return root
        
    if target < root.val:
        return search(root.left, target)
        
    return search(root.right, target)

# Setup Tree
values = [10, 5, 15, 3, 7]
root = None
for v in values:
    root = insert(root, v)

target = 7
result = search(root, target)

if result:
    print(f"Found: {result.val}")
else:
    print("Not Found")`,
        description: "Search for a target value in a Binary Search Tree.",
        notes: `
### Binary Search Tree (Search)

**Concept:**
Efficiently searching for values takes advantage of the BST property (Left < Node < Right).

**Search Logic:**
1.  Start at root.
2.  If root is None or matches target, return root.
3.  If target < root.val, search left subtree.
4.  If target > root.val, search right subtree.

**Complexity Analysis:**
- **Time Complexity:** O(H).
- **Space Complexity:** O(H).
`
    }
};

export type AlgorithmType = keyof typeof ALGORITHM_TEMPLATES;

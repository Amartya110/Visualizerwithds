from tracer_python import trace_python_code
import json

code = """
def dfs(graph, node, visited):
    if node not in visited:
        print(node)
        visited.add(node)
        for neighbour in graph[node]:
            dfs(graph, neighbour, visited)

graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}
visited = set()
dfs(graph, 'A', visited)
"""

print("Running tracer test...")
traces = trace_python_code(code, "")
print(f"Tracer returned {len(traces)} steps.")

# Print first 3 steps to verify format
print(json.dumps(traces[:3], indent=2))

if len(traces) > 0:
    print("Test PASSED: Traces generated.")
else:
    print("Test FAILED: No traces generated.")

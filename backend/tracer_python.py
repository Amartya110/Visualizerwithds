import sys
import io
import traceback
import json

def trace_python_code(code: str, input_str: str):
    """
    Executes the python code with the given input and returns a list of trace steps.
    Each step contains the line number and local variables.
    """
    trace_data = []
    
    # Redirect stdout and stdin
    old_stdout = sys.stdout
    old_stdin = sys.stdin
    redirected_output = io.StringIO()
    redirected_input = io.StringIO(input_str)
    
    sys.stdout = redirected_output
    sys.stdin = redirected_input
    
    def trace_calls(frame, event, arg):
        if event in ['line', 'call', 'return']:
            # Record line number and local variables
            # We filter out internal variables to keep it clean
            locals_copy = {}
            for k, v in frame.f_locals.items():
                if not k.startswith('__'):
                    try:
                        # Attempt to serialize to JSON to ensure it's safe
                        # If complex object, stringify it
                        json.dumps(v) 
                        locals_copy[k] = v
                    except:
                        locals_copy[k] = str(v)
            
            # For return events, capture the return value
            if event == 'return':
                locals_copy['__return__'] = str(arg)

            trace_data.append({
                "line": frame.f_lineno,
                "locals": locals_copy,
                "event": event,
                "func_name": frame.f_code.co_name
            })
        return trace_calls

    try:
        # We wrap the code in a function so we can trace it easily without tracing setup code
        # However, to support top-level scripts, we might just exec.
        # Let's exec in a clean global scope.
        sys.settrace(trace_calls)
        exec(code, {'__name__': '__main__'})
    except Exception as e:
        trace_data.append({
            "event": "error",
            "error": str(e),
            "traceback": traceback.format_exc()
        })
    finally:
        sys.settrace(None)
        sys.stdout = old_stdout
        sys.stdin = old_stdin
        
    return trace_data

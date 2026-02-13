export interface Problem {
    id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    description: string;
    template: string;
    testCases?: { input: string, expected: string }[];
}

export const PROBLEMS: Problem[] = [
    {
        id: "two-sum",
        title: "Two Sum",
        difficulty: "Easy",
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
        template: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))`,
        testCases: [
            { input: "nums = [2,7,11,15], target = 9", expected: "[0, 1]" },
            { input: "nums = [3,2,4], target = 6", expected: "[1, 2]" }
        ]
    },
    {
        id: "valid-palindrome",
        title: "Valid Palindrome",
        difficulty: "Easy",
        description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.`,
        template: `def is_palindrome(s):
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]

s = "A man, a plan, a canal: Panama"
print(is_palindrome(s))`,
        testCases: [
            { input: 's = "A man, a plan, a canal: Panama"', expected: "True" },
            { input: 's = "race a car"', expected: "False" }
        ]
    },
    {
        id: "reverse-linked-list",
        title: "Reverse Linked List",
        difficulty: "Easy",
        description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
        template: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev

# Helpers to build list
def build_list(arr):
    dummy = ListNode(0)
    curr = dummy
    for x in arr:
        curr.next = ListNode(x)
        curr = curr.next
    return dummy.next

head = build_list([1, 2, 3, 4, 5])
reversed_head = reverse_list(head)
print(reversed_head.val)`,
        testCases: []
    }
];

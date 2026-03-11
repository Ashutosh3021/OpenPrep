'use client'

import { useState, useEffect } from 'react'

interface CodeEditorProps {
  language: string
  code: string
  onChange: (code: string) => void
}

const codeTemplates = {
  python: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
    return []`,

  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const seen = {};
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (complement in seen) {
            return [seen[complement], i];
        }
        seen[nums[i]] = i;
    }
    return [];
};`,

  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            seen.put(nums[i], i);
        }
        return new int[] {};
    }
}`,

  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,

  golang: `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if j, ok := seen[complement]; ok {
            return []int{j, i}
        }
        seen[num] = i
    }
    return []int{}
}`,
}

export function CodeEditor({ language, code, onChange }: CodeEditorProps) {
  const [internalCode, setInternalCode] = useState(code)

  useEffect(() => {
    setInternalCode(codeTemplates[language as keyof typeof codeTemplates] || '')
  }, [language])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setInternalCode(newCode)
    onChange(newCode)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <textarea
        value={internalCode}
        onChange={handleChange}
        className="flex-1 w-full p-4 font-mono text-sm bg-background text-foreground border-none outline-none resize-none"
        placeholder="Write your code here..."
        spellCheck="false"
      />
    </div>
  )
}

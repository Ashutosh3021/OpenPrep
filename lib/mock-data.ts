export interface Problem {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  acceptance: number
  submissions: number
  solved: boolean
  likes: number
}

export interface Submission {
  id: number
  problemId: number
  code: string
  language: string
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error'
  runtime: number
  memory: number
  timestamp: Date
}

export interface UserStats {
  totalSolved: number
  totalSubmissions: number
  acceptanceRate: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  streak: number
  longestStreak: number
}

export const mockProblems: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array',
    acceptance: 48.2,
    submissions: 15432210,
    solved: true,
    likes: 28932,
  },
  {
    id: 2,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    category: 'Linked List',
    acceptance: 32.5,
    submissions: 4234123,
    solved: true,
    likes: 8192,
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'String',
    acceptance: 33.4,
    submissions: 7821230,
    solved: false,
    likes: 15234,
  },
  {
    id: 4,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Array',
    acceptance: 27.6,
    submissions: 1023123,
    solved: false,
    likes: 12932,
  },
  {
    id: 5,
    title: 'Palindromic Substrings',
    difficulty: 'Medium',
    category: 'String',
    acceptance: 31.8,
    submissions: 2321093,
    solved: true,
    likes: 5123,
  },
  {
    id: 6,
    title: 'ZigZag Conversion',
    difficulty: 'Medium',
    category: 'String',
    acceptance: 39.2,
    submissions: 1823021,
    solved: false,
    likes: 3821,
  },
  {
    id: 7,
    title: 'Reverse Integer',
    difficulty: 'Easy',
    category: 'Math',
    acceptance: 26.8,
    submissions: 2892301,
    solved: true,
    likes: 4123,
  },
  {
    id: 8,
    title: 'String to Integer',
    difficulty: 'Medium',
    category: 'String',
    acceptance: 14.9,
    submissions: 892301,
    solved: false,
    likes: 2123,
  },
  {
    id: 9,
    title: 'Palindrome Number',
    difficulty: 'Easy',
    category: 'Math',
    acceptance: 52.2,
    submissions: 1293821,
    solved: true,
    likes: 1923,
  },
  {
    id: 10,
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    acceptance: 26.8,
    submissions: 923821,
    solved: false,
    likes: 5123,
  },
]

export const mockUserStats: UserStats = {
  totalSolved: 156,
  totalSubmissions: 2341,
  acceptanceRate: 42.3,
  easySolved: 89,
  mediumSolved: 52,
  hardSolved: 15,
  streak: 7,
  longestStreak: 21,
}

export const mockUserProfile = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  bio: 'Software engineer passionate about coding interviews',
  joinDate: '2024-01-15',
  rank: 1234,
}

export const mockSubmissions: Submission[] = [
  {
    id: 1,
    problemId: 1,
    code: 'def twoSum(nums, target):\n  seen = {}\n  for i, num in enumerate(nums):\n    if target - num in seen:\n      return [seen[target - num], i]\n    seen[num] = i',
    language: 'Python',
    status: 'Accepted',
    runtime: 45,
    memory: 14.2,
    timestamp: new Date('2024-03-10'),
  },
  {
    id: 2,
    problemId: 3,
    code: 'var lengthOfLongestSubstring = function(s) {\n  const charMap = {};\n  let maxLen = 0;\n  let start = 0;\n  for (let i = 0; i < s.length; i++) {\n    const char = s[i];\n    if (char in charMap) {\n      start = Math.max(start, charMap[char] + 1);\n    }\n    charMap[char] = i;\n    maxLen = Math.max(maxLen, i - start + 1);\n  }\n  return maxLen;\n};',
    language: 'JavaScript',
    status: 'Wrong Answer',
    runtime: 0,
    memory: 0,
    timestamp: new Date('2024-03-09'),
  },
]

export const heatmapData = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(new Date().getTime() - (365 - i) * 24 * 60 * 60 * 1000),
  count: Math.floor(Math.random() * 5),
}))

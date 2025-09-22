// Mock data สำหรับระบบ On-Boarding
import { Employee, User, EmployeeTraining, Evaluation, POSITIONS, DEPARTMENTS, BRANCHES } from './types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'hr001',
    password: 'hr123',
    role: 'hr',
    name: 'สมชาย ใจดี',
    email: 'hr@company.com',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    username: 'emp001',
    password: 'emp123',
    role: 'employee',
    employeeId: 'EMP001',
    name: 'สมหญิง รักงาน',
    email: 'employee@company.com',
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    username: 'trainer001',
    password: 'train123',
    role: 'trainer',
    employeeId: 'TRAIN001',
    name: 'สมศักดิ์ ผู้สอน',
    email: 'trainer@company.com',
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    username: 'manager001',
    password: 'mgr123',
    role: 'manager',
    employeeId: 'MGR001',
    name: 'สมพร ผู้จัดการ',
    email: 'manager@company.com',
    createdAt: '2024-01-01'
  }
];

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'สมหญิง',
    lastName: 'รักงาน',
    position: 'server',
    department: 'ฝ่ายบริการลูกค้า',
    branch: 'สาขาสีลม',
    startDate: '2024-01-15',
    probationEndDate: '2024-04-15',
    trainerId: '3',
    lineManagerId: '4',
    status: 'in_progress',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'สมชาย',
    lastName: 'ขยัน',
    position: 'cook_helper',
    department: 'ฝ่ายครัว',
    branch: 'สาขาสยาม',
    startDate: '2024-01-20',
    probationEndDate: '2024-04-20',
    trainerId: '3',
    lineManagerId: '4',
    status: 'pending',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  }
];

// Mock Training Modules
export const mockTrainingModules = [
  // Server modules
  ...POSITIONS.server.modules.map((module, index) => ({
    id: `server_${index + 1}`,
    position: 'server',
    title: module.title,
    description: module.description,
    duration: module.duration,
    maxScore: module.maxScore,
    order: index + 1
  })),
  // Cook helper modules
  ...POSITIONS.cook_helper.modules.map((module, index) => ({
    id: `cook_helper_${index + 1}`,
    position: 'cook_helper',
    title: module.title,
    description: module.description,
    duration: module.duration,
    maxScore: module.maxScore,
    order: index + 1
  }))
];

// Mock Employee Training Progress
export const mockEmployeeTraining: EmployeeTraining[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    moduleId: 'server_1',
    status: 'completed',
    completedAt: '2024-01-20',
    trainerId: '3',
    score: 8,
    evaluatedBy: '4',
    evaluatedAt: '2024-01-21',
    notes: 'ทำได้ดี'
  },
  {
    id: '2',
    employeeId: 'EMP001',
    moduleId: 'server_2',
    status: 'completed',
    completedAt: '2024-01-25',
    trainerId: '3',
    score: 9,
    evaluatedBy: '4',
    evaluatedAt: '2024-01-26',
    notes: 'จำเมนูได้ครบถ้วน'
  },
  {
    id: '3',
    employeeId: 'EMP001',
    moduleId: 'server_3',
    status: 'in_progress',
    trainerId: '3'
  }
];

// Mock Evaluations
export const mockEvaluations: Evaluation[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    moduleId: 'server_1',
    score: 8,
    passed: true,
    evaluatedBy: '4',
    evaluatedAt: '2024-01-21',
    comments: 'ทำได้ดี'
  },
  {
    id: '2',
    employeeId: 'EMP001',
    moduleId: 'server_2',
    score: 9,
    passed: true,
    evaluatedBy: '4',
    evaluatedAt: '2024-01-26',
    comments: 'จำเมนูได้ครบถ้วน'
  }
];

// Helper functions
export const getEmployeeById = (employeeId: string): Employee | undefined => {
  return mockEmployees.find(emp => emp.employeeId === employeeId);
};

export const getUserByUsername = (username: string): User | undefined => {
  return mockUsers.find(user => user.username === username);
};

export const getTrainingModulesByPosition = (position: string) => {
  return mockTrainingModules.filter(module => module.position === position);
};

export const getEmployeeTrainingProgress = (employeeId: string): EmployeeTraining[] => {
  return mockEmployeeTraining.filter(training => training.employeeId === employeeId);
};

export const getEvaluationsByEmployee = (employeeId: string): Evaluation[] => {
  return mockEvaluations.filter(evaluation => evaluation.employeeId === employeeId);
};

export const calculateTrainingProgress = (employeeId: string) => {
  const employee = getEmployeeById(employeeId);
  if (!employee) return null;

  const modules = getTrainingModulesByPosition(employee.position);
  const trainingProgress = getEmployeeTrainingProgress(employeeId);
  
  const totalModules = modules.length;
  const completedModules = trainingProgress.filter(t => t.status === 'completed').length;
  
  const evaluations = getEvaluationsByEmployee(employeeId);
  const totalScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0);
  const averageScore = evaluations.length > 0 ? totalScore / evaluations.length : 0;
  
  const startDate = new Date(employee.startDate);
  const endDate = new Date(startDate.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)));
  
  let status: 'on_track' | 'behind' | 'completed' = 'on_track';
  if (completedModules === totalModules) {
    status = 'completed';
  } else if (daysRemaining < 30 && completedModules < totalModules * 0.7) {
    status = 'behind';
  }
  
  return {
    employeeId,
    totalModules,
    completedModules,
    totalScore,
    averageScore,
    daysRemaining,
    status
  };
};

// Re-export constants from types
export { POSITIONS, DEPARTMENTS, BRANCHES };



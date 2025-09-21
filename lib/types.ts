// Types สำหรับระบบ On-Boarding

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  branch: string;
  startDate: string;
  probationEndDate: string;
  trainerId: string;
  lineManagerId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'evaluated';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'hr' | 'employee' | 'trainer' | 'manager';
  employeeId?: string;
  name: string;
  email?: string;
  createdAt: string;
}

export interface TrainingModule {
  id: string;
  position: string;
  title: string;
  description: string;
  duration: number; // วัน
  maxScore: number;
  order: number;
}

export interface EmployeeTraining {
  id: string;
  employeeId: string;
  moduleId: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
  trainerId: string;
  score?: number;
  evaluatedBy?: string;
  evaluatedAt?: string;
  notes?: string;
}

export interface Evaluation {
  id: string;
  employeeId: string;
  moduleId: string;
  score: number;
  passed: boolean;
  evaluatedBy: string;
  evaluatedAt: string;
  comments?: string;
}

export interface TrainingProgress {
  employeeId: string;
  totalModules: number;
  completedModules: number;
  totalScore: number;
  averageScore: number;
  daysRemaining: number;
  status: 'on_track' | 'behind' | 'completed';
}

// Mock data สำหรับตำแหน่งและหลักสูตร
export const POSITIONS = {
  'server': {
    name: 'พนักงานเสิร์ฟ',
    modules: [
      { title: 'คำศัพท์ในการรับ order', description: 'เรียนรู้คำศัพท์ภาษาอังกฤษพื้นฐานในการรับออเดอร์', duration: 7, maxScore: 10 },
      { title: 'เมนูอาหารที่ต้องรู้', description: 'จำเมนูอาหารหลักไม่น้อยกว่า 10 อย่าง', duration: 10, maxScore: 10 },
      { title: 'วิธีการจัดโต๊ะ', description: 'เรียนรู้การจัดโต๊ะและอุปกรณ์เสิร์ฟ', duration: 5, maxScore: 10 },
      { title: 'เทคนิคการเสิร์ฟจานอาหาร', description: 'วิธีการเสิร์ฟที่ถูกต้องและปลอดภัย', duration: 7, maxScore: 10 },
      { title: 'การสื่อสารกับลูกค้า', description: 'เทคนิคการสื่อสารและบริการลูกค้า', duration: 5, maxScore: 10 },
      { title: 'การจัดการโต๊ะ', description: 'การจัดสรรและจัดการโต๊ะลูกค้า', duration: 5, maxScore: 10 },
      { title: 'การรับชำระเงิน', description: 'วิธีการรับชำระเงินและออกใบเสร็จ', duration: 3, maxScore: 10 },
      { title: 'การทำความสะอาด', description: 'การทำความสะอาดพื้นที่ทำงาน', duration: 3, maxScore: 10 },
      { title: 'การจัดการข้อร้องเรียน', description: 'วิธีการรับมือกับข้อร้องเรียนลูกค้า', duration: 5, maxScore: 10 },
      { title: 'การทำงานเป็นทีม', description: 'การทำงานร่วมกับเพื่อนร่วมงาน', duration: 5, maxScore: 10 }
    ]
  },
  'cook_helper': {
    name: 'ผู้ช่วย Cook',
    modules: [
      { title: 'การคัดเลือกวัตถุดิบ', description: 'เรียนรู้การเลือกวัตถุดิบที่มีคุณภาพ', duration: 7, maxScore: 10 },
      { title: 'การตัดแต่งวัตถุดิบ', description: 'เทคนิคการเตรียมและตัดแต่งวัตถุดิบ', duration: 10, maxScore: 10 },
      { title: 'การตรวจสอบหน้าตาอาหาร', description: 'การตรวจสอบคุณภาพอาหารก่อนเสิร์ฟ', duration: 5, maxScore: 10 },
      { title: 'การใช้เครื่องครัว', description: 'การใช้งานเครื่องครัวอย่างปลอดภัย', duration: 7, maxScore: 10 },
      { title: 'การจัดเก็บอาหาร', description: 'วิธีการจัดเก็บอาหารอย่างถูกต้อง', duration: 5, maxScore: 10 },
      { title: 'การทำความสะอาดครัว', description: 'การทำความสะอาดพื้นที่ครัว', duration: 5, maxScore: 10 },
      { title: 'การจัดการขยะ', description: 'การแยกและจัดการขยะในครัว', duration: 3, maxScore: 10 },
      { title: 'ความปลอดภัยในครัว', description: 'กฎความปลอดภัยในการทำงานครัว', duration: 5, maxScore: 10 },
      { title: 'การทำงานภายใต้ความกดดัน', description: 'การจัดการเวลาทำอาหารในยอดขายสูง', duration: 7, maxScore: 10 },
      { title: 'การสื่อสารกับทีม', description: 'การสื่อสารกับ Chef และทีมครัว', duration: 5, maxScore: 10 }
    ]
  }
};

export const DEPARTMENTS = [
  'ฝ่ายบริการลูกค้า',
  'ฝ่ายครัว',
  'ฝ่ายบาร์',
  'ฝ่ายขาย',
  'ฝ่ายบุคคล',
  'ฝ่ายบัญชี'
];

export const BRANCHES = [
  'สาขาสีลม',
  'สาขาสยาม',
  'สาขาเซ็นทรัลเวิลด์',
  'สาขาเทอร์มินอล 21',
  'สาขาเมกาบางนา'
];



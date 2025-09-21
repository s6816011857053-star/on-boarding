# ภาพรวมระบบ On-Boarding

## 🎯 วัตถุประสงค์
ระบบ On-Boarding ถูกออกแบบมาเพื่อจัดการการปฐมนิเทศพนักงานใหม่อย่างมีประสิทธิภาพ โดยครอบคลุมตั้งแต่การลงทะเบียน การฝึกอบรม การประเมินผล และการรายงานผล

## 🔄 Flow การทำงาน

### 1. การลงทะเบียนพนักงาน (HR)
```
HR → ลงทะเบียนพนักงานใหม่ → ระบบสร้างข้อมูลพนักงาน → พนักงานพร้อมฝึกอบรม
```

### 2. การฝึกอบรม (Trainer)
```
พนักงานลงทะเบียน → ระบบแจ้ง Trainer → Trainer สอนงาน 10 หลักสูตร → กดปุ่ม "เสร็จสิ้น"
```

### 3. การประเมินผล (Manager)
```
Trainer เสร็จสิ้น → ระบบแจ้ง Manager → Manager ประเมินผล → ให้คะแนนและเลือกผ่าน/ไม่ผ่าน
```

### 4. การรายงานผล
```
Manager ส่งคะแนน → ระบบสร้างรายงาน → HR และผู้จัดการเขตรับทราบ
```

## 👥 บทบาทผู้ใช้งาน

### HR (ฝ่ายบุคคล)
- **หน้าที่**: ลงทะเบียนพนักงานใหม่
- **ข้อมูลที่กรอก**: รหัสพนักงาน, ชื่อ-นามสกุล, ตำแหน่ง, แผนก, สาขา, วันเริ่มงาน, Trainer, Line Manager
- **การทำงาน**: สร้างฐานข้อมูลพนักงานใหม่เข้าสู่ระบบ

### พนักงาน
- **หน้าที่**: ดูข้อมูลและหลักสูตรการฝึกอบรม
- **การทำงาน**: ลงทะเบียนด้วยรหัสพนักงาน → ดูหลักสูตร 10 หลักสูตร → ติดตามความคืบหน้า

### Trainer (ผู้สอนงาน)
- **หน้าที่**: สอนงานพนักงานใหม่
- **การทำงาน**: รับรายชื่อพนักงาน → สอนงาน 10 หลักสูตร → กดปุ่ม "เสร็จสิ้น" เมื่อสอนเสร็จ
- **ระยะเวลา**: 90 วัน นับจากวันลงทะเบียน

### Manager (ผู้จัดการ)
- **หน้าที่**: ประเมินผลพนักงานใหม่
- **การทำงาน**: รับรายชื่อพนักงานที่ฝึกอบรมเสร็จ → ประเมินผล 10 หลักสูตร → ให้คะแนน 0-10 → เลือกผ่าน/ไม่ผ่าน

## 📚 หลักสูตรการฝึกอบรม

### พนักงานเสิร์ฟ (10 หลักสูตร)
1. คำศัพท์ในการรับ order
2. เมนูอาหารที่ต้องรู้ (ไม่น้อยกว่า 10 อย่าง)
3. วิธีการจัดโต๊ะ
4. เทคนิคการเสิร์ฟจานอาหาร
5. การสื่อสารกับลูกค้า
6. การจัดการโต๊ะ
7. การรับชำระเงิน
8. การทำความสะอาด
9. การจัดการข้อร้องเรียน
10. การทำงานเป็นทีม

### ผู้ช่วย Cook (10 หลักสูตร)
1. การคัดเลือกวัตถุดิบ
2. การตัดแต่งวัตถุดิบ
3. การตรวจสอบหน้าตาอาหาร
4. การใช้เครื่องครัว
5. การจัดเก็บอาหาร
6. การทำความสะอาดครัว
7. การจัดการขยะ
8. ความปลอดภัยในครัว
9. การทำงานภายใต้ความกดดัน
10. การสื่อสารกับทีม

## 🎨 การออกแบบ UI

### สไตล์ Instagram-like
- **สีหลัก**: Gradient จาก Pink ถึง Purple
- **การ์ด**: มุมโค้งมน, เงาเบา, hover effects
- **ปุ่ม**: Gradient background, rounded corners
- **ไอคอน**: Heroicons และ Lucide React
- **Typography**: ฟอนต์ Geist (Sans & Mono)

### Responsive Design
- **Mobile-first**: ออกแบบสำหรับมือถือก่อน
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid และ Flexbox

## 🗄️ โครงสร้างข้อมูล

### Employee
```typescript
{
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
}
```

### Training Module
```typescript
{
  id: string;
  position: string;
  title: string;
  description: string;
  duration: number; // วัน
  maxScore: number;
  order: number;
}
```

### Employee Training
```typescript
{
  id: string;
  employeeId: string;
  moduleId: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
  trainerId: string;
  score?: number;
  evaluatedBy?: string;
  evaluatedAt?: string;
}
```

## 🔐 ระบบ Authentication

### บัญชีทดสอบ
- **HR**: hr001 / hr123
- **พนักงาน**: emp001 / emp123
- **Trainer**: trainer001 / train123
- **Manager**: manager001 / mgr123

### การจัดการ Session
- ใช้ localStorage เก็บข้อมูลผู้ใช้
- Context API สำหรับจัดการ state
- Auto-redirect ตามบทบาทผู้ใช้

## 📊 ระบบรายงาน

### สถิติที่แสดง
- จำนวนพนักงานทั้งหมด
- จำนวนที่ประเมินแล้ว/ยังไม่ประเมิน
- คะแนนเฉลี่ย
- สถิติตามแผนกและสาขา

### ตัวกรองข้อมูล
- กรองตามแผนก
- กรองตามสาขา
- กรองตามตำแหน่ง

## 🚀 การ Deploy

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Vercel (แนะนำ)
- Auto-deploy จาก Git
- Environment variables
- Custom domain

## 🔧 การพัฒนาเพิ่มเติม

### ฟีเจอร์ที่สามารถเพิ่มได้
1. **ระบบแจ้งเตือน**: Email/SMS เมื่อมีงานใหม่
2. **ระบบไฟล์**: อัปโหลดเอกสารการฝึกอบรม
3. **ระบบ Chat**: การสื่อสารระหว่าง Trainer และพนักงาน
4. **ระบบ Calendar**: จัดตารางการฝึกอบรม
5. **ระบบ Analytics**: กราฟและสถิติขั้นสูง
6. **ระบบ Mobile App**: แอปมือถือ
7. **ระบบ API**: RESTful API สำหรับ integration
8. **ระบบ Database**: เชื่อมต่อฐานข้อมูลจริง

### การปรับปรุง UI/UX
1. **Dark Mode**: โหมดมืด
2. **Animation**: เอฟเฟกต์การเคลื่อนไหว
3. **Loading States**: สถานะการโหลด
4. **Error Handling**: การจัดการข้อผิดพลาด
5. **Accessibility**: การเข้าถึงสำหรับผู้พิการ

## 📝 การบำรุงรักษา

### การอัปเดตข้อมูล
- แก้ไขไฟล์ `lib/mock-data.ts` สำหรับข้อมูลทดสอบ
- แก้ไขไฟล์ `lib/types.ts` สำหรับโครงสร้างข้อมูล
- แก้ไขไฟล์ `components/ui/` สำหรับ UI components

### การแก้ไขบัค
- ตรวจสอบ console errors
- ใช้ React DevTools
- ตรวจสอบ Network requests
- ดู TypeScript errors

## 🎯 เป้าหมายในอนาคต

1. **Performance**: ปรับปรุงความเร็วในการโหลด
2. **Scalability**: รองรับผู้ใช้จำนวนมาก
3. **Security**: เพิ่มความปลอดภัย
4. **Integration**: เชื่อมต่อกับระบบอื่น
5. **AI/ML**: ใช้ AI ในการวิเคราะห์และแนะนำ



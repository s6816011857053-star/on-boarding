# ระบบ On-Boarding

ระบบจัดการการปฐมนิเทศพนักงานใหม่ที่ทันสมัยและใช้งานง่าย ช่วยให้การฝึกอบรมและการประเมินผลเป็นไปอย่างมีประสิทธิภาพ

## ฟีเจอร์หลัก

### 🔐 ระบบ Authentication
- เข้าสู่ระบบด้วย username และ password
- รองรับ 4 บทบาท: HR, พนักงาน, Trainer, Manager
- ระบบจัดการ session และ state

### 👥 สำหรับ HR
- ลงทะเบียนพนักงานใหม่เข้าสู่ระบบ
- กรอกข้อมูลพนักงานครบถ้วน (รหัสพนักงาน, ชื่อ-นามสกุล, ตำแหน่ง, แผนก, สาขา, วันเริ่มงาน, Trainer, Line Manager)
- ดูรายชื่อพนักงานทั้งหมดและสถานะ

### 👤 สำหรับพนักงาน
- ดูข้อมูลส่วนตัวและหลักสูตรการฝึกอบรม
- ติดตามความคืบหน้าการฝึกอบรม
- ดูคะแนนและผลการประเมิน

### 🎓 สำหรับ Trainer
- ดูรายชื่อพนักงานที่ต้องสอนงาน
- จัดการหลักสูตรการสอนงาน 10 หลักสูตร
- ติดตามระยะเวลาการสอนงาน (90 วัน)
- กดปุ่ม "เสร็จสิ้น" เมื่อสอนงานเสร็จ

### 📊 สำหรับ Manager
- ประเมินผลพนักงานใหม่
- ให้คะแนนในแต่ละหลักสูตร (0-10 คะแนน)
- เลือกผ่าน/ไม่ผ่านในแต่ละหลักสูตร
- ส่งคะแนนประเมินผล

### 📈 หน้ารายงาน
- สถิติพนักงานตามแผนกและสาขา
- คะแนนเฉลี่ยและผลการประเมิน
- ตัวกรองข้อมูลตามแผนก, สาขา, ตำแหน่ง

## หลักสูตรการฝึกอบรม

### พนักงานเสิร์ฟ
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

### ผู้ช่วย Cook
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

## การติดตั้งและใช้งาน

### ข้อกำหนดระบบ
- Node.js 18+ 
- npm, yarn, pnpm หรือ bun

### การติดตั้ง
```bash
# Clone repository
git clone <repository-url>
cd onboarding

# ติดตั้ง dependencies
npm install
# หรือ
yarn install
# หรือ
pnpm install

# รัน development server
npm run dev
# หรือ
yarn dev
# หรือ
pnpm dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### บัญชีทดสอบ
- **HR**: hr001 / hr123
- **พนักงาน**: emp001 / emp123
- **Trainer**: trainer001 / train123
- **Manager**: manager001 / mgr123

## เทคโนโลยีที่ใช้

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with Instagram-like design
- **State Management**: React Context API
- **Icons**: Heroicons, Lucide React

## โครงสร้างโปรเจค

```
onboarding/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   │   ├── hr/           # HR dashboard
│   │   ├── employee/     # Employee dashboard
│   │   ├── trainer/      # Trainer dashboard
│   │   ├── manager/      # Manager dashboard
│   │   └── reports/      # Reports page
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   └── ui/              # UI components
├── lib/                 # Utilities and data
│   ├── types.ts         # TypeScript types
│   ├── mock-data.ts     # Mock data
│   └── auth-context.tsx # Authentication context
└── public/              # Static assets
```

## การพัฒนา

### การเพิ่มหลักสูตรใหม่
แก้ไขไฟล์ `lib/types.ts` ในส่วน `POSITIONS` object

### การเพิ่มตำแหน่งใหม่
1. เพิ่มใน `POSITIONS` object ใน `lib/types.ts`
2. เพิ่มใน `DEPARTMENTS` array ใน `lib/types.ts`
3. อัปเดต mock data ใน `lib/mock-data.ts`

### การปรับแต่ง UI
- แก้ไขไฟล์ใน `components/ui/` สำหรับ UI components
- ปรับแต่งสีและ styling ใน Tailwind CSS classes

## การ Deploy

### Vercel (แนะนำ)
```bash
npm run build
# Deploy to Vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## License

MIT License - ดูไฟล์ LICENSE สำหรับรายละเอียด

## การสนับสนุน

หากมีปัญหาหรือข้อสงสัย กรุณาสร้าง issue ใน repository หรือติดต่อทีมพัฒนา

'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { mockEmployees, DEPARTMENTS, BRANCHES, POSITIONS } from '../../lib/mock-data';
import { Employee } from '../../lib/types';

export default function HRDashboard() {
  const { user, logout } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    branch: '',
    startDate: '',
    probationEndDate: '',
    trainerId: '',
    lineManagerId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmployee: Employee = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setEmployees([...employees, newEmployee]);
    setFormData({
      employeeId: '',
      firstName: '',
      lastName: '',
      position: '',
      department: '',
      branch: '',
      startDate: '',
      probationEndDate: '',
      trainerId: '',
      lineManagerId: ''
    });
    setShowForm(false);
  };

  const getPositionName = (position: string) => {
    return POSITIONS[position as keyof typeof POSITIONS]?.name || position;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ระบบ On-Boarding</h1>
              <p className="text-gray-600">สวัสดี, {user?.name}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{employees.length}</div>
              <div className="text-gray-600">พนักงานทั้งหมด</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {employees.filter(emp => emp.status === 'pending').length}
              </div>
              <div className="text-gray-600">รอเริ่มงาน</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {employees.filter(emp => emp.status === 'in_progress').length}
              </div>
              <div className="text-gray-600">กำลังฝึกอบรม</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {employees.filter(emp => emp.status === 'completed').length}
              </div>
              <div className="text-gray-600">เสร็จสิ้น</div>
            </div>
          </Card>
        </div>

        {/* Add Employee Button */}
        <div className="mb-6">
          <Button onClick={() => setShowForm(true)}>
            เพิ่มพนักงานใหม่
          </Button>
        </div>

        {/* Add Employee Form */}
        {showForm && (
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-6">เพิ่มพนักงานใหม่</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="รหัสพนักงาน"
                value={formData.employeeId}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                required
              />
              <Input
                label="ชื่อ"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <Input
                label="นามสกุล"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  required
                >
                  <option value="">เลือกตำแหน่ง</option>
                  <option value="server">พนักงานเสิร์ฟ</option>
                  <option value="cook_helper">ผู้ช่วย Cook</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">แผนก</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                >
                  <option value="">เลือกแผนก</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">สาขา</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                  required
                >
                  <option value="">เลือกสาขา</option>
                  {BRANCHES.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <Input
                label="วันเริ่มงาน"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
              <Input
                label="วันที่ผ่านทดลองงาน"
                type="date"
                value={formData.probationEndDate}
                onChange={(e) => setFormData({...formData, probationEndDate: e.target.value})}
                required
              />
              <Input
                label="รหัส Trainer"
                value={formData.trainerId}
                onChange={(e) => setFormData({...formData, trainerId: e.target.value})}
                required
              />
              <Input
                label="รหัส Line Manager"
                value={formData.lineManagerId}
                onChange={(e) => setFormData({...formData, lineManagerId: e.target.value})}
                required
              />
              <div className="md:col-span-2 flex gap-4">
                <Button type="submit">บันทึกข้อมูล</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  ยกเลิก
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Employees List */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">รายชื่อพนักงาน</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสพนักงาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ตำแหน่ง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    แผนก
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สาขา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPositionName(employee.position)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.branch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        employee.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        employee.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.status === 'pending' ? 'รอเริ่มงาน' :
                         employee.status === 'in_progress' ? 'กำลังฝึกอบรม' :
                         employee.status === 'completed' ? 'เสร็จสิ้น' :
                         'ประเมินแล้ว'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}



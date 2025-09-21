'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getEmployeeById, getTrainingModulesByPosition, getEmployeeTrainingProgress, calculateTrainingProgress } from '../../lib/mock-data';
import { Employee, TrainingModule, EmployeeTraining } from '../../lib/types';

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [trainingProgress, setTrainingProgress] = useState<EmployeeTraining[]>([]);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (user?.employeeId) {
      const emp = getEmployeeById(user.employeeId);
      setEmployee(emp || null);
      
      if (emp) {
        const modules = getTrainingModulesByPosition(emp.position);
        setTrainingModules(modules);
        
        const progress = getEmployeeTrainingProgress(user.employeeId);
        setTrainingProgress(progress);
        
        const overallProgress = calculateTrainingProgress(user.employeeId);
        setProgress(overallProgress);
      }
    }
  }, [user]);

  const getModuleStatus = (moduleId: string) => {
    const training = trainingProgress.find(t => t.moduleId === moduleId);
    return training?.status || 'pending';
  };

  const getModuleScore = (moduleId: string) => {
    const training = trainingProgress.find(t => t.moduleId === moduleId);
    return training?.score || 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'เสร็จสิ้น';
      case 'in_progress':
        return 'กำลังดำเนินการ';
      default:
        return 'รอดำเนินการ';
    }
  };

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ระบบ On-Boarding</h1>
              <p className="text-gray-600">สวัสดี, {employee.firstName} {employee.lastName}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Employee Info */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-6">ข้อมูลพนักงาน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสพนักงาน</label>
              <p className="text-gray-900">{employee.employeeId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
              <p className="text-gray-900">{employee.position === 'server' ? 'พนักงานเสิร์ฟ' : 'ผู้ช่วย Cook'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">แผนก</label>
              <p className="text-gray-900">{employee.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สาขา</label>
              <p className="text-gray-900">{employee.branch}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วันเริ่มงาน</label>
              <p className="text-gray-900">{new Date(employee.startDate).toLocaleDateString('th-TH')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ผ่านทดลองงาน</label>
              <p className="text-gray-900">{new Date(employee.probationEndDate).toLocaleDateString('th-TH')}</p>
            </div>
          </div>
        </Card>

        {/* Progress Overview */}
        {progress && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">{progress.completedModules}</div>
                <div className="text-gray-600">เสร็จสิ้น</div>
                <div className="text-sm text-gray-500">จาก {progress.totalModules} หลักสูตร</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{progress.averageScore.toFixed(1)}</div>
                <div className="text-gray-600">คะแนนเฉลี่ย</div>
                <div className="text-sm text-gray-500">จาก 10 คะแนน</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{progress.daysRemaining}</div>
                <div className="text-gray-600">วันคงเหลือ</div>
                <div className="text-sm text-gray-500">ระยะเวลาฝึกอบรม</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  progress.status === 'completed' ? 'text-green-600' :
                  progress.status === 'behind' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {progress.status === 'completed' ? 'เสร็จสิ้น' :
                   progress.status === 'behind' ? 'ล้าหลัง' :
                   'ตามแผน'}
                </div>
                <div className="text-gray-600">สถานะ</div>
              </div>
            </Card>
          </div>
        )}

        {/* Training Modules */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">หลักสูตรการฝึกอบรม</h2>
          <div className="space-y-4">
            {trainingModules.map((module, index) => {
              const status = getModuleStatus(module.id);
              const score = getModuleScore(module.id);
              
              return (
                <div key={module.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{module.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>ระยะเวลา: {module.duration} วัน</span>
                        <span>คะแนนเต็ม: {module.maxScore}</span>
                        {score > 0 && <span className="text-green-600">คะแนนที่ได้: {score}</span>}
                      </div>
                    </div>
                    {status === 'completed' && (
                      <div className="ml-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}



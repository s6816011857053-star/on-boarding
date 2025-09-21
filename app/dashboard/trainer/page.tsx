'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { mockEmployees, getTrainingModulesByPosition, getEmployeeTrainingProgress, calculateTrainingProgress } from '../../../lib/mock-data';
import { Employee, TrainingModule, EmployeeTraining } from '../../../lib/types';

export default function TrainerDashboard() {
  const { user, logout } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [trainingProgress, setTrainingProgress] = useState<EmployeeTraining[]>([]);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      // Filter employees assigned to this trainer
      const assignedEmployees = mockEmployees.filter(emp => emp.trainerId === user.id);
      setEmployees(assignedEmployees);
    }
  }, [user]);

  useEffect(() => {
    if (selectedEmployee) {
      const modules = getTrainingModulesByPosition(selectedEmployee.position);
      setTrainingModules(modules);
      
      const progress = getEmployeeTrainingProgress(selectedEmployee.employeeId);
      setTrainingProgress(progress);
      
      const overallProgress = calculateTrainingProgress(selectedEmployee.employeeId);
      setProgress(overallProgress);
    }
  }, [selectedEmployee]);

  const handleCompleteModule = (moduleId: string) => {
    if (!selectedEmployee) return;
    
    // Update training progress
    const updatedProgress = trainingProgress.map(training => {
      if (training.moduleId === moduleId && training.employeeId === selectedEmployee.employeeId) {
        return {
          ...training,
          status: 'completed' as const,
          completedAt: new Date().toISOString()
        };
      }
      return training;
    });
    
    setTrainingProgress(updatedProgress);
  };

  const getModuleStatus = (moduleId: string) => {
    const training = trainingProgress.find(t => t.moduleId === moduleId);
    return training?.status || 'pending';
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

  const getDaysRemaining = (employee: Employee) => {
    const startDate = new Date(employee.startDate);
    const endDate = new Date(startDate.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days
    const today = new Date();
    return Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ระบบ On-Boarding</h1>
              <p className="text-gray-600">สวัสดี, {user?.name} (Trainer)</p>
            </div>
            <Button variant="outline" onClick={logout}>
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Days Remaining Alert */}
        {employees.some(emp => getDaysRemaining(emp) < 30) && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-yellow-800 font-medium">
                มีพนักงานที่เหลือเวลาฝึกอบรมน้อยกว่า 30 วัน
              </span>
            </div>
          </div>
        )}

        {/* Employees List */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-6">พนักงานที่ต้องสอนงาน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => {
              const daysRemaining = getDaysRemaining(employee);
              const isUrgent = daysRemaining < 30;
              
              return (
                <div
                  key={employee.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedEmployee?.id === employee.id
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{employee.employeeId}</p>
                      <p className="text-sm text-gray-600">
                        {employee.position === 'server' ? 'พนักงานเสิร์ฟ' : 'ผู้ช่วย Cook'}
                      </p>
                    </div>
                    {isUrgent && (
                      <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {daysRemaining} วัน
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">แผนก:</span>
                      <span className="text-gray-900">{employee.department}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">สาขา:</span>
                      <span className="text-gray-900">{employee.branch}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">วันเริ่มงาน:</span>
                      <span className="text-gray-900">
                        {new Date(employee.startDate).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Training Modules for Selected Employee */}
        {selectedEmployee && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                หลักสูตรการสอนงาน - {selectedEmployee.firstName} {selectedEmployee.lastName}
              </h2>
              {progress && (
                <div className="text-sm text-gray-600">
                  เสร็จสิ้น {progress.completedModules} จาก {progress.totalModules} หลักสูตร
                </div>
              )}
            </div>

            <div className="space-y-4">
              {trainingModules.map((module, index) => {
                const status = getModuleStatus(module.id);
                const isCompleted = status === 'completed';
                
                return (
                  <div key={module.id} className="border border-gray-200 rounded-lg p-6">
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
                        </div>
                      </div>
                      
                      <div className="ml-4 flex items-center gap-3">
                        {isCompleted ? (
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleCompleteModule(module.id)}
                            size="sm"
                          >
                            เสร็จสิ้น
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}



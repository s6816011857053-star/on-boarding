'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { mockEmployees, getTrainingModulesByPosition, getEmployeeTrainingProgress, mockEvaluations } from '../../../lib/mock-data';
import { Employee, TrainingModule, EmployeeTraining, Evaluation } from '../../../lib/types';

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [trainingProgress, setTrainingProgress] = useState<EmployeeTraining[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(mockEvaluations);
  const [evaluationScores, setEvaluationScores] = useState<{[key: string]: number}>({});
  const [evaluationPassed, setEvaluationPassed] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (user?.id) {
      // Filter employees assigned to this manager
      const assignedEmployees = mockEmployees.filter(emp => emp.lineManagerId === user.id);
      setEmployees(assignedEmployees);
    }
  }, [user]);

  useEffect(() => {
    if (selectedEmployee) {
      const modules = getTrainingModulesByPosition(selectedEmployee.position);
      setTrainingModules(modules);
      
      const progress = getEmployeeTrainingProgress(selectedEmployee.employeeId);
      setTrainingProgress(progress);
      
      // Initialize evaluation scores
      const initialScores: {[key: string]: number} = {};
      const initialPassed: {[key: string]: boolean} = {};
      
      modules.forEach(module => {
        const existingEval = evaluations.find(evaluation => 
          evaluation.employeeId === selectedEmployee.employeeId && evaluation.moduleId === module.id
        );
        if (existingEval) {
          initialScores[module.id] = existingEval.score;
          initialPassed[module.id] = existingEval.passed;
        } else {
          initialScores[module.id] = 0;
          initialPassed[module.id] = true;
        }
      });
      
      setEvaluationScores(initialScores);
      setEvaluationPassed(initialPassed);
    }
  }, [selectedEmployee, evaluations]);

  const handleScoreChange = (moduleId: string, score: number) => {
    setEvaluationScores(prev => ({
      ...prev,
      [moduleId]: score
    }));
  };

  const handlePassedChange = (moduleId: string, passed: boolean) => {
    setEvaluationPassed(prev => ({
      ...prev,
      [moduleId]: passed
    }));
  };

  const handleSubmitEvaluation = () => {
    if (!selectedEmployee) return;
    
    const newEvaluations: Evaluation[] = trainingModules.map(module => ({
      id: Date.now().toString() + Math.random(),
      employeeId: selectedEmployee.employeeId,
      moduleId: module.id,
      score: evaluationScores[module.id] || 0,
      passed: evaluationPassed[module.id] || false,
      evaluatedBy: user?.id || '',
      evaluatedAt: new Date().toISOString(),
      comments: ''
    }));
    
    setEvaluations(prev => [...prev, ...newEvaluations]);
    
    // Update employee status
    setEmployees(prev => prev.map(emp => 
      emp.id === selectedEmployee.id 
        ? { ...emp, status: 'evaluated' as const }
        : emp
    ));
    
    alert('ส่งคะแนนประเมินผลเรียบร้อยแล้ว');
  };

  const getModuleStatus = (moduleId: string) => {
    const training = trainingProgress.find(t => t.moduleId === moduleId);
    return training?.status || 'pending';
  };

  const getModuleScore = (moduleId: string) => {
    const evaluation = evaluations.find(evaluation => 
      evaluation.employeeId === selectedEmployee?.employeeId && evaluation.moduleId === moduleId
    );
    return evaluation?.score || 0;
  };

  const getModulePassed = (moduleId: string) => {
    const evaluation = evaluations.find(evaluation => 
      evaluation.employeeId === selectedEmployee?.employeeId && evaluation.moduleId === moduleId
    );
    return evaluation?.passed || false;
  };

  const isModuleCompleted = (moduleId: string) => {
    const training = trainingProgress.find(t => t.moduleId === moduleId);
    return training?.status === 'completed';
  };

  const canEvaluate = () => {
    if (!selectedEmployee) return false;
    return trainingModules.every(module => isModuleCompleted(module.id));
  };

  const isAllEvaluated = () => {
    if (!selectedEmployee) return false;
    return trainingModules.every(module => 
      evaluations.some(evaluation => 
        evaluation.employeeId === selectedEmployee.employeeId && evaluation.moduleId === module.id
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ระบบ On-Boarding</h1>
              <p className="text-gray-600">สวัสดี, {user?.name} (Manager)</p>
            </div>
            <Button variant="outline" onClick={logout}>
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Employees List */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-6">พนักงานที่ต้องประเมินผล</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => {
              const isEvaluated = isAllEvaluated();
              
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
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.status === 'evaluated' ? 'bg-green-100 text-green-800' :
                      employee.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status === 'evaluated' ? 'ประเมินแล้ว' :
                       employee.status === 'completed' ? 'พร้อมประเมิน' :
                       'รอฝึกอบรม'}
                    </span>
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
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Evaluation Form for Selected Employee */}
        {selectedEmployee && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                ประเมินผล - {selectedEmployee.firstName} {selectedEmployee.lastName}
              </h2>
              {!canEvaluate() && (
                <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                  รอการฝึกอบรมเสร็จสิ้น
                </div>
              )}
            </div>

            {canEvaluate() ? (
              <div className="space-y-6">
                {trainingModules.map((module, index) => {
                  const isEvaluated = evaluations.some(evaluation => 
                    evaluation.employeeId === selectedEmployee.employeeId && evaluation.moduleId === module.id
                  );
                  
                  return (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                            {isEvaluated && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                ประเมินแล้ว
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{module.description}</p>
                          <div className="text-sm text-gray-500">
                            คะแนนเต็ม: {module.maxScore}
                          </div>
                        </div>
                      </div>

                      {!isEvaluated && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              คะแนน (0-{module.maxScore})
                            </label>
                            <Input
                              type="number"
                              min="0"
                              max={module.maxScore}
                              value={evaluationScores[module.id] || 0}
                              onChange={(e) => handleScoreChange(module.id, parseInt(e.target.value) || 0)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ผลการประเมิน
                            </label>
                            <div className="flex gap-4">
                              <Button
                                variant={evaluationPassed[module.id] ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => handlePassedChange(module.id, true)}
                              >
                                ผ่าน
                              </Button>
                              <Button
                                variant={!evaluationPassed[module.id] ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => handlePassedChange(module.id, false)}
                              >
                                ไม่ผ่าน
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {isEvaluated && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-green-800 font-medium">
                                คะแนน: {getModuleScore(module.id)}/{module.maxScore}
                              </span>
                              <span className={`ml-4 px-2 py-1 text-xs font-semibold rounded-full ${
                                getModulePassed(module.id) 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {getModulePassed(module.id) ? 'ผ่าน' : 'ไม่ผ่าน'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {!isAllEvaluated() && (
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <Button onClick={handleSubmitEvaluation}>
                      ส่งคะแนนประเมินผล
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">รอการฝึกอบรมเสร็จสิ้น</h3>
                <p className="text-gray-600">
                  พนักงานยังไม่ผ่านการฝึกอบรมครบทุกหลักสูตร กรุณารอให้ Trainer สอนงานเสร็จสิ้นก่อน
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}



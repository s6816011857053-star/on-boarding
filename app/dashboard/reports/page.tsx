'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { mockEmployees, mockEvaluations, getTrainingModulesByPosition, calculateTrainingProgress } from '../../lib/mock-data';
import { Employee, Evaluation } from '../../lib/types';

export default function ReportsPage() {
  const { user, logout } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(mockEvaluations);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');

  useEffect(() => {
    setEmployees(mockEmployees);
    setFilteredEmployees(mockEmployees);
  }, []);

  useEffect(() => {
    let filtered = employees;

    if (selectedDepartment) {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }
    if (selectedBranch) {
      filtered = filtered.filter(emp => emp.branch === selectedBranch);
    }
    if (selectedPosition) {
      filtered = filtered.filter(emp => emp.position === selectedPosition);
    }

    setFilteredEmployees(filtered);
  }, [employees, selectedDepartment, selectedBranch, selectedPosition]);

  const getEmployeeEvaluations = (employeeId: string) => {
    return evaluations.filter(evaluation => evaluation.employeeId === employeeId);
  };

  const getEmployeeAverageScore = (employeeId: string) => {
    const employeeEvals = getEmployeeEvaluations(employeeId);
    if (employeeEvals.length === 0) return 0;
    return employeeEvals.reduce((sum, evaluation) => sum + evaluation.score, 0) / employeeEvals.length;
  };

  const getEmployeePassedModules = (employeeId: string) => {
    const employeeEvals = getEmployeeEvaluations(employeeId);
    return employeeEvals.filter(evaluation => evaluation.passed).length;
  };

  const getTotalModules = (position: string) => {
    const modules = getTrainingModulesByPosition(position);
    return modules.length;
  };

  const getDepartmentStats = () => {
    const stats: {[key: string]: {total: number, evaluated: number, averageScore: number}} = {};
    
    employees.forEach(emp => {
      if (!stats[emp.department]) {
        stats[emp.department] = { total: 0, evaluated: 0, averageScore: 0 };
      }
      stats[emp.department].total++;
      
      const evals = getEmployeeEvaluations(emp.employeeId);
      if (evals.length > 0) {
        stats[emp.department].evaluated++;
        stats[emp.department].averageScore += getEmployeeAverageScore(emp.employeeId);
      }
    });

    // Calculate average scores
    Object.keys(stats).forEach(dept => {
      if (stats[dept].evaluated > 0) {
        stats[dept].averageScore = stats[dept].averageScore / stats[dept].evaluated;
      }
    });

    return stats;
  };

  const getBranchStats = () => {
    const stats: {[key: string]: {total: number, evaluated: number, averageScore: number}} = {};
    
    employees.forEach(emp => {
      if (!stats[emp.branch]) {
        stats[emp.branch] = { total: 0, evaluated: 0, averageScore: 0 };
      }
      stats[emp.branch].total++;
      
      const evals = getEmployeeEvaluations(emp.employeeId);
      if (evals.length > 0) {
        stats[emp.branch].evaluated++;
        stats[emp.branch].averageScore += getEmployeeAverageScore(emp.employeeId);
      }
    });

    // Calculate average scores
    Object.keys(stats).forEach(branch => {
      if (stats[branch].evaluated > 0) {
        stats[branch].averageScore = stats[branch].averageScore / stats[branch].evaluated;
      }
    });

    return stats;
  };

  const departmentStats = getDepartmentStats();
  const branchStats = getBranchStats();

  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  const branches = Array.from(new Set(employees.map(emp => emp.branch)));
  const positions = Array.from(new Set(employees.map(emp => emp.position)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">รายงานผลการประเมิน</h1>
              <p className="text-gray-600">สวัสดี, {user?.name}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
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
                {employees.filter(emp => getEmployeeEvaluations(emp.employeeId).length > 0).length}
              </div>
              <div className="text-gray-600">ประเมินแล้ว</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {employees.filter(emp => getEmployeeEvaluations(emp.employeeId).length === 0).length}
              </div>
              <div className="text-gray-600">ยังไม่ประเมิน</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {evaluations.length > 0 
                  ? (evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length).toFixed(1)
                  : '0'
                }
              </div>
              <div className="text-gray-600">คะแนนเฉลี่ย</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-6">ตัวกรองข้อมูล</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">แผนก</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">ทุกแผนก</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">สาขา</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">ทุกสาขา</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ตำแหน่ง</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              >
                <option value="">ทุกตำแหน่ง</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>
                    {pos === 'server' ? 'พนักงานเสิร์ฟ' : 'ผู้ช่วย Cook'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Department Stats */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-6">สถิติตามแผนก</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    แผนก
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    พนักงานทั้งหมด
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประเมินแล้ว
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    คะแนนเฉลี่ย
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(departmentStats).map(([dept, stats]) => (
                  <tr key={dept}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.evaluated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.averageScore.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Branch Stats */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-6">สถิติตามสาขา</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สาขา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    พนักงานทั้งหมด
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประเมินแล้ว
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    คะแนนเฉลี่ย
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(branchStats).map(([branch, stats]) => (
                  <tr key={branch}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {branch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.evaluated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.averageScore.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Employee Details */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">รายละเอียดพนักงาน</h2>
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
                    ผ่าน/ทั้งหมด
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    คะแนนเฉลี่ย
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => {
                  const passedModules = getEmployeePassedModules(employee.employeeId);
                  const totalModules = getTotalModules(employee.position);
                  const averageScore = getEmployeeAverageScore(employee.employeeId);
                  
                  return (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.position === 'server' ? 'พนักงานเสิร์ฟ' : 'ผู้ช่วย Cook'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {passedModules}/{totalModules}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {averageScore.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}



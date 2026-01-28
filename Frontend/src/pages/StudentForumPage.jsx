import React from 'react';
import Navbar from '../components/StudentDashboard/Navbar';
import { StudentForum } from '../components/StudentForum/StudentForum';

export default function StudentForumPage() {
  return (
    <div className="h-screen bg-[#0a0a0a] overflow-hidden flex flex-col">
      <Navbar userName="Student" />
      <div className="flex-1 pt-14 overflow-hidden">
        <StudentForum />
      </div>
    </div>
  );
}

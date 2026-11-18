'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Plus,
  Shield,
  GraduationCap,
  Award,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  X,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Mail,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSuperAdmin } from '../SuperAdminContext';

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  xpPoints: number;
  courseCount: number;
  createdAt: string;
}

function UserManagementContent() {
  const { language, t } = useLanguage();
  const sa = t.superAdminDashboard;
  const { showToast } = useSuperAdmin();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'USER' | 'ADMIN' | 'SUPER_ADMIN'>('USER');
  const [invitePassword, setInvitePassword] = useState('codepath123');
  const [isInviting, setIsInviting] = useState(false);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/super-admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showToast('Gagal memuat direktori pengguna.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = (u.name || '').toLowerCase();
      const email = u.email.toLowerCase();
      const query = userSearch.toLowerCase();
      const matchesSearch = name.includes(query) || email.includes(query);
      const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  // Role Counts
  const counts = useMemo(() => {
    return {
      total: users.length,
      students: users.filter((u) => u.role === 'USER').length,
      mentors: users.filter((u) => u.role === 'ADMIN').length,
      superAdmins: users.filter((u) => u.role === 'SUPER_ADMIN').length,
    };
  }, [users]);

  // Toggle user status: ACTIVE <-> SUSPENDED
  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      setUpdatingUserId(user.id);
      const res = await fetch(`/api/super-admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
        );
        showToast(
          language === 'id'
            ? `Status akun ${user.name || user.email} diubah menjadi ${nextStatus}`
            : `User account ${user.name || user.email} status changed to ${nextStatus}`
        );
      }
    } catch {
      showToast('Gagal memperbarui status pengguna.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Switch Role
  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN') => {
    try {
      setUpdatingUserId(userId);
      const res = await fetch(`/api/super-admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        showToast(
          language === 'id'
            ? `Hak akses diperbarui menjadi ${newRole}!`
            : `User role updated to ${newRole}!`
        );
      }
    } catch {
      showToast('Gagal mengubah peran pengguna.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Submit Provision New User
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    try {
      setIsInviting(true);
      const res = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          role: inviteRole,
          password: invitePassword,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUsers((prev) => [data.user, ...prev]);
        showToast(
          language === 'id'
            ? `Akun ${inviteName} berhasil diprovisi sebagai ${inviteRole}!`
            : `Account ${inviteName} provisioned successfully as ${inviteRole}!`
        );
        setShowInviteModal(false);
        setInviteName('');
        setInviteEmail('');
        setInviteRole('USER');
      } else {
        showToast(data.message || 'Gagal membuat akun.');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan.');
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] w-full">
      {/* ─── PAGE HEADER ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 text-xs font-mono font-semibold">
            <Zap className="w-3 h-3 text-[#2563EB]" />
            <span>• ACCESS CONTROL & ROLES • RBAC MATRIX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {sa.users.title}
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            {language === 'id'
              ? 'Kelola akun siswa, staf pengajar mentor, hak akses peran, serta aktivasi pengguna platform.'
              : 'Manage student accounts, staff mentors, platform role assignments, and suspension status.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>{language === 'id' ? 'Segarkan' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{sa.users.inviteBtn}</span>
          </button>
        </div>
      </div>

      {/* ─── ROLE COUNTS KPI CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {sa.users.roleUser}
            </span>
            <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{counts.students}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100 shadow-2xs">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {sa.users.roleMentor}
            </span>
            <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{counts.mentors}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {sa.users.roleSuperAdmin} (ROOT)
            </span>
            <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{counts.superAdmins}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shadow-2xs">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </div>

      {/* ─── USERS DIRECTORY TABLE CARD ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder={sa.users.searchPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
              />
            </div>

            <div className="relative">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer"
              >
                <option value="ALL">{sa.users.filterAll}</option>
                <option value="USER">{sa.users.roleUser}</option>
                <option value="ADMIN">{sa.users.roleMentor}</option>
                <option value="SUPER_ADMIN">{sa.users.roleSuperAdmin}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {filteredUsers.length} {language === 'id' ? 'pengguna terdaftar' : 'users found'}
          </span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">{language === 'id' ? 'PENGGUNA' : 'USER'}</th>
                <th className="py-3 px-4">{language === 'id' ? 'PERAN' : 'ROLE'}</th>
                <th className="py-3 px-4">XP</th>
                <th className="py-3 px-4">{language === 'id' ? 'KURSUS' : 'COURSES'}</th>
                <th className="py-3 px-4">{language === 'id' ? 'STATUS' : 'STATUS'}</th>
                <th className="py-3 px-4 text-right">{language === 'id' ? 'AKSI' : 'ACTIONS'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2563EB]" />
                    <p>{language === 'id' ? 'Memuat data pengguna...' : 'Loading user directory...'}</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="font-bold text-slate-700">Tidak ada pengguna ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter peran.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isBusy = updatingUserId === u.id;
                  const initials = (u.name || u.email)
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* User Info */}
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-[#0F172A] text-xs">{u.name || 'Anonymous Learner'}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Current Role (Dropdown to switch) */}
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          disabled={isBusy}
                          onChange={(e) =>
                            handleRoleChange(
                              u.id,
                              e.target.value as 'USER' | 'ADMIN' | 'SUPER_ADMIN'
                            )
                          }
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer disabled:opacity-50"
                        >
                          <option value="USER">{sa.users.roleUser}</option>
                          <option value="ADMIN">{sa.users.roleMentor}</option>
                          <option value="SUPER_ADMIN">{sa.users.roleSuperAdmin}</option>
                        </select>
                      </td>

                      {/* XP Points */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                        {u.xpPoints.toLocaleString('id-ID')} XP
                      </td>

                      {/* Enrolled Courses Count */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {u.courseCount} {language === 'id' ? 'kursus' : 'courses'}
                      </td>

                      {/* Account Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isBusy}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer disabled:opacity-50 ${
                            u.status === 'ACTIVE'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {isBusy ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : u.status === 'ACTIVE' ? (
                            <ToggleLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ToggleRight className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {u.status === 'ACTIVE'
                              ? language === 'id'
                                ? 'Tangguhkan'
                                : 'Suspend'
                              : language === 'id'
                              ? 'Aktifkan'
                              : 'Reactivate'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL: PROVISION NEW USER ─── */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 relative"
            >
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">
                    {sa.users.inviteBtn}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Provision new platform account with instant database privileges.
                  </p>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInviteUser} className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Dr. Budi Santoso"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="budi@codepath.org"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Platform Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) =>
                        setInviteRole(e.target.value as 'USER' | 'ADMIN' | 'SUPER_ADMIN')
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer"
                    >
                      <option value="USER">{sa.users.roleUser}</option>
                      <option value="ADMIN">{sa.users.roleMentor}</option>
                      <option value="SUPER_ADMIN">{sa.users.roleSuperAdmin}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Temp Password
                    </label>
                    <input
                      required
                      value={invitePassword}
                      onChange={(e) => setInvitePassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isInviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Provision Account</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function UserManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading user directory...</div>}>
      <UserManagementContent />
    </Suspense>
  );
}


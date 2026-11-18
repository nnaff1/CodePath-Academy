'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials?: string;
}

interface SuperAdminContextType {
  superAdmin: SuperAdminUser | null;
  pendingApprovals: number;
  setPendingApprovals: (count: number) => void;
  isMaintenanceMode: boolean;
  setIsMaintenanceMode: (val: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  refreshOverview: () => Promise<void>;
}

export const SuperAdminContext = createContext<SuperAdminContextType | null>(null);

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  return context;
}

export function SuperAdminProvider({ children }: { children: React.ReactNode }) {
  const [superAdmin, setSuperAdmin] = useState<SuperAdminUser | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const refreshOverview = useCallback(async () => {
    try {
      const res = await fetch('/api/super-admin/overview');
      const data = await res.json();
      if (data.success) {
        if (data.superAdmin) {
          const initials = (data.superAdmin.name || 'AW')
            .split(' ')
            .slice(0, 2)
            .map((w: string) => w[0])
            .join('')
            .toUpperCase();
          setSuperAdmin({ ...data.superAdmin, initials });
        }
        if (typeof data.kpis?.pendingApprovals === 'number') {
          setPendingApprovals(data.kpis.pendingApprovals);
        }
        if (typeof data.system?.maintenanceMode === 'boolean') {
          setIsMaintenanceMode(data.system.maintenanceMode);
        }
      }
    } catch (err) {
      console.error('Failed to fetch super admin overview:', err);
    }
  }, []);

  useEffect(() => {
    refreshOverview();
  }, [refreshOverview]);

  return (
    <SuperAdminContext.Provider
      value={{
        superAdmin,
        pendingApprovals,
        setPendingApprovals,
        isMaintenanceMode,
        setIsMaintenanceMode,
        toastMessage,
        showToast,
        refreshOverview,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
}

'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type SidebarContextValue = {
  visible: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [visible, setVisible] = useState<boolean>(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);
  const toggle = useCallback(() => setVisible(v => !v), []);

  const value = useMemo<SidebarContextValue>(
    () => ({ visible, open, close, toggle }),
    [visible, open, close, toggle]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

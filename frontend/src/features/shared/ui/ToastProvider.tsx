import { Toaster } from 'react-hot-toast';
import React from 'react';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0f172a',
          color: '#f1f5f9',
          border: '1px solid #1e293b',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#f1f5f9' },
          style: { background: '#042f2e', border: '1px solid #0d9488', color: '#f0fdfa' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fef2f2' },
          style: { background: '#450a0a', border: '1px solid #dc2626', color: '#fee2e2' },
        },
      }}
      gutter={10}
      containerStyle={{
        top: 12,
        right: 12,
      }}
    />
  );
}

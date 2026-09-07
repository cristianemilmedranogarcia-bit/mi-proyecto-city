'use client';

import React from 'react';
import PostJobForm from '@/app/post/job/PostJobForm';

interface EditJobModalProps {
  job: any;
  user: any;
  categories: any[];
  businesses: any[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedJob: any) => void;
  onDelete: (deletedJobId: string) => void;
}

export default function EditJobModal({
  job,
  user,
  categories,
  businesses,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: EditJobModalProps) {
  if (!isOpen || !job) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, padding: '1.5rem 1rem' }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          width: '100%',
          maxHeight: '94vh',
          overflowY: 'auto',
          padding: '0.5rem',
          borderRadius: '24px',
          backgroundColor: '#F8FAF9',
        }}
      >
        <PostJobForm
          user={user}
          categories={categories}
          businesses={businesses}
          initialJob={job}
          onSave={(updatedJob) => {
            onUpdate(updatedJob);
            onClose();
          }}
          onDelete={(jobId) => {
            onDelete(jobId);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

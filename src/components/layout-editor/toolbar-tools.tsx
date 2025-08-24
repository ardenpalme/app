import { observer } from 'mobx-react-lite';
import { Button } from '@blueprintjs/core';
import { Input } from "@/components/ui/input"
import { ToolbarProps } from '@/lib/type';
import React from 'react';

export const ToolbarTools = ({ store, uploadDesign, onRefresh} : ToolbarProps) => {
  const [isSaving, setSaving] = React.useState(false);
  const handleSave = async() => {
    try {
      setSaving(true)
      await uploadDesign(store)
      await onRefresh();
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Button
        intent="primary"
        onClick={handleSave}
        loading={isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

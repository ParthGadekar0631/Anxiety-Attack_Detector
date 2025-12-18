"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { AnxietyCheckinPayload } from '@/types/api';

const checkinSchema = z.object({
  anxietyLevel: z
    .number({ required_error: 'Anxiety level is required' })
    .min(0, 'Minimum value is 0')
    .max(10, 'Maximum value is 10'),
  notes: z.string().max(1000, 'Notes are limited to 1000 characters').optional(),
});

type CheckinFormValues = z.infer<typeof checkinSchema>;

interface AnxietyCheckinFormProps {
  onSubmit: (payload: AnxietyCheckinPayload) => Promise<void> | void;
  loading?: boolean;
}

export function AnxietyCheckinForm({ onSubmit, loading }: AnxietyCheckinFormProps) {
  const { register, handleSubmit, formState, reset } = useForm<CheckinFormValues>({
    resolver: zodResolver(checkinSchema),
    defaultValues: { anxietyLevel: 5 },
  });
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [coping, setCoping] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [triggerInput, setTriggerInput] = useState('');
  const [copingInput, setCopingInput] = useState('');

  const addTag = (type: 'symptom' | 'trigger' | 'coping') => {
    const currentValue =
      type === 'symptom' ? symptomInput : type === 'trigger' ? triggerInput : copingInput;
    if (!currentValue.trim()) return;
    const newValue = currentValue.trim();
    const setter = type === 'symptom' ? setSymptoms : type === 'trigger' ? setTriggers : setCoping;
    const list = type === 'symptom' ? symptoms : type === 'trigger' ? triggers : coping;
    if (!list.includes(newValue)) {
      setter([...list, newValue]);
    }
    if (type === 'symptom') setSymptomInput('');
    if (type === 'trigger') setTriggerInput('');
    if (type === 'coping') setCopingInput('');
  };

  const removeTag = (type: 'symptom' | 'trigger' | 'coping', value: string) => {
    const setter = type === 'symptom' ? setSymptoms : type === 'trigger' ? setTriggers : setCoping;
    const list = type === 'symptom' ? symptoms : type === 'trigger' ? triggers : coping;
    setter(list.filter((item) => item !== value));
  };

  const submitForm = handleSubmit(async (values) => {
    await onSubmit({
      anxietyLevel: values.anxietyLevel,
      notes: values.notes,
      symptoms,
      triggers,
      copingMechanisms: coping,
    });
    reset();
    setSymptoms([]);
    setTriggers([]);
    setCoping([]);
  });

  return (
    <form onSubmit={submitForm} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Anxiety level (0-10)</label>
        <Input type="number" step="0.1" min={0} max={10} {...register('anxietyLevel', { valueAsNumber: true })} />
        {formState.errors.anxietyLevel && <p className="mt-1 text-sm text-danger">{formState.errors.anxietyLevel.message}</p>}
      </div>

      <TagInput
        label="Symptoms"
        placeholder="Add a symptom"
        values={symptoms}
        currentValue={symptomInput}
        onChange={setSymptomInput}
        onAdd={() => addTag('symptom')}
        onRemove={(value) => removeTag('symptom', value)}
      />

      <TagInput
        label="Triggers"
        placeholder="Add a trigger"
        values={triggers}
        currentValue={triggerInput}
        onChange={setTriggerInput}
        onAdd={() => addTag('trigger')}
        onRemove={(value) => removeTag('trigger', value)}
      />

      <TagInput
        label="Coping mechanisms"
        placeholder="Add coping mechanism"
        values={coping}
        currentValue={copingInput}
        onChange={setCopingInput}
        onAdd={() => addTag('coping')}
        onRemove={(value) => removeTag('coping', value)}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
        <Textarea rows={4} {...register('notes')} placeholder="Add context about your day, triggers, and coping actions" />
        {formState.errors.notes && <p className="mt-1 text-sm text-danger">{formState.errors.notes.message}</p>}
      </div>

      <Button type="submit" className="w-full" isLoading={loading}>
        Submit check-in
      </Button>
    </form>
  );
}

interface TagInputProps {
  label: string;
  placeholder: string;
  values: string[];
  currentValue: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (value: string) => void;
}

function TagInput({ label, placeholder, values, currentValue, onChange, onAdd, onRemove }: TagInputProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex gap-2">
        <Input value={currentValue} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
        <Button type="button" variant="outline" onClick={onAdd}>
          Add
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span key={value} className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {value}
            <button type="button" className="ml-2 text-slate-500 hover:text-danger" onClick={() => onRemove(value)}>
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

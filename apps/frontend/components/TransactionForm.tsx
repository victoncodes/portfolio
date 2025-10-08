"use client";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const schema = z.object({
  type: z.enum(['income', 'expense', 'savings']),
  amount: z.coerce.number().int().positive(),
  category: z.string().min(1),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function TransactionForm() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { type: 'expense' } });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      const prev = queryClient.getQueryData<any>(['transactions']);
      queryClient.setQueryData(['transactions'], (old: any) => {
        const optimistic = { id: `temp-${Date.now()}`, ...values, date: new Date().toISOString() };
        return { items: [optimistic, ...(old?.items ?? [])] };
      });
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['transactions'], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      reset();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
      className="grid gap-3 p-4 bg-slate-800/50 rounded-lg border border-white/10"
    >
      <div className="grid grid-cols-3 gap-2">
        <select className="bg-slate-900 p-2 rounded" {...register('type')}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="savings">Savings</option>
        </select>
        <input className="bg-slate-900 p-2 rounded" placeholder="Amount (kobo)" {...register('amount')} />
        <input className="bg-slate-900 p-2 rounded" placeholder="Category" {...register('category')} />
      </div>
      <input className="bg-slate-900 p-2 rounded" placeholder="Notes (optional)" {...register('notes')} />
      {Object.values(errors).length > 0 && (
        <p className="text-red-400 text-sm">Please fix the highlighted errors.</p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium px-4 py-2 rounded"
      >
        {isSubmitting ? 'Adding…' : 'Add Transaction'}
      </button>
    </form>
  );
}

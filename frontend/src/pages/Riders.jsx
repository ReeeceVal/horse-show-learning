import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listRiders, createRider } from '../api/riders';

export default function Riders() {
    const queryClient = useQueryClient();

    // 1) Query: read riders
    const { data: riders, isLoading, isError } = useQuery({
        queryKey: ['riders'],
        queryFn: listRiders,
    });

    // 2) Mutation: create rider + invalidate cache
    const { mutateAsync, isPending: isSaving } = useMutation({
        mutationFn: createRider,
        onSuccess: () => {
            // Force refetch of riders list so UI shows the new rider
            queryClient.invalidateQueries({ queryKey: ['riders'] });
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm({
        defaultValues: {
            full_name: '',
            email: '',
            phone: '',
            experience: 'beginner',
            agree: false,
        },
        mode: 'onTouched',
    });

    const watchName = watch('full_name');

    async function onSubmit(values) {
        // prepare payload for server (exclude local-only fields)
        const payload = {
            full_name: values.full_name,
            email: values.email || null,
            experience: values.experience,
            phone: values.phone || null,
        };
        await mutateAsync(payload);
        reset({ ...values, full_name: '' });
    }

    return (
        <section className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FORM */}
            <div>
                <h1 className="text-xl font-semibold mb-4">Add Rider</h1>
                <div className="text-sm text-slate-600 mb-2">
                    Typing name: <span className="font-medium">{watchName || '—'}</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
                    <div>
                        <label className="block text-sm mb-1">Full name *</label>
                        <input
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="e.g. Sam Greeff"
                            {...register('full_name', {
                                required: 'Full name is required',
                                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                            })}
                        />
                        {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Email (optional)</label>
                        <input
                            type="email"
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="sam@example.com"
                            {...register('email', {
                                validate: (v) => !v || /^\S+@\S+\.\S+$/.test(v) || 'Please enter a valid email',
                            })}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Phone (optional)</label>
                        <input
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="+27 82 123 4567"
                            {...register('phone', {
                                validate: (v) => !v || /^[0-9+\-() ]{7,}$/.test(v) || 'Please enter a valid phone number',
                            })}
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Experience *</label>
                        <select
                            className="w-full rounded-md border px-3 py-2 bg-white"
                            {...register('experience', { required: true })}
                        >
                            <option value="beginner">Beginner</option>
                            <option value="novice">Novice</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="open">Open</option>
                            <option value="pro">Pro</option>
                        </select>
                        {errors.experience && <p className="mt-1 text-sm text-red-600">Please select a level</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="agree"
                            type="checkbox"
                            className="h-4 w-4"
                            {...register('agree', { required: 'Please confirm consent' })}
                        />
                        <label htmlFor="agree" className="text-sm">I confirm the details are correct *</label>
                    </div>
                    {errors.agree && <p className="mt-1 text-sm text-red-600">{errors.agree.message}</p>}

                    <div className="flex items-center gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || isSaving}
                            className="rounded-md bg-slate-900 text-white px-4 py-2 hover:bg-slate-800 disabled:opacity-60"
                        >
                            {isSubmitting || isSaving ? 'Saving…' : 'Save rider'}
                        </button>
                        <button
                            type="button"
                            className="rounded-md border px-3 py-2 hover:bg-slate-100"
                            onClick={() => reset()}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {/* LIST */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Riders</h2>

                {isLoading && <div className="text-slate-600">Loading riders…</div>}
                {isError && <div className="text-red-600">Failed to load riders.</div>}

                {!isLoading && !isError && (
                    <ul className="divide-y rounded-xl border bg-white shadow-sm">
                        {riders?.map(r => (
                            <li key={r.id} className="p-3 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{r.full_name}</div>
                                    <div className="text-xs text-slate-600">
                                        {r.email || 'no email'} • {r.experience}
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500">#{r.id}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

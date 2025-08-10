import { z } from 'zod';

/** Common route param schema */
export const IdParam = z.object({
    id: z.coerce.number().int().positive(),
});

/** Bodies */
export const RiderCreate = z.object({
    full_name: z.string().min(1, 'full_name required'),
    phone: z.string().trim().optional().or(z.literal('').transform(() => undefined)),
    email: z.string().email('invalid email').optional(),
});

export const HorseCreate = z.object({
    name: z.string().min(1, 'name required'),
    owner_name: z.string().optional(),
});

export const ClassCreate = z.object({
    name: z.string().min(1, 'name required'),
    category: z.string().optional(),
    max_entries: z.number().int().nonnegative().optional(),
});

export const EntryCreate = z.object({
    rider_id: z.coerce.number().int().positive(),
    horse_id: z.coerce.number().int().positive(),
    class_ids: z.array(z.coerce.number().int().positive()).optional().default([]),
});

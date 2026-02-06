import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

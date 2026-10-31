import { z } from "zod";

export function sanitizeText(s: string) {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s{3,}/g, "  ")
    .trim();
}

export const reviewInputSchema = z.object({
  display_name: z.string().trim().min(2, "Informe um nome com pelo menos 2 letras.").max(60, "Use no máximo 60 caracteres."),
  rating: z.number().int().min(1, "Escolha uma nota de 1 a 5.").max(5, "Escolha uma nota de 1 a 5."),
  comment: z.string().trim().min(10, "Escreva pelo menos 10 caracteres.").max(1000, "Use no máximo 1000 caracteres."),
  consent_to_publish: z.literal(true, { errorMap: () => ({ message: "É preciso autorizar a publicação." }) }),
});

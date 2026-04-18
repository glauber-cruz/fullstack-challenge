import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export type GetWalletMeResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export const GetWalletMeSchema = z.object({
  id: z.string(),
  createdAt: z.string().transform((s) => new Date(s)),
  updatedAt: z.string().transform((s) => new Date(s)),
});

export class GetWalletMeResponseDto extends createZodDto(GetWalletMeSchema) {}

export class GetWalletMePresentation {
  static toHTTP(wallet: GetWalletMeResponse) {
    return GetWalletMeSchema.parse(wallet);
  }
}

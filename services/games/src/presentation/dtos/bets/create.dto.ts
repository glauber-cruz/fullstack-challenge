import { createZodDto } from "nestjs-zod";
import z from "zod";

export type CreateBetResponse = {
  id: string;
};

export const CreateBetSchema = z.object({
  id: z.string(),
});

export class CreateBetResponseDto extends createZodDto(CreateBetSchema) {}

export class CreateBetPresentation {
  static toHTTP(bet: CreateBetResponse) {
    return CreateBetSchema.parse(bet);
  }
}

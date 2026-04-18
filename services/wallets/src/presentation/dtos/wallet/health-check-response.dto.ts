import { createZodDto } from "nestjs-zod";
import z from "zod";

export const HealthCheckResponseSchema = z.object({
  status: z.string(),
  service: z.string(),
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

export class HealthCheckResponseDto extends createZodDto(
  HealthCheckResponseSchema,
) {}

export class HealthCheckPresentation {
  static toHTTP(): HealthCheckResponse {
    return HealthCheckResponseSchema.parse({
      status: "ok",
      service: "wallets",
    });
  }
}

import { KeycloakService } from "../keycloack";

type CreateBetInput = {
  amountInCents: number;
  roundId: string;
};

export class GameService {
  constructor(private readonly keycloakService: KeycloakService) {}
  private readonly baseUrl = process.env.NEXT_PUBLIC_GAMES_URL;

  async getAccessToken() {
    const valid = await this.keycloakService.ensureValidToken();
    if (!valid) throw new Error("Invalid token");
    const token = this.keycloakService.getAccessToken();
    return token;
  }

  async createBet(input: CreateBetInput) {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/bets`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to create bet");

    return response.json();
  }
}

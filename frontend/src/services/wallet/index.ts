import { KeycloakService } from "../keycloack";

type GetMeResponse = {
  id: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
};

export class WalletService {
  constructor(private readonly keycloakService: KeycloakService) {}
  private readonly baseUrl = process.env.NEXT_PUBLIC_WALLETS_URL;

  async getAccessToken() {
    const valid = await this.keycloakService.ensureValidToken();
    if (!valid) throw new Error("Invalid token");
    const token = this.keycloakService.getAccessToken();
    return token;
  }

  async getMe(): Promise<GetMeResponse> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to get me");

    return response.json();
  }
}

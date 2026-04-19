// Num vai dar tempo de fazer isso no backend do next pra usar httpOnly cookies 
// então tô fazendo usando o localstorage mermo kakaka feio mas é o que tem pra hoje T-T
export class KeycloakService {
  async generateLoginUrl() {
    const { codeVerifier, codeChallenge } = await this.generatePKCE();
    localStorage.setItem("code_verifier", codeVerifier);

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
      response_type: "code",
      scope: "openid profile email",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });
    return `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/auth?${params.toString()}`;
  }

  private async generatePKCE() {
    const encoder = new TextEncoder();

    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const codeVerifier = btoa(String.fromCharCode(...randomBytes))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const data = encoder.encode(codeVerifier);
    const hash = await crypto.subtle.digest("SHA-256", data);

    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return { codeVerifier, codeChallenge };
  }

  async getTokens(code: string) {
    const codeVerifier = localStorage.getItem("code_verifier");
    if (!codeVerifier) throw new Error("Code verifier not found");

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
      code_verifier: codeVerifier,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description);
    }

    const data = await response.json();

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    localStorage.removeItem("code_verifier");
  }
}

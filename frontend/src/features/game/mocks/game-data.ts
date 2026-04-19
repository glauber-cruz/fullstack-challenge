export type BetStatus = "Ganhou" | "Perdeu";

export type Bet = {
  username: string;
  amount: string;
  status: BetStatus;
};

export const mockBets: Bet[] = [
  { username: "glauber", amount: "R$ 25,00", status: "Ganhou" },
  { username: "ana", amount: "R$ 15,00", status: "Perdeu" },
  { username: "felipe", amount: "R$ 40,00", status: "Ganhou" },
  { username: "maria", amount: "R$ 10,00", status: "Perdeu" },
];

export const mockHistory = ["1.12x", "3.45x", "1.98x", "7.31x", "2.21x", "1.04x"];

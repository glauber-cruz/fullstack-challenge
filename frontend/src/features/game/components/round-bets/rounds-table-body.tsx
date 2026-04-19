import type { Bet } from "@/src/features/game/mocks/game-data";
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/src/shared/components/ui/table";

type RoundsTableBodyProps = {
  bets: Bet[];
};

export function RoundsTableBody({ bets }: RoundsTableBodyProps) {
  return (
    <TableBody>
      {bets.map((bet) => (
        <TableRow
          key={`${bet.username}-${bet.amount}`}
          className="border-white/10"
        >
          <TableCell className="px-3 py-2">{bet.username}</TableCell>
          <TableCell className="px-3 py-2">{bet.amount}</TableCell>
          <TableCell className="px-3 py-2">
            <span
              className={
                bet.status === "Ganhou"
                  ? "font-semibold text-emerald-300"
                  : "font-semibold text-rose-300"
              }
            >
              {bet.status}
            </span>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

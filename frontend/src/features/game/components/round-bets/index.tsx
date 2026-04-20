import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { Table } from "@/src/shared/components/ui/table";
import { RoundsTableHeader } from "@/src/features/game/components/round-bets/rounds-table-header";
import { RoundsTableBody } from "@/src/features/game/components/round-bets/rounds-table-body";
import { betsCreatedPayload } from "../../hooks/use-game-events";

type BetsTableProps = {
  bets: betsCreatedPayload[];
};

export function BetsTable({ bets }: BetsTableProps) {
  return (
    <Card className="border-white/10 bg-white/5 py-0 shadow-2xl backdrop-blur">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-white">Apostas da Rodada</CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        <Table className="text-slate-200">
          <RoundsTableHeader />
          <RoundsTableBody bets={bets} />
        </Table>
      </CardContent>
    </Card>
  );
}

import type { BetsRepository } from "@/domain/repositories/bets.repository";
import { betsRepositoryToken } from "@/domain/repositories/bets.repository";

import type { RoundsRepository } from "@/domain/repositories/rounds.repository";
import { roundsRepositoryToken } from "@/domain/repositories/rounds.repository";

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { KeycloakUser } from "@/infrastructure/types/keycloack";

import { firstValueFrom } from "rxjs";
import { GetOrCreateUserService } from "../../services/get-or-create-user.service";

import { Bet } from "@/domain/entites/bets.entity";
import { RoundStatus } from "@/domain/enums/rounds";

import { Amount } from "@/domain/value-object/amount";
import { EventBusService } from "@/application/events/event-bus.service";

type CreateBetInput = {
  user: KeycloakUser;
  roundId: string;
  amountInCents: number;
};

@Injectable()
export class CreateBetUseCase {
  constructor(
    @Inject(betsRepositoryToken)
    private readonly betsRepository: BetsRepository,
    @Inject(roundsRepositoryToken)
    private readonly roundsRepository: RoundsRepository,
    private readonly getOrCreateUserService: GetOrCreateUserService,
    private readonly eventBus: EventBusService,
    @Inject("WALLETS_RMQ_CLIENT")
    private readonly walletsClient: ClientProxy,
  ) {}

  async execute(input: CreateBetInput) {
    const round = await this.roundsRepository.findById(input.roundId);
    if (!round) throw new NotFoundException("Round not found");

    if (round.status !== RoundStatus.PENDING)
      throw new BadRequestException("Round is not pending to accept bets");

    let amount: Amount;

    try {
      amount = Amount.create(input.amountInCents);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const user = await this.getOrCreateUserService.execute(input.user);
    const bet = Bet.create({ userId: user.id, roundId: round.id, amount });

    await this.betsRepository.create(bet);
    await firstValueFrom(
      this.walletsClient.send("validate_bet_intent", {
        userId: user.id,
        intendedSpendInCents: amount.cents,
      }),
    );

    this.eventBus.emit("bets:created", {
      id: bet.id,
      userId: user.id,
      username: user.name,
      status: RoundStatus.PENDING,
      roundId: round.id,
      amount: amount.toReais().toString(),
    });
  }
}

import { Methods, Context } from "./.rtag/methods";
import { UserData, Response } from "./.rtag/base";
import {
  PlayerState,
  ICreateGameRequest,
  IJoinGameRequest,
  IStartGameRequest,
  IRollDiceRequest,
  IBuyPropertyRequest,
  IEndTurnRequest,
  IProposeTradeRequest,
  TurnStatus,
  PropertyTile,
} from "./.rtag/types";

export class Impl implements Methods<PlayerState> {
  createGame(user: UserData, ctx: Context, request: ICreateGameRequest): PlayerState {
    return {
      players: [{ name: user.name, money: 1500, position: 0 }],
      board: [...initialBoard],
      turn: user.name,
      status: TurnStatus.LOBBY,
    };
  }
  joinGame(state: PlayerState, user: UserData, ctx: Context, request: IJoinGameRequest): Response {
    if (state.players.find((p) => p.name === user.name) !== undefined) {
      return Response.error("Already joined");
    }
    if (state.status !== TurnStatus.LOBBY) {
      return Response.error("Already started");
    }
    state.players.push({ name: user.name, money: 1500, position: 0 });
    return Response.ok();
  }
  startGame(state: PlayerState, user: UserData, ctx: Context, request: IStartGameRequest): Response {
    if (state.status !== TurnStatus.LOBBY) {
      return Response.error("Already started");
    }
    state.status = TurnStatus.WAITING_FOR_ROLL;
    return Response.ok();
  }
  rollDice(state: PlayerState, user: UserData, ctx: Context, request: IRollDiceRequest): Response {
    if (state.turn !== user.name) {
      return Response.error("Not your turn");
    }
    if (state.roll !== undefined && state.roll.roll1 !== state.roll.roll2) {
      return Response.error("Already rolled");
    }
    const playerIdx = state.players.findIndex((p) => p.name === user.name);
    const player = state.players[playerIdx];
    state.roll = { roll1: ctx.randInt(6) + 1, roll2: ctx.randInt(6) + 1 };
    player.position += state.roll.roll1 + state.roll.roll2;
    return Response.ok();
  }
  buyProperty(state: PlayerState, user: UserData, ctx: Context, request: IBuyPropertyRequest): Response {
    if (state.turn !== user.name) {
      return Response.error("Not your turn");
    }
    if (state.roll === undefined) {
      return Response.error("Roll first");
    }
    const playerIdx = state.players.findIndex((p) => p.name === user.name);
    const player = state.players[playerIdx];
    const tile = state.board[player.position];
    if (tile.owner !== undefined) {
      return Response.error("Already bought");
    }
    player.money -= tile.price;
    tile.owner = user.name;
    return Response.ok();
  }
  endTurn(state: PlayerState, user: UserData, ctx: Context, request: IEndTurnRequest): Response {
    if (state.turn !== user.name) {
      return Response.error("Not your turn");
    }
    if (state.roll === undefined || state.roll.roll1 === state.roll.roll2) {
      return Response.error("Roll first");
    }
    const playerIdx = state.players.findIndex((p) => p.name === user.name);
    state.turn = state.players[(playerIdx + 1) % state.players.length].name;
    state.roll = undefined;
    return Response.ok();
  }
  proposeTrade(state: PlayerState, user: UserData, ctx: Context, request: IProposeTradeRequest): Response {
    return Response.error("Not implemented");
  }
  getUserState(state: PlayerState, user: UserData): PlayerState {
    return state;
  }
}

const initialBoard: PropertyTile[] = [
  {
    color: "purple",
    name: "Mediterranean Avenue",
    price: 60,
    rent: 2,
  },
  {
    color: "purple",
    name: "Baltic Avenue",
    price: 60,
    rent: 4,
  },
  {
    color: "cyan",
    name: "Oriental Avenue",
    price: 100,
    rent: 6,
  },
  {
    color: "cyan",
    name: "Vermont Avenue",
    price: 100,
    rent: 6,
  },
  {
    color: "cyan",
    name: "Connecticut Avenue",
    price: 120,
    rent: 8,
  },
  {
    color: "magenta",
    name: "St. Charles Place",
    price: 140,
    rent: 10,
  },
  {
    color: "magenta",
    name: "States Avenue",
    price: 140,
    rent: 10,
  },
  {
    color: "magenta",
    name: "Virginia Avenue",
    price: 160,
    rent: 12,
  },
  {
    color: "orange",
    name: "St. James Place",
    price: 180,
    rent: 14,
  },
  {
    color: "orange",
    name: "Tennessee Avenue",
    price: 180,
    rent: 14,
  },
  {
    color: "orange",
    name: "New York Avenue",
    price: 200,
    rent: 16,
  },
  {
    color: "red",
    name: "Kentucky Avenue",
    price: 220,
    rent: 18,
  },
  {
    color: "red",
    name: "Indiana Avenue",
    price: 220,
    rent: 18,
  },
  {
    color: "red",
    name: "Illinois Avenue",
    price: 240,
    rent: 20,
  },
  {
    color: "yellow",
    name: "Atlantic Avenue",
    price: 260,
    rent: 22,
  },
  {
    color: "yellow",
    name: "Ventnor Avenue",
    price: 260,
    rent: 22,
  },
  {
    color: "yellow",
    name: "Marvin Gardens",
    price: 280,
    rent: 24,
  },
  {
    color: "green",
    name: "Pacific Avenue",
    price: 300,
    rent: 26,
  },
  {
    color: "green",
    name: "North Carolina Avenue",
    price: 300,
    rent: 26,
  },
  {
    color: "green",
    name: "Pennsylvania Avenue",
    price: 320,
    rent: 28,
  },
  {
    color: "blue",
    name: "Park Place",
    price: 350,
    rent: 35,
  },
  {
    color: "blue",
    name: "Boardwalk",
    price: 400,
    rent: 50,
  },
];

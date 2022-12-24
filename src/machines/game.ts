import { assign, createMachine } from "xstate";

const options = [
  {
    imgUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/066.png",
    answer: "Machop",
    options: ["Machop", "Graveler", "Gastly"],
  },
  {
    imgUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/063.png",
    answer: "Abra",
    options: ["Golbat", "Bellsprout", "Abra"],
  },
  {
    imgUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/197.png",
    answer: "Umbreon",
    options: ["Umbreon", "Vaporeon", "Vulpix"],
  },
  {
    imgUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/019.png",
    answer: "Rattata",
    options: ["Goldeen", "Rattata", "Slowpoke"],
  },
  {
    imgUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/095.png",
    answer: "Onix",
    options: ["Hitmonchan", "Muk", "Onix"],
  },
];

export interface GameContext {
  round: number;
  score: number;
}

export type MetaTypes = typeof options;

export const gameMachine = createMachine(
  {
    id: "game",
    initial: "iddle",
    tsTypes: {} as import("./game.typegen").Typegen0,
    schema: {
      context: {} as GameContext,
      events: {} as
        | {
            type: "START" | "NEXT" | "RESTART";
          }
        | {
            type: "GUESS";
            payload: {
              correct: boolean;
            };
          },
    },
    context: {
      round: 1,
      score: 0,
    },
    states: {
      iddle: {
        on: {
          START: "playing",
        },
      },
      playing: {
        meta: {
          options,
        },
        initial: "guessing",
        states: {
          guessing: {
            entry: "playSound",
            on: {
              GUESS: {
                target: "result",
                actions: "setScore",
              },
            },
          },
          result: {
            on: {
              NEXT: [
                {
                  target: "guessing",
                  cond: (context) => context.round < 5,
                  actions: "setRound",
                },
                {
                  target: "end",
                },
              ],
            },
          },
          end: {
            type: "final",
          },
        },
        onDone: "finished",
      },
      finished: {
        on: {
          RESTART: {
            target: "iddle",
            actions: "reset",
          },
        },
      },
    },
  },
  {
    actions: {
      playSound: () => {
        const audio = document.getElementById("audio");

        (audio as HTMLAudioElement)?.play();
      },
      setScore: assign({
        score: (context, event) => {
          return context.score + (event.payload.correct ? 1 : 0);
        },
      }),
      setRound: assign({
        round: (context) => context.round + 1,
      }),
      reset: assign({
        round: 1,
        score: 0,
      }),
    },
  }
);

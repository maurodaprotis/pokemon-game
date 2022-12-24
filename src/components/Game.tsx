import { useMachine } from "@xstate/react";
import clsx from "clsx";
import Image from "next/image";
import { HtmlHTMLAttributes } from "react";
import { GameContext, gameMachine, MetaTypes } from "../machines/game";

const Button = (props: HtmlHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="py-4 px-8 bg-gradient-to-r from-red-500 to-orange-600 text-2xl rounded-sm text-pokemon text-yellow-400 shadow-md"
      {...props}
    />
  );
};

const Welcome = ({ onSubmit }: { onSubmit: () => void }) => (
  <div className="flex flex-col items-center text-center h-full justify-center space-y-4">
    <h1 className="text-3xl">
      Prueba que eres un Maestro Pokemon para descubrir tu Secret Santa
    </h1>
    <button
      className="py-4 px-8 bg-gradient-to-r from-red-500 to-orange-600 text-2xl rounded-sm text-pokemon text-yellow-400 shadow-md"
      onClick={onSubmit}
    >
      Comenzar
    </button>
    <div className="">
      <p className="mt-28">Puedes jugar en Familia</p>
    </div>
  </div>
);

const Playing = ({
  onSubmit,
  meta,
  ctx,
  current,
  send,
}: {
  onSubmit: (result: boolean) => void;
  ctx: GameContext;
  meta: MetaTypes;
  current: any;
  send: any;
}) => {
  const isGuessing = current.matches("playing.guessing");
  const question = meta[ctx.round - 1];
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="basis-2/4 h-full w-full relative">
        {meta.map((q, idx) => {
          const isCurrent = idx === ctx.round - 1;

          return (
            <Image
              key={q.imgUrl}
              className={clsx(
                "w-full h-full transition-all delay-200 duration-1000",
                {
                  hidden: !isCurrent,
                  block: isCurrent,
                  "brightness-0": isGuessing,
                }
              )}
              src={q.imgUrl}
              alt="A pokemon!"
              width={390}
              height={390}
            />
          );
        })}
      </div>
      <h3 className="text-xl mt-2">¿Quién es ese pokémon?</h3>
      {isGuessing && (
        <div className="basis-2/4 space-y-2">
          {question.options.map((opt, idx) => (
            <button
              key={opt}
              className="w-full py-3 px-8 bg-gradient-to-r from-red-500 to-orange-600 text-2xl rounded-sm text-pokemon text-yellow-400 shadow-md"
              onClick={() => onSubmit(opt === question.answer)}
            >
              {idx + 1}. {opt}
            </button>
          ))}
        </div>
      )}
      {current.matches("playing.result") && (
        <div className="basis-2/4 flex flex-col gap-8 items-center justify-center">
          <h3 className="text-xl mt-2">Es {question.answer}!</h3>
          <Button onClick={() => send("NEXT")}>Siguiente</Button>
        </div>
      )}
    </div>
  );
};

export const Game = () => {
  const [current, send] = useMachine(gameMachine);

  return (
    <div className="">
      <div className="text-pokemon mx-auto w-full p-4 h-screen">
        {current.matches("iddle") && <Welcome onSubmit={() => send("START")} />}
        {current.matches("playing") && (
          <Playing
            onSubmit={(correct) => send("GUESS", { payload: { correct } })}
            meta={current.meta["game.playing"].options}
            ctx={current.context}
            current={current}
            send={send}
          />
        )}
        {current.matches("finished") && (
          <div className="flex flex-col gap-4 items-center justify-center h-full">
            <h3 className="text-4xl">¡Felicidades!</h3>
            <p className="text-xl mb-8">
              Obtuviste {current.context.score} puntos
            </p>

            <p className="text-xl mt-2">Respuestas Correctas:</p>

            <ol className="text-2xl text-left list-decimal">
              <li className="first-letter:text-yellow-200">Machop</li>
              <li className="first-letter:text-yellow-200">Abra</li>
              <li className="first-letter:text-yellow-200">Umberon</li>
              <li className="first-letter:text-yellow-200">Rattata</li>
              <li className="first-letter:text-yellow-200">Onix</li>
            </ol>
            <Button onClick={() => send("RESTART")}>Reset</Button>
          </div>
        )}
      </div>
      <audio
        src="/sounds/whosthatpokemon.mp3"
        autoPlay={false}
        id="audio"
      ></audio>
    </div>
  );
};

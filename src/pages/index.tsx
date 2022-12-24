import Head from "next/head";
import { Game } from "../components/Game";

export default function Home() {
  return (
    <>
      <Head>
        <title>Pokemon Game</title>
        <meta
          name="description"
          content="Discover your secret santa with this Game!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <Game />
      </main>
    </>
  );
}

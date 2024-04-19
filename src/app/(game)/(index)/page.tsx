import Link from "next/link";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/svg/app-icon";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="full-screen p-4 flex flex-col items-center justify-between text-center">
      <section>
        <h1 className="text-4xl font-bold pb-2">Top 10</h1>
        <p className="text-muted-foreground">
          Guess the top 10 answers and stay in the game!
        </p>
      </section>

      <section className="p-4">
        <AppIcon className="max-w-full max-h-[50dvh]" />
      </section>

      <section>
        <Link href="/categories" className={cn(buttonVariants())}>
          PLAY
        </Link>
      </section>
    </main>
  );
}

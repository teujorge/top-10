import Link, { LinkProps } from "next/link";

export default function CategoriesPage() {
  return (
    <main className="full-screen flex flex-col items-center justify-between text-center">
      <section>
        <h1 className="text-2xl font-bold pb-4">Select your category</h1>
      </section>

      <section className="p-4 grid w-full grid-cols-2 max-w-3xl max-h-full overflow-x-hidden overflow-y-auto gap-2 border-accent border-y">
        <CategoryCard title="c1" href="/game?category=c1" />
        <CategoryCard title="c2" href="/game?category=c2" />
        <CategoryCard title="c3" href="/game?category=c3" />
        <CategoryCard title="c4" href="/game?category=c4" />
        <CategoryCard title="c5" href="/game?category=c5" />
        <CategoryCard title="c6" href="/game?category=c6" />
        <CategoryCard title="c7" href="/game?category=c7" />
        <CategoryCard title="c8" href="/game?category=c8" />
        <CategoryCard title="c9" href="/game?category=c9" />
        <CategoryCard title="AI" href="/game?category=AI" />
      </section>
    </main>
  );
}

function CategoryCard(props: LinkProps & { title: string }) {
  return (
    <Link
      {...props}
      className="flex flex-grow  w-full items-center justify-center border border-primary rounded-lg bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground"
    >
      <section className="flex flex-col items-center justify-center p-4">
        <h2 className="text-lg font-bold">{props.title}</h2>
      </section>
    </Link>
  );
}

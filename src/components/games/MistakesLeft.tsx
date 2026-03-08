"use client";

export default function MistakesLeft({ count }: { count: number }) {
  return (
    <p className="font-quantico text-textBeige text-xl tablet:text-4xl font-bold">
      Mistakes left: {count}
    </p>
  );
}

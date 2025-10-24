import type { ReactNode } from "react";

export const Card = ({ children }: { children: ReactNode }) => (
  <article className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
    {children}
  </article>
);

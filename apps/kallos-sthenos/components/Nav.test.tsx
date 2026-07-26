import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import Nav from "@/components/Nav";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("Nav", () => {
  it("marks dashboard as active on root path", () => {
    mockUsePathname.mockReturnValue("/");

    render(<Nav />);

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: /exercises/i }),
    ).not.toHaveAttribute("aria-current");
  });

  it("marks exercises as active on nested exercise path", () => {
    mockUsePathname.mockReturnValue("/exercises/12");

    render(<Nav />);

    expect(screen.getByRole("link", { name: /exercises/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).not.toHaveAttribute("aria-current");
  });
});

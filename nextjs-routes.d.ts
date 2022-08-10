// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
// Run `npx nextjs-routes` to regenerate this file.
/* eslint-disable */

// prettier-ignore
declare module "nextjs-routes" {
  export type Route =
    | { pathname: "/accounts/[id]"; query: Query<{ id: string }> }
    | { pathname: "/api/login"; query?: Query | undefined }
    | { pathname: "/api/logout"; query?: Query | undefined }
    | { pathname: "/api/register"; query?: Query | undefined }
    | { pathname: "/api/trpc/[trpc]"; query: Query<{ trpc: string }> }
    | { pathname: "/genres/[id]/edit"; query: Query<{ id: string }> }
    | { pathname: "/genres/[id]"; query: Query<{ id: string }> }
    | { pathname: "/genres/canvas"; query?: Query | undefined }
    | { pathname: "/genres/create"; query?: Query | undefined }
    | { pathname: "/genres"; query?: Query | undefined }
    | { pathname: "/"; query?: Query | undefined }
    | { pathname: "/login"; query?: Query | undefined }
    | { pathname: "/register"; query?: Query | undefined }
    | { pathname: "/releases/[id]"; query: Query<{ id: string }> }
    | { pathname: "/releases"; query?: Query | undefined }
    | { pathname: "/releases/submit"; query?: Query | undefined };

  type Query<Params = {}> = Params & { [key: string]: string | string[] | undefined };
}

// prettier-ignore
declare module "next/link" {
  import type { Route } from "nextjs-routes";
  import type { LinkProps as NextLinkProps } from "next/dist/client/link";
  import type { PropsWithChildren, MouseEventHandler } from "react";
  export * from "next/dist/client/link";

  type RouteOrQuery = Route | { query?: { [key: string]: string | string[] | undefined } };

  export interface LinkProps extends Omit<NextLinkProps, "href"> {
    href: RouteOrQuery;
  }

  declare function Link(
    props: PropsWithChildren<LinkProps>
  ): DetailedReactHTMLElement<
    {
      onMouseEnter?: MouseEventHandler<Element> | undefined;
      onClick: MouseEventHandler;
      href?: string | undefined;
      ref?: any;
    },
    HTMLElement
  >;

  export default Link;
}

// prettier-ignore
declare module "next/router" {
  import type { Route } from "nextjs-routes";
  import type { NextRouter as Router } from "next/dist/client/router";
  export * from "next/dist/client/router";
  export { default } from "next/dist/client/router";

  type TransitionOptions = Parameters<Router["push"]>[2];

  type Pathname = Route["pathname"];

  type QueryForPathname = {
    [K in Route as K["pathname"]]: Exclude<K["query"], undefined>;
  };

  type RouteOrQuery = Route | { query: { [key: string]: string | string[] | undefined } };

  export interface NextRouter<P extends Pathname = Pathname>
    extends Omit<Router, "push" | "replace"> {
    pathname: P;
    route: P;
    query: QueryForPathname[P];
    push(
      url: RouteOrQuery,
      as?: string,
      options?: TransitionOptions
    ): Promise<boolean>;
    replace(
      url: RouteOrQuery,
      as?: string,
      options?: TransitionOptions
    ): Promise<boolean>;
  }

  export function useRouter<P extends Pathname>(): NextRouter<P>;
}

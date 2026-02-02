import { UserDocument } from "@/db/models/user";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import JWTService from "@/services/jwt";
import UserDAO from "@/db/actions/user";
import { handleError } from "./errorHandler";

type RouteHandler<T = unknown> = (
  req: NextRequest,
  context: { params: T },
  user: UserDocument,
) => Promise<NextResponse>;

type UnauthenticatedRouteHandler<T = unknown> = (
  req: NextRequest,
  context: { params: T },
) => Promise<NextResponse>;

/**
 * Higher-order function that wraps API routes with authentication logic
 * @param handler - The route handler function that receives the authenticated user
 * @param requireAuth - Whether authentication is required (default: true)
 * @returns Wrapped route handler with authentication
 */
export function withAuth<T = unknown>(
  handler: RouteHandler<T>,
  requireAuth = true,
): (
  req: NextRequest,
  context: { params: Promise<T> },
) => Promise<NextResponse> {
  return async (
    req: NextRequest,
    context: { params: Promise<T> },
  ): Promise<NextResponse> => {
    try {
      const resolvedParams = await context.params;
      const authToken = (await cookies()).get("auth_token")?.value;

      if (requireAuth) {
        if (!authToken) {
          return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 },
          );
        }

        const tokenPayload = JWTService.verifyToken(authToken);
        const user = await UserDAO.getUserFromId(tokenPayload.userId);

        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 },
          );
        }

        return handler(req, { params: resolvedParams }, user.toObject());
      }

      // For unauthenticated routes, we still pass through but without user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return handler(req, { params: resolvedParams }, null as any);
    } catch (error) {
      return handleError(error);
    }
  };
}

/**
 * Wrapper for unauthenticated routes (no auth required)
 */
export function withoutAuth<T = unknown>(
  handler: UnauthenticatedRouteHandler<T>,
): (
  req: NextRequest,
  context: { params: Promise<T> },
) => Promise<NextResponse> {
  return async (
    req: NextRequest,
    context: { params: Promise<T> },
  ): Promise<NextResponse> => {
    try {
      const resolvedParams = await context.params;
      return handler(req, { params: resolvedParams });
    } catch (error) {
      return handleError(error);
    }
  };
}

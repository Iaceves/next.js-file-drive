import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation } from "./_generated/server";
// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();

  if (!user) {
    throw new ConvexError("expected user to be defined");
  }

  return user;
}

// const http = httpRouter();

// http.route({
//   path: "/getImage",
//   method: "GET",
//   handler: httpAction(async (ctx, request) => {
//     const { searchParams } = new URL(request.url);
//     const storageId = searchParams.get("storageId")! as Id<"_storage">;
//     const blob = await ctx.storage.get(storageId);
//     if (blob === null) {
//       return new Response("Image not found", {
//         status: 404,
//       });
//     }
//     return new Response(blob);
//   }),
// });

export const createUser = internalMutation({
  args: { tokenIdentifier: v.string() },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string() },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, args.orgId],
    });
  },
});
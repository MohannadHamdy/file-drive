import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("You must be logged in to upload a file");
  }
  return await ctx.storage.generateUploadUrl();
});

const hasAccessToOrg = async (
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string
) => {
  const user = await getUser(ctx, tokenIdentifier);

  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

  return hasAccess;
};

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
    fileId: v.id("_storage"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to upload a file");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("You do not have permission to upload a file");
    }

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );

    if (!hasAccess) {
      return [];
    }

    return ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to delete a file");
    }

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("File not found");
    }

    if (!file.orgId) {
      throw new ConvexError("File does not belong to an organization");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      file.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("You don't have access to this file");
    }

    await ctx.db.delete(args.fileId);
  },
});

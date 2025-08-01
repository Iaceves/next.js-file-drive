
import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a file");
  }

  return await ctx.storage.generateUploadUrl();
});

//Access to org
async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx, orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

  const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",
      q => q.eq("tokenIdentifier", identity.tokenIdentifier)
    ).first()

    if(!user){
      return null;
    }

  // const user = await getUser(ctx, tokenIdentifier);

  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

    if(!hasAccess){
      return null;
    }

  return {user}
}

//create File
export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: fileTypes,
  },
  async handler(ctx, args) {
  
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      throw new ConvexError("you do not have access to this org");
    }

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type
    });
  },
});


//get files
export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
  
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

      const query = args.query

      if(query){
        files =  files.filter((file) => file.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
      } 

      if(args.favorites){
        const favorites = await
         ctx.db.query("favorites")
         .withIndex("by_userId_orgId_fileId", q => q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)).collect();

         files = files.filter((file) => favorites.some((favorite) => favorite.fileId === file._id));
      }
      

      return files;
  },
});

export const deleteFile = mutation({
  args: {fileId: v.id("files")},
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("you do not have access to this org");
    }

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("this file does not exist");
    }

    const hasAccess = await hasAccessToOrg(ctx, file.orgId);

    if (!hasAccess) {
      throw new ConvexError("You do not have access to delete file.");
    }

    await ctx.db.delete(args.fileId)
    
  },
})

export const getFileUrl = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, { fileId }) => {
    const url = await ctx.storage.getUrl(fileId);
    return url;
  },
});

export const getAllFavorites = query({
  args: {orgId: v.string()},
  async handler(ctx, args) {
  
    const hasAccess = await hasAccessToOrg(ctx, args.orgId)

   if(!hasAccess){
      return [];
   }

    const favorites = await ctx.db.query("favorites")
      .withIndex("by_userId_orgId_fileId", q => 
        q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
      )
      .collect();
      return favorites;
  },
  
})


export const toggleFavorite = mutation({
  args: {fileId: v.id("files")},
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId)

   if(!access){
      throw new ConvexError("No access to file")
   }

    const favorite = await ctx.db.query("favorites")
      .withIndex("by_userId_orgId_fileId", q => 
        q.eq("userId", access.user._id).eq("orgId", access.file.orgId).eq("fileId", access.file._id)
      )
      .first();

    if(!favorite){
        await ctx.db.insert("favorites", {
          fileId: access.file._id,
          userId: access.user._id,
          orgId: access.file.orgId,
        })
    }else{
      await ctx.db.delete(favorite._id);
    }
  },
})



async function hasAccessToFile(ctx: QueryCtx | MutationCtx, fileId: Id<"files">){

    const file = await ctx.db.get(fileId);

    if (!file) {
      return null;
    }

    const hasAccess = await hasAccessToOrg(ctx, file.orgId);

    if (!hasAccess) {
      return null;
    }

    return {user: hasAccess.user, file}
}

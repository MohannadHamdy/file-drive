import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-signature": headerPayload.get("svix-signature")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
        },
      });

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            tokenIdentifier: `https://delicate-wahoo-88.clerk.accounts.dev|${result.data.id}`,
          });
          break;
        case "organizationMembership.created":
          await ctx.runMutation(internal.users.addOrgId, {
            tokenIdentifier: `https://delicate-wahoo-88.clerk.accounts.dev|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
          });
          break;
      }

      return new Response(null, { status: 200 });
    } catch (error) {
      console.log(error);
      return new Response("Webhook Error", { status: 400 });
    }
  }),
});

export default http;

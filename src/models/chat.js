import mongoose, { Schema } from "mongoose";
import User from "./user";

const chatSchema = new Schema(
  {
    title: String,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

const USER_LIMIT = 5;
chatSchema.pre("save", async function () {
  if (!this.title) {
    const users = await User.where("_id")
      .in(this.users)
      .limit(USER_LIMIT)
      .select("name");
    let title = users.map((u) => u.name).join(", ");

    if (this.users.length > USER_LIMIT) {
      title += "...";
    }
    this.title = title;
  }
});

export default mongoose.model("Chat", chatSchema);

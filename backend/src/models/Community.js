const mongoose = require("mongoose");
const slugify = require("slugify");
const Post = require("./Post");

const communitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            trim: true,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        postCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

communitySchema.pre("validate", async function (next) {
    if (!this.slug) {
        const baseSlug = slugify(this.name, { lower: true, strict: true });

        // Ensure uniqueness
        let finalSlug = baseSlug;
        let i = 1;

        const Community = mongoose.model("Community");

        while (await Community.exists({ slug: finalSlug })) {
            finalSlug = `${baseSlug}-${i++}`;
        }

        this.slug = finalSlug;
    }
    next();
});

communitySchema.pre("findOneAndDelete", async function (next) {
    const communityId = this.getQuery()["_id"];
    await Post.deleteMany({ community: communityId });
    next();
});

module.exports = mongoose.model("Community", communitySchema);

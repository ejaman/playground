import { posts } from "#site/content";

export const publishedPosts = posts.filter((post) => post.published);

export const unpublishedPosts = posts.filter((post) => !post.published);

import { knexInstance } from "../db";

export const getSavedItemsByUserId = async (req: any, res: any) => {
  try {
    const validRecords = await knexInstance
      .select("*")
      .from("post")
      .join(
        knexInstance.raw(
          `(SELECT JSON_EXTRACT(saved, "$[*]") AS saved_posts FROM user WHERE id = ?) AS user_posts`,
          [req.user.id]
        ),
        function () {
          this.on(
            knexInstance.raw(
              "JSON_CONTAINS(user_posts.saved_posts, CONCAT('\"', post.id, '\"'))"
            )
          );
        }
      );

    const transformedRecords = validRecords.map((record) => {
      return {
        ...record,
        postId: record.id,
        imageUrl: JSON.parse(record.imageUrl),
        likes: JSON.parse(record.likes).map(Number),
        types: JSON.parse(record.types),
      };
    });

    res.status(200).json(transformedRecords);
  } catch (error) {
    res.status(400).json({ msg: "No saved posts" });
  }
};

export const updateSavedPosts = async (req: any, res: any) => {
  const { postId } = req.body;

  try {
    await knexInstance("user")
      .update({
        saved: knexInstance.raw(`
        CASE
          WHEN JSON_SEARCH(saved, 'one', CAST(${postId} AS CHAR)) IS NOT NULL THEN
            JSON_REMOVE(saved, JSON_UNQUOTE(JSON_SEARCH(saved, 'one', CAST(${postId} AS CHAR))))
          ELSE
            JSON_ARRAY_APPEND(saved, '$', CAST(${postId} AS CHAR))
        END
      `),
      })
      .where("id", req.user.id);

    const [user] = await knexInstance
      .select(
        "id",
        "username",
        "firstName",
        "lastName",
        "imageUrl",
        "followers",
        "following",
        "authImage",
        "saved"
      )
      .from("user")
      .where("id", req.user.id);

    user.following = JSON.parse(user.following).map(Number);
    user.followers = JSON.parse(user.followers).map(Number);
    user.saved = JSON.parse(user.saved).map(Number);

    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

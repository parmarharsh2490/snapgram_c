import { useState, useEffect } from "react";
import { Button, Input } from "../ui";
import { useCreateComments, useGetComments, useLikeComment } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Models } from "appwrite";

interface CommentsProps {
  postId: string;
}

interface FormData {
  comment: string;
}

const Comments = ({ postId }: CommentsProps) => {
  const [showComment, setShowComment] = useState<boolean>(true);
  const form = useForm<FormData>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: '',
    },
  });
  
  const { user } = useUserContext();
  const { data: commentsList = [], isLoading } = useGetComments(postId);
  console.log('comment');
  console.log(commentsList);
  
  const { mutateAsync: likeComment } = useLikeComment();
  const { mutateAsync: createComment, isLoading: isCreatingComment } = useCreateComments();

  const handleLike = async (comment: Models.Document) => {
    await likeComment({
      commentId: comment.$id,
      userId: user.id,
      commentLikeArray: comment.likesArray,
      postId  :postId,
    });
  };
  
  const handleCreate = async (data: FormData) => {
    try {
      await createComment({
        postId: postId,
        comment: data.comment,
        userId: user.id,
      });
      form.reset(); 
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };
  return (
      <>
       {
        showComment && (
          <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="flex w-full items-center justify-center gap-3 my-4">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Input
                      type="text"
                      className="shad-input bg-dark-4 border-none w-full"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="shad-button_primary"
                disabled={isCreatingComment}
              >
                {isCreatingComment ? "Loading..." : "Comment"}
              </Button>
            </form>
          </Form>
          <div key={postId} className="bg-dark-3 flex flex-col flex-1 overflow-scroll custom-scrollbar min-h-[10px] max-h-[200px] mt-3 gap-3 justify-start">
            {isLoading ? (
              <div className="flex items-center justify-center w-full">
                <img src="/assets/icons/loader.svg" alt="Loading" width={25} height={25} />
              </div>
            ) : commentsList.length === 0 ? (
              <h3 className="md:h3-bold text-center">No Comments</h3>
            ) : (
              commentsList.map((comment) => (
                <div key={comment.$id} className="flex py-2 px-4 flex-1 items-center justify-between">
                  <div key={comment.$id} className="flex items-center gap-3">
                    <Link to={`/profile/${comment?.user?.$id}`} className="flex gap-2">
                      <img
                        src={comment?.users?.imageUrl  || "/assets/images/profile.png"}
                        alt=""
                        height={24}
                        width={24}
                        className="rounded-full"
                      />
                      <span className="small-medium lg:base-medium">
                        {comment?.users?.name || "Unknown"}
                      </span>
                    </Link>
                    <span className="tiny-medium text-light-3 sm:small-medium">
                      {comment?.comment}
                    </span>
                  </div>
                  <div>
                    {comment?.likesArray?.includes(user.id) ? (
                      <div className="flex gap-1">
                        <img src="/assets/icons/liked.svg" onClick={() => handleLike(comment)} alt="Liked" />
                        <span>{comment?.likesArray?.length}</span>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <img src="/assets/icons/like.svg" onClick={() => handleLike(comment)} alt="Like" />
                        <span>{comment?.likesArray?.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
        )
       }
      </>
      )
};

export default Comments;

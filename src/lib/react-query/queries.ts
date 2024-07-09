import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import {
  createUserAccount,
  signInAccount,
  getCurrentUser,
  signOutAccount,
  getUsers,
  createPost,
  getPostById,
  updatePost,
  getUserPosts,
  deletePost,
  likePost,
  getUserById,
  updateUser,
  getRecentPosts,
  getInfinitePosts,
  searchPosts,
  savePost,
  deleteSavedPost,
  createComment,
  likeComment,
  getComments,
} from "@/lib/appwrite/api";
import {  INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";

// ============================================================
// AUTH QUERIES
// ============================================================

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

// ============================================================
// POST QUERIES
// ============================================================

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      // console.log("success");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};


export const useCreateComments = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ postId, comment, userId }: { postId: string; comment: string; userId: string }) => 
      createComment({ postId, comment, userId }),
    {
      onMutate: async (newComment) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['getComments', newComment.postId]);
        
        // Snapshot the previous value
        const previousComments = queryClient.getQueryData(['getComments', newComment.postId]);
        
        // Optimistically update to the new value
        queryClient.setQueryData(['getComments', newComment.postId], (old: any) => [
          {
            ...newComment,
            likesArray: [],
            $id: Math.random().toString(),
            users: queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER]),
            posts: queryClient.getQueryData([QUERY_KEYS.GET_POST_BY_ID, newComment.postId])
          },
          ...old,
        ]);

        // Return a context with the previous and new comment
        return { previousComments };
      },
      onError: (err, newComment, context) => {
        // Rollback to the previous value if the mutation fails
        if (context?.previousComments) {
          queryClient.setQueryData(['getComments', newComment.postId], context.previousComments);
        }
        console.error('Error creating comment:', err);
        alert(`Error: ${(err as Error).message || 'An unknown error occurred'}`);
      },
      onSettled: (newComment) => {
        queryClient.invalidateQueries(['getComments', newComment?.postId]);
      },
      onSuccess: (newComment) => {
        queryClient.invalidateQueries(['getComments', newComment?.posts?.$id]);
      },
    }
  );
};


interface LikeCommentParams {
  commentId: string;
  userId: string;
  commentLikeArray: string[];
  postId: string;
}

export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ commentId, userId, commentLikeArray }: LikeCommentParams) =>
      likeComment({ commentId, userId, commentLikeArray }),
    {
      onMutate: async (newLike: LikeCommentParams) => {
        const { commentId, userId, postId } = newLike;
        
        const previousData : Array<{}> | undefined = queryClient.getQueryData(['getComments', postId]);
        if (!previousData) return;

        // Create a new data array with the updated like status
        const newData  = previousData.map((comment : any) => {
          if (comment.$id === commentId) {
            const isLiked = comment.likesArray.includes(userId);
            const newLikesArray = isLiked
              ? comment.likesArray.filter((id : string) => id !== userId)
              : [...comment.likesArray, userId];

            return {
              ...comment,
              likesArray: newLikesArray,
            };
          }
          return comment;
        });

        
        queryClient.setQueryData(['getComments', postId], newData);

        return { previousData };
      },
      onError: ( newLike : LikeCommentParams, context : any) => {
        // Roll back to the previous data on error
        if (context?.previousData) {
          queryClient.setQueryData(['getComments', newLike.postId], context.previousData);
        }
      },
      onSettled: (newLike) => {
        // Invalidate the query to refetch the comments data and ensure consistency
        if (newLike) {
          queryClient.invalidateQueries(['getComments', newLike.postId]);
        }
      }
    }
  );
};



export const useGetComments = (postId : string) => {
  return useQuery({
    queryKey: ['getComments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
    keepPreviousData: true,
  });
};
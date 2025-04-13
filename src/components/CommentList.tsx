import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import React, { useState } from 'react';


interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const fetchComments = async (): Promise<Comment[]> => {
  const res = await axios.get('https://jsonplaceholder.typicode.com/comments?postId=1');
  return res.data;
};

const deleteComment = async (id: number) => {
  return await axios.delete(`https://jsonplaceholder.typicode.com/comments/${id}`);
};

const updateComment = async (comment: Comment) => {
  return await axios.put(`https://jsonplaceholder.typicode.com/comments/${comment.id}`, comment);
};

const CommentsList = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<Comment[]>({
    queryKey: ['comments', 1],
    queryFn: fetchComments,
  });

  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success('Comment deleted');
      queryClient.invalidateQueries({ queryKey: ['comments', 1] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      toast.success('Comment updated');
      setEditingComment(null);
      queryClient.invalidateQueries({ queryKey: ['comments', 1] });
    },
  });

  const handleUpdate = (e:React.FormEvent<HTMLFormElement>,comment: Comment) => {
    e.preventDefault()
    updateMutation.mutate(comment)
  }

  const handleReply = (e: React.FormEvent<HTMLFormElement>, parentId: number) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const body = (form.elements.namedItem('reply') as HTMLTextAreaElement).value;
    toast.success(`Replied to comment #${parentId} with: ${body}`);
    form.reset();
    setReplyingToId(null);
  };

  if (isLoading) return <Skeleton className="w-full h-32 rounded-lg" />;
  if (isError) return <p className="text-red-500">Error loading comments.</p>;

  return (
    <div className="space-y-4">
      {data?.slice(0, 5).map(comment => (
        <Card key={comment.id}>
          <CardContent className="space-y-2 p-4">
            <p className="font-medium">{comment.name}</p>
            <p className="text-sm text-gray-500">{comment.email}</p>

            {editingComment?.id === comment.id ? (
              <form onSubmit={e => handleUpdate(e, editingComment)} className="space-y-2">
                <Textarea
                  value={editingComment.body}
                  onChange={e => setEditingComment({ ...editingComment, body: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button type="submit">Update</Button>
                  <Button variant="ghost" onClick={() => setEditingComment(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <p>{comment.body}</p>
            )}

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="ghost" onClick={() => setReplyingToId(comment.id)}>Reply</Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingComment(comment)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(comment.id)}>Delete</Button>
            </div>

            {replyingToId === comment.id && (
              <form onSubmit={e => handleReply(e, comment.id)} className="pt-2 space-y-2">
                <Textarea name="reply" placeholder="Write a reply..." required rows={3} />
                <div className="flex gap-2">
                  <Button type="submit">Send</Button>
                  <Button variant="ghost" onClick={() => setReplyingToId(null)}>Cancel</Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommentsList;
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface NewComment {
  postId: number;
  name: string;
  email: string;
  body: string;
}

const addComment = async (comment: NewComment) => {
  return await axios.post('https://jsonplaceholder.typicode.com/comments', comment);
};

const AddComment: React.FC = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      toast.success('Comment added successfully');
      queryClient.invalidateQueries({ queryKey: ['comments', 1] });
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const commentValue = (form.elements.namedItem('comment') as HTMLTextAreaElement).value;

    const newComment: NewComment = {
      postId: 1,
      name: 'Test User',
      email: 'test@example.com',
      body: commentValue,
    };

    mutation.mutate(newComment);
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        name="comment"
        placeholder="Write a comment..."
        required
        rows={4}
        className="resize-none"
      />
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Posting...' : 'Add Comment'}
      </Button>
    </form>
  );
};

export default AddComment;
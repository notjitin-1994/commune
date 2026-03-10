'use client';

import { create } from 'zustand';
import { Post, Comment } from '@/lib/types';
import { generateId } from '@/lib/utils/helpers';

interface NoticeState {
  posts: Post[];
  comments: Comment[];
  isLoading: boolean;
  
  // Actions
  loadData: () => void;
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  deletePost: (id: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  deleteComment: (id: string) => void;
  getCommentsForPost: (postId: string) => Comment[];
  getVisibleCommentsForPost: (postId: string, currentUserId: string, postAuthorId: string) => Comment[];
}

export const useNoticeStore = create<NoticeState>((set, get) => ({
  posts: [],
  comments: [],
  isLoading: false,

  loadData: () => {
    if (typeof window === 'undefined') return;
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    set({ posts, comments });
  },

  addPost: (postData) => {
    const newPost: Post = {
      ...postData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    const posts = [newPost, ...get().posts];
    set({ posts });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  },

  deletePost: (id) => {
    const posts = get().posts.filter(post => post.id !== id);
    const comments = get().comments.filter(comment => comment.postId !== id);
    set({ posts, comments });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('posts', JSON.stringify(posts));
      localStorage.setItem('comments', JSON.stringify(comments));
    }
  },

  addComment: (commentData) => {
    const newComment: Comment = {
      ...commentData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    const comments = [...get().comments, newComment];
    set({ comments });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('comments', JSON.stringify(comments));
    }
  },

  deleteComment: (id) => {
    const comments = get().comments.filter(comment => comment.id !== id);
    set({ comments });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('comments', JSON.stringify(comments));
    }
  },

  getCommentsForPost: (postId) => {
    return get().comments.filter(comment => comment.postId === postId);
  },

  getVisibleCommentsForPost: (postId, currentUserId, postAuthorId) => {
    return get().comments.filter(comment => {
      if (comment.postId !== postId) return false;
      if (!comment.isPrivate) return true;
      // Private comments visible only to post author and comment author
      return comment.userId === currentUserId || postAuthorId === currentUserId;
    });
  },
}));

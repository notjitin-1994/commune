"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, Lock, Send, X, MapPin, Navigation, ExternalLink, AlertTriangle, Info, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { useNoticeStore } from "@/lib/stores/noticeStore";
import { useMapStore } from "@/lib/stores/mapStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { Post, Comment, User, Flag } from "@/lib/types";
import { getCategoryColor, formatDate, getCategoryLabel } from "@/lib/utils/helpers";

interface PostWithAuthor extends Post {
  author?: User;
  flag?: Flag;
}

interface CommentWithAuthor extends Comment {
  author?: User;
}

function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-beige-light/80 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col border-t border-beige-medium"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex flex-col items-center pt-3 pb-2">
              <div className="w-10 h-1.5 bg-beige-medium rounded-full" />
              <h2 className="font-playfair text-xl font-bold text-espresso mt-4">{title}</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function NoticeBoardPage() {
  const router = useRouter();
  const { posts, comments, loadData, addPost, addComment } = useNoticeStore();
  const { flags, loadFlags } = useMapStore();
  const { user } = useAuthStore();
  
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | null>(null);
  const [newPost, setNewPost] = useState({
    content: "",
    category: 1 as 1 | 2 | 3,
    flagId: "" as string,
  });
  const [newComment, setNewComment] = useState("");
  const [isPrivateComment, setIsPrivateComment] = useState(false);
  const [filterCategory, setFilterCategory] = useState<number | null>(null);

  useEffect(() => {
    loadData();
    loadFlags();
  }, [loadData, loadFlags]);

  const getUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  const getPostWithAuthor = (post: Post): PostWithAuthor => {
    const users = getUsers();
    const author = users.find((u: User) => u.id === post.userId);
    const flag = flags.find((f: Flag) => f.id === post.flagId);
    return { ...post, author, flag };
  };

  const getCommentWithAuthor = (comment: Comment): CommentWithAuthor => {
    const users = getUsers();
    const author = users.find((u: User) => u.id === comment.userId);
    return { ...comment, author };
  };

  const getCommentsForPost = (postId: string): CommentWithAuthor[] => {
    if (!user) return [];
    const post = posts.find(p => p.id === postId);
    if (!post) return [];
    
    return comments
      .filter(c => {
        if (c.postId !== postId) return false;
        if (!c.isPrivate) return true;
        return c.userId === user.id || post.userId === user.id;
      })
      .map(getCommentWithAuthor)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const handleCreatePost = () => {
    if (!user || !newPost.content.trim()) return;
    
    addPost({
      userId: user.id,
      flagId: newPost.flagId || undefined,
      content: newPost.content,
      category: newPost.category,
      isNews: false,
    });
    
    setNewPost({ content: "", category: 1, flagId: "" });
    setIsCreateSheetOpen(false);
  };

  const handleAddComment = () => {
    if (!user || !selectedPost || !newComment.trim()) return;
    
    addComment({
      postId: selectedPost.id,
      userId: user.id,
      content: newComment,
      isPrivate: isPrivateComment,
    });
    
    setNewComment("");
    setIsPrivateComment(false);
  };

  const handleViewOnMap = (flag: Flag) => {
    router.push(`/map?flag=${flag.id}&lat=${flag.lat}&lng=${flag.lng}`);
  };

  const postsWithAuthors = posts
    .map(getPostWithAuthor)
    .filter(post => filterCategory === null || post.category === filterCategory)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <AppShell>
      <div className="min-h-full bg-beige-light">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur px-6 py-5 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-playfair text-3xl font-bold text-espresso">Notice Board</h1>
              <p className="text-taupe text-sm">Stay connected with your community</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateSheetOpen(true)}
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-oxide to-rust flex items-center justify-center text-espresso shadow-lg shadow-red-oxide/25"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterCategory(null)}
              className={`chip flex-shrink-0 ${filterCategory === null ? 'chip-active' : 'chip-inactive'}`}
            >
              <Filter className="w-4 h-4" />
              All
            </button>
            {[1, 2, 3].map((cat) => (
              <CategoryPill
                key={cat}
                category={cat as 1 | 2 | 3}
                isSelected={filterCategory === cat}
                onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              />
            ))}
          </div>
        </header>

        {/* Posts Feed */}
        <div className="px-4 py-4 pb-8">
          <motion.div 
            className="space-y-4"
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.05 } }
            }}
          >
            <AnimatePresence>
              {postsWithAuthors.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white/95 backdrop-blur rounded-2xl p-5 card-press cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-beige-medium flex items-center justify-center text-espresso font-semibold">
                        {post.author?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-espresso text-sm truncate">
                          {post.author?.name || "Unknown"}
                        </h3>
                        <time className="text-xs text-taupe">
                          {formatDate(post.createdAt)}
                        </time>
                      </div>
                    </div>
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: getCategoryColor(post.category) }}
                    >
                      {post.category === 1 ? <AlertTriangle className="w-5 h-5 text-espresso" /> : post.category === 2 ? <Info className="w-5 h-5 text-espresso" /> : <MapPin className="w-5 h-5 text-espresso" />}
                    </div>
                  </div>

                  <p className="text-deep-brown text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.content}
                  </p>

                  {post.flag && (
                    <div 
                      className="mb-4 p-4 rounded-xl border"
                      style={{ 
                        backgroundColor: `${getCategoryColor(post.flag.category)}15`,
                        borderColor: `${getCategoryColor(post.flag.category)}40`
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: getCategoryColor(post.flag.category) }} />
                        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: getCategoryColor(post.flag.category) }}>
                          Related Location
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-espresso font-medium text-sm truncate">
                          {post.flag.title}
                        </p>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOnMap(post.flag!);
                          }}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-espresso text-xs font-medium"
                          style={{ backgroundColor: getCategoryColor(post.flag.category) }}
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          View
                        </motion.button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-3 border-t border-beige-medium">
                    <div className="flex items-center gap-2 text-sm text-taupe">
                      <MessageCircle className="w-4 h-4" />
                      <span>{getCommentsForPost(post.id).length} comments</span>
                    </div>
                    <span className="text-xs text-taupe">
                      Tap to view
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {postsWithAuthors.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-beige-medium flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-taupe" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">
                No posts yet
              </h3>
              <p className="text-taupe text-sm">
                Be the first to share something with your community!
              </p>
            </div>
          )}
        </div>

        {/* Create Post Sheet */}
        <BottomSheet
          isOpen={isCreateSheetOpen}
          onClose={() => setIsCreateSheetOpen(false)}
          title="Create New Post"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-deep-brown mb-3">Category</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((cat) => (
                  <motion.button
                    key={cat}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNewPost({ ...newPost, category: cat as 1 | 2 | 3 })}
                    className={`py-4 px-2 rounded-xl text-sm font-medium transition-all ${
                      newPost.category === cat
                        ? "text-espresso shadow-lg"
                        : "bg-beige-medium text-deep-brown border border-beige-medium"
                    }`}
                    style={
                      newPost.category === cat
                        ? { backgroundColor: getCategoryColor(cat as 1 | 2 | 3) }
                        : undefined
                    }
                  >
                    <div className="text-lg mb-2">
                      {cat === 1 ? <AlertTriangle className="w-6 h-6 mx-auto" /> : cat === 2 ? <Info className="w-6 h-6 mx-auto" /> : <MapPin className="w-6 h-6 mx-auto" />}
                    </div>
                    <div className="text-xs">
                      {cat === 1 ? "Critical" : cat === 2 ? "Info" : "General"}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-brown mb-2">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-oxide" />
                  Link to Location Flag
                </span>
                <span className="text-taupe text-xs font-normal block mt-0.5">
                  Connect this post to a property or location on the map
                </span>
              </label>
              <select
                value={newPost.flagId}
                onChange={(e) => setNewPost({ ...newPost, flagId: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-beige-medium border border-beige-medium text-sm text-espresso focus:border-red-oxide focus:outline-none"
              >
                <option value="">Select a location...</option>
                {flags.map((flag) => (
                  <option key={flag.id} value={flag.id}>
                    {flag.title} ({getCategoryLabel(flag.category)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-brown mb-2">Content</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Share with your community..."
                className="input min-h-[120px] resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreatePost}
                disabled={!newPost.content.trim()}
                className="w-full py-4 bg-gradient-to-r from-red-oxide to-rust text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-oxide/25"
              >
                <Plus className="w-5 h-5" />
                Post
              </motion.button>
              <button onClick={() => setIsCreateSheetOpen(false)} className="w-full py-4 bg-beige-medium text-deep-brown rounded-xl font-semibold hover:bg-beige-medium transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* Post Detail Sheet */}
        <BottomSheet
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          title="Post Details"
        >
          {selectedPost && (
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-beige-medium flex items-center justify-center text-espresso font-semibold">
                  {selectedPost.author?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-espresso">
                    {selectedPost.author?.name || "Unknown"}
                  </h3>
                  <p className="text-xs text-taupe">{formatDate(selectedPost.createdAt)}</p>
                </div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: getCategoryColor(selectedPost.category) }}
                >
                  {selectedPost.category === 1 ? <AlertTriangle className="w-5 h-5 text-espresso" /> : selectedPost.category === 2 ? <Info className="w-5 h-5 text-espresso" /> : <MapPin className="w-5 h-5 text-espresso" />}
                </div>
              </div>

              <div className="p-4 bg-beige-medium rounded-xl border border-beige-medium">
                <p className="text-deep-brown leading-relaxed">{selectedPost.content}</p>
              </div>

              {selectedPost.flag && (
                <div 
                  className="p-4 rounded-2xl border-2"
                  style={{ 
                    backgroundColor: `${getCategoryColor(selectedPost.flag.category)}12`,
                    borderColor: `${getCategoryColor(selectedPost.flag.category)}50`
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5" style={{ color: getCategoryColor(selectedPost.flag.category) }} />
                    <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: getCategoryColor(selectedPost.flag.category) }}>
                      Related Property / Location
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg"
                      style={{ backgroundColor: getCategoryColor(selectedPost.flag.category) }}
                    >
                      {selectedPost.flag.category === 1 ? <AlertTriangle className="w-6 h-6 text-espresso" /> : selectedPost.flag.category === 2 ? <Info className="w-6 h-6 text-espresso" /> : <MapPin className="w-6 h-6 text-espresso" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-playfair text-lg font-bold text-espresso">
                        {selectedPost.flag.title}
                      </h4>
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium text-espresso mt-1"
                        style={{ backgroundColor: getCategoryColor(selectedPost.flag.category) }}
                      >
                        {getCategoryLabel(selectedPost.flag.category)}
                      </span>
                    </div>
                  </div>

                  {selectedPost.flag.description && (
                    <div className="p-3 bg-white/50 rounded-xl mb-4">
                      <p className="text-deep-brown text-sm leading-relaxed">
                        {selectedPost.flag.description}
                      </p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewOnMap(selectedPost.flag!)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium shadow-lg"
                    style={{ backgroundColor: getCategoryColor(selectedPost.flag.category) }}
                  >
                    <Navigation className="w-5 h-5" />
                    View on Map
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

              <div className="border-t border-beige-medium pt-4">
                <h4 className="font-semibold text-espresso mb-4 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Comments ({getCommentsForPost(selectedPost.id).length})
                </h4>

                <div className="space-y-4 mb-4 max-h-[200px] overflow-y-auto">
                  {getCommentsForPost(selectedPost.id).map((comment) => (
                    <div key={comment.id} className="pl-3 border-l-2 border-beige-medium">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-espresso">
                          {comment.author?.name || "Unknown"}
                        </span>
                        {comment.isPrivate && (
                          <span className="flex items-center gap-1 text-xs text-red-oxide">
                            <Lock className="w-3 h-3" />
                            Private
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-deep-brown">{comment.content}</p>
                      <time className="text-xs text-taupe">{formatDate(comment.createdAt)}</time>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    className="input flex-1"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="w-12 h-12 bg-gradient-to-r from-red-oxide to-rust text-white rounded-xl flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <label className="flex items-center gap-2 mt-3 text-sm text-taupe cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivateComment}
                    onChange={(e) => setIsPrivateComment(e.target.checked)}
                    className="w-4 h-4 rounded border-beige-medium bg-beige-medium text-red-oxide focus:ring-red-oxide"
                  />
                  <Lock className="w-3 h-3" />
                  Private comment
                </label>
              </div>
            </div>
          )}
        </BottomSheet>
      </div>
    </AppShell>
  );
}

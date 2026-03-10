"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, Lock, Send, X, ChevronDown, MapPin, Navigation, ExternalLink, AlertTriangle, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { UserAvatar } from "@/components/shared/UserAvatar";
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

// Bottom Sheet Component
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
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex flex-col items-center pt-3 pb-2">
              <div className="w-10 h-1.5 bg-warm-sand/50 rounded-full" />
              <h2 className="font-playfair text-lg font-bold text-espresso mt-3">{title}</h2>
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

  const postsWithAuthors = posts.map(getPostWithAuthor).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <AppShell>
      <div className="min-h-full bg-beige-light">
        {/* Mobile Header */}
        <header className="mobile-header px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-xl font-bold text-espresso">Notice Board</h1>
              <p className="text-xs text-taupe">Stay connected with your community</p>
            </div>
            
            <button
              onClick={() => setIsCreateSheetOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-oxide text-white rounded-xl font-medium text-sm active:scale-95 transition-transform shadow-button"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Post</span>
            </button>
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
                  className="bg-white rounded-2xl p-4 shadow-card active:scale-[0.99] transition-transform cursor-pointer"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar 
                        name={post.author?.name || "Unknown"} 
                        size="md" 
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-deep-brown text-sm truncate">
                          {post.author?.name || "Unknown"}
                        </h3>
                        <time className="text-xs text-taupe">
                          {formatDate(post.createdAt)}
                        </time>
                      </div>
                    </div>
                    <span 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base"
                      style={{ backgroundColor: getCategoryColor(post.category) }}
                    >
                      {post.category === 1 ? <AlertTriangle className="w-5 h-5" /> : post.category === 2 ? <Info className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                    </span>
                  </div>

                  {/* Post Content */}
                  <p className="text-deep-brown text-sm leading-relaxed mb-3 line-clamp-3">
                    {post.content}
                  </p>

                  {/* Linked Flag Location - PROMINENT DISPLAY */}
                  {post.flag && (
                    <div 
                      className="mb-3 p-3 rounded-xl border-2"
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
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: getCategoryColor(post.flag.category) }}
                          >
                            <span className="text-lg">
                              {post.flag.category === 1 ? <AlertTriangle className="w-5 h-5" /> : post.flag.category === 2 ? <Info className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-deep-brown truncate">
                              {post.flag.title}
                            </p>
                            <p className="text-xs text-taupe truncate">
                              {post.flag.category === 1 ? "Critical Alert" : post.flag.category === 2 ? "Information" : "General"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOnMap(post.flag!);
                          }}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-medium active:scale-95 transition-transform shadow-md"
                          style={{ backgroundColor: getCategoryColor(post.flag.category) }}
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Post Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-beige-medium">
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

        {/* Create Post Bottom Sheet */}
        <BottomSheet
          isOpen={isCreateSheetOpen}
          onClose={() => setIsCreateSheetOpen(false)}
          title="Create New Post"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-deep-brown mb-3">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewPost({ ...newPost, category: cat as 1 | 2 | 3 })}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                      newPost.category === cat
                        ? "text-white shadow-lg"
                        : "bg-beige-light text-deep-brown active:bg-beige-medium"
                    }`}
                    style={
                      newPost.category === cat
                        ? { backgroundColor: getCategoryColor(cat as 1 | 2 | 3) }
                        : undefined
                    }
                  >
                    <div className="text-lg mb-1">
                      {cat === 1 ? <AlertTriangle className="w-6 h-6" /> : cat === 2 ? <Info className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                    </div>
                    <div className="text-xs">
                      {cat === 1 ? "Critical" : cat === 2 ? "Info" : "General"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Link to Flag */}
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
                className="w-full h-11 px-4 rounded-lg border border-transparent bg-beige-light text-sm text-deep-brown focus:border-red-oxide focus:outline-none focus:ring-2 focus:ring-red-oxide/20"
              >
                <option value="">Select a location...</option>
                {flags.map((flag) => (
                  <option key={flag.id} value={flag.id}>
                    {flag.title} ({getCategoryLabel(flag.category)})
                  </option>
                ))}
              </select>
              {flags.length === 0 && (
                <p className="text-xs text-taupe mt-1">
                  No flags available. Create flags on the map first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-brown mb-2">Content</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Share with your community..."
                className="form-input form-textarea"
                rows={4}
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleCreatePost}
                disabled={!newPost.content.trim()}
                className="btn-primary"
              >
                <Plus className="w-5 h-5" />
                Post
              </button>
              <button onClick={() => setIsCreateSheetOpen(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* Post Detail Bottom Sheet */}
        <BottomSheet
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          title="Post Details"
        >
          {selectedPost && (
            <div className="space-y-5">
              {/* Post Header */}
              <div className="flex items-start gap-3">
                <UserAvatar name={selectedPost.author?.name || "Unknown"} size="md" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-deep-brown">
                    {selectedPost.author?.name || "Unknown"}
                  </h3>
                  <p className="text-xs text-taupe">{formatDate(selectedPost.createdAt)}</p>
                </div>
                <span 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: getCategoryColor(selectedPost.category) }}
                >
                  {selectedPost.category === 1 ? <AlertTriangle className="w-6 h-6" /> : selectedPost.category === 2 ? <Info className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 bg-beige-light rounded-xl">
                <p className="text-deep-brown leading-relaxed">{selectedPost.content}</p>
              </div>

              {/* Linked Flag - Detail View - PROMINENT */}
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
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg"
                      style={{ backgroundColor: getCategoryColor(selectedPost.flag.category) }}
                    >
                      {selectedPost.flag.category === 1 ? <AlertTriangle className="w-6 h-6" /> : selectedPost.flag.category === 2 ? <Info className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-playfair text-lg font-bold text-espresso">
                        {selectedPost.flag.title}
                      </h4>
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mt-1"
                        style={{ backgroundColor: getCategoryColor(selectedPost.flag.category) }}
                      >
                        {getCategoryLabel(selectedPost.flag.category)}
                      </span>
                    </div>
                  </div>

                  {selectedPost.flag.description && (
                    <div className="p-3 bg-white/60 rounded-xl mb-4">
                      <p className="text-deep-brown text-sm leading-relaxed">
                        {selectedPost.flag.description}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleViewOnMap(selectedPost.flag!)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium active:scale-95 transition-transform shadow-lg"
                    style={{ backgroundColor: getCategoryColor(selectedPost.flag.category) }}
                  >
                    <Navigation className="w-5 h-5" />
                    View on Map
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Comments Section */}
              <div className="border-t border-beige-medium pt-4">
                <h4 className="font-semibold text-deep-brown mb-4 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Comments ({getCommentsForPost(selectedPost.id).length})
                </h4>

                <div className="space-y-4 mb-4 max-h-[200px] overflow-y-auto">
                  {getCommentsForPost(selectedPost.id).map((comment) => (
                    <div key={comment.id} className="pl-3 border-l-2 border-beige-medium">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-deep-brown">
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

                {/* Add Comment */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    className="form-input flex-1"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="w-12 h-12 bg-red-oxide text-white rounded-xl flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                <label className="flex items-center gap-2 mt-3 text-sm text-taupe cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivateComment}
                    onChange={(e) => setIsPrivateComment(e.target.checked)}
                    className="w-4 h-4 rounded border-warm-sand text-red-oxide focus:ring-red-oxide"
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

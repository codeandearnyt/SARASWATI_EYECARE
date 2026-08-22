import { trpc } from "@/lib/trpc";
import { ArrowUpRight, BookOpen, CalendarDays, Clock3, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function HomeBlogSection({ onBookAppointment }: { onBookAppointment: () => void }) {
  const posts = trpc.blog.listPublished.useQuery();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const visiblePosts = (posts.data ?? []).slice(0, 3);
  const selectedPost = (posts.data ?? []).find(post => post.id === selectedId);

  const setArticleLocation = (slug?: string) => {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("article", slug);
    else url.searchParams.delete("article");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash || "#/"}`);
  };

  const openArticle = (id: number, slug: string) => {
    setSelectedId(id);
    setArticleLocation(slug);
  };

  const closeArticle = () => {
    setSelectedId(null);
    setArticleLocation();
  };

  useEffect(() => {
    if (!posts.data) return;
    const articleSlug = new URLSearchParams(window.location.search).get("article");
    const matchedPost = posts.data.find(post => post.slug === articleSlug);
    setSelectedId(matchedPost?.id ?? null);
  }, [posts.data]);

  return <section className="home-blog-section section" id="blog"><div className="container"><div className="home-blog-head"><div><div className="eyebrow"><span className="care-line" />Clinic insights</div><h2>Eye care guidance,<br /><i>made approachable.</i></h2></div><p>Short, specialist-authored explanations that help you recognise common eye-health questions and know when to arrange a consultation.</p></div>{posts.isLoading ? <div className="home-blog-loading"><Loader2 className="spin" size={20} /> Loading clinic insights…</div> : posts.isError ? <div className="home-blog-empty">Clinic insights are temporarily unavailable. Please call the care team if you need guidance today.</div> : visiblePosts.length === 0 ? <div className="home-blog-empty"><BookOpen size={24} /><div><strong>Clinic insights are being prepared.</strong><p>New educational articles published by the clinic team will appear here.</p></div></div> : <div className="home-blog-grid">{visiblePosts.map((post, index) => <motion.article key={post.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: index * .06, duration: .45 }}>{post.thumbnailUrl && <img className="home-blog-thumb" src={post.thumbnailUrl} alt="" loading="lazy" />}<div className="home-blog-card-top"><span>{post.category}</span>{post.isFeatured === 1 && <strong>Featured</strong>}</div><div className="home-blog-card-body"><p className="home-blog-meta"><CalendarDays size={14} />{formatDate(post.publishedAt)}<Clock3 size={14} />{post.readingMinutes} min read</p><h3>{post.title}</h3><p>{post.excerpt}</p><footer><span>{post.authorName}</span><button type="button" onClick={() => openArticle(post.id, post.slug)}>Read article <ArrowUpRight size={16} /></button></footer></div></motion.article>)}</div>}<div className="home-blog-cta"><div><span>Need personal clinical advice?</span><strong>Our care coordinator can help you book the right consultation.</strong></div><button type="button" onClick={onBookAppointment}>Book an appointment <ArrowUpRight size={17} /></button></div></div><AnimatePresence>{selectedPost && <motion.div className="home-article-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeArticle}><motion.article className="home-article-dialog" role="dialog" aria-modal="true" aria-label={selectedPost.title} initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .98 }} onClick={event => event.stopPropagation()}><button className="home-article-close" type="button" onClick={closeArticle} aria-label="Close article"><X size={20} /></button>{selectedPost.thumbnailUrl && <img className="home-article-thumb" src={selectedPost.thumbnailUrl} alt="" />}<span>{selectedPost.category}</span><h3>{selectedPost.title}</h3><p className="home-article-byline">{selectedPost.authorName} · {formatDate(selectedPost.publishedAt)} · {selectedPost.readingMinutes} min read</p><div>{selectedPost.content.split(/\n\s*\n/).map((paragraph, index) => <p key={`${selectedPost.id}-${index}`}>{paragraph}</p>)}</div><button className="home-article-book" type="button" onClick={() => { closeArticle(); onBookAppointment(); }}>Book a consultation <ArrowUpRight size={16} /></button></motion.article></motion.div>}</AnimatePresence></section>;
}

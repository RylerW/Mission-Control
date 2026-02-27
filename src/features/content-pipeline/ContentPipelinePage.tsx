import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { createContentIdea, getContentItems } from '../../services/mockApi';
import { ContentItem } from '../../types/domain';

const stages: ContentItem['status'][] = ['ideas', 'drafting', 'in-review', 'scheduled', 'published'];

export function ContentPipelinePage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentItem['type']>('blog');
  const [priority, setPriority] = useState<ContentItem['priority']>('medium');
  const [owner, setOwner] = useState('Marketing Ops');
  const [targetDate, setTargetDate] = useState('');
  const [tags, setTags] = useState('');

  const loadItems = async () => {
    const nextItems = await getContentItems();
    setItems(nextItems);
  };

  useEffect(() => {
    loadItems().catch((error) => {
      console.error('Failed to load content items', error);
    });
  }, []);

  const grouped = useMemo(() => stages.map((stage) => ({ stage, items: items.filter((i) => i.status === stage) })), [items]);

  const resetForm = () => {
    setTitle('');
    setType('blog');
    setPriority('medium');
    setOwner('Marketing Ops');
    setTargetDate('');
    setTags('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    setSubmitError(null);
    try {
      await createContentIdea({
        title: title.trim(),
        type,
        priority,
        owner,
        targetDate,
        tags: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      });

      await loadItems();
      resetForm();
      setOpen(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save content idea.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <SectionHeader
        title="Content Pipeline"
        description="Track work from ideas through publication for every channel."
        actions={<button onClick={() => setOpen(true)} className="rounded bg-sky-600 px-3 py-2 text-sm">New Idea</button>}
      />
      <div className="grid gap-4 xl:grid-cols-5">
        {grouped.map((group) => (
          <Card key={group.stage} title={group.stage.replace('-', ' ')}>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.id} className="rounded border border-border bg-slate-900 p-2">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.type} • {item.owner}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <StatusBadge status={item.priority} />
                    <span className="text-xs text-slate-400">{item.targetDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card title="New Idea" action={<button onClick={() => setOpen(false)} className="text-xs text-slate-300">Close</button>}>
            <form className="grid w-[28rem] gap-3 text-sm" onSubmit={handleSubmit}>
              <input
                placeholder="Title"
                className="rounded border border-border bg-slate-900 px-2 py-1"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
              <select className="rounded border border-border bg-slate-900 px-2 py-1" value={type} onChange={(event) => setType(event.target.value as ContentItem['type'])}>
                <option value="blog">Blog</option>
                <option value="video">Video</option>
                <option value="social">Social</option>
                <option value="email">Email</option>
              </select>
              <input
                placeholder="Owner"
                className="rounded border border-border bg-slate-900 px-2 py-1"
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
              />
              <select className="rounded border border-border bg-slate-900 px-2 py-1" value={priority} onChange={(event) => setPriority(event.target.value as ContentItem['priority'])}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                type="date"
                className="rounded border border-border bg-slate-900 px-2 py-1"
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
              />
              <input
                placeholder="Tags (comma separated)"
                className="rounded border border-border bg-slate-900 px-2 py-1"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />
              <button type="submit" disabled={isSaving} className="rounded bg-sky-600 px-3 py-2 disabled:opacity-60">
                {isSaving ? 'Saving...' : 'Save idea'}
              </button>
              {submitError && <p className="text-xs text-rose-300">{submitError}</p>}
            </form>
          </Card>
        </div>
      )}
    </>
  );
}

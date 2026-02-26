import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { getContentItems } from '../../services/mockApi';
import { ContentItem } from '../../types/domain';

const stages: ContentItem['status'][] = ['ideas', 'drafting', 'in-review', 'scheduled', 'published'];

export function ContentPipelinePage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getContentItems().then(setItems);
  }, []);

  const grouped = useMemo(() => stages.map((stage) => ({ stage, items: items.filter((i) => i.status === stage) })), [items]);

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
            <form className="grid w-[28rem] gap-3 text-sm">
              <input placeholder="Title" className="rounded border border-border bg-slate-900 px-2 py-1" />
              <select className="rounded border border-border bg-slate-900 px-2 py-1"><option>Blog</option><option>Short-form video</option><option>Social post</option><option>Email</option></select>
              <input placeholder="Tags" className="rounded border border-border bg-slate-900 px-2 py-1" />
              <select className="rounded border border-border bg-slate-900 px-2 py-1"><option>High</option><option>Medium</option><option>Low</option></select>
              <textarea placeholder="Brief description" className="rounded border border-border bg-slate-900 px-2 py-1" rows={3} />
              <input placeholder="Target channels" className="rounded border border-border bg-slate-900 px-2 py-1" />
              <button type="button" onClick={() => setOpen(false)} className="rounded bg-sky-600 px-3 py-2">Save idea</button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}

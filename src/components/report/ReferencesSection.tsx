'use client';

import { ExternalLink } from 'lucide-react';
import type { References } from '@/types';

interface Props {
  references: References;
}

export function ReferencesSection({ references }: Props) {
  return (
    <div className="space-y-8">
      {/* ポストスケイプ実績 */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          ポストスケイプ過去実績
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          出典:{' '}
          <a
            href="https://conversion-labo.jp/works/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            https://conversion-labo.jp/works/
          </a>
        </p>

        {references.postscapeWorks && references.postscapeWorks.length > 0 ? (
          <div className="space-y-4">
            {references.postscapeWorks.map((work, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-600 font-bold">{index + 1}.</span>
                      <h4 className="text-slate-800 font-medium">{work.title}</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      <span className="text-emerald-600">類似点：</span>
                      {work.similarity}
                    </p>
                    <div>
                      <span className="text-sm text-amber-600">応用できる要素：</span>
                      <ul className="mt-1 space-y-1">
                        {work.applicableElements.map((elem, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <span className="text-slate-400">・</span>
                            {elem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {work.url && (
                    <a
                      href={work.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">参考実績が見つかりませんでした。</p>
        )}
      </div>

      {/* ギャラリーサイト */}
      {references.gallerySites && references.gallerySites.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            ギャラリーサイトからの参考
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {references.gallerySites.map((site, index) => (
              <a
                key={index}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                    {site.source}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-slate-400 group-hover:text-slate-600 transition"
                  />
                </div>
                <h4 className="text-slate-800 font-medium mb-1">{site.title}</h4>
                <p className="text-sm text-slate-600">{site.similarity}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

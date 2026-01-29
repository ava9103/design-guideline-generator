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
        <h3 className="text-lg font-semibold text-white mb-4">
          ポストスケイプ過去実績
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          出典:{' '}
          <a
            href="https://conversion-labo.jp/works/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            https://conversion-labo.jp/works/
          </a>
        </p>

        {references.postscapeWorks && references.postscapeWorks.length > 0 ? (
          <div className="space-y-4">
            {references.postscapeWorks.map((work, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-400 font-bold">{index + 1}.</span>
                      <h4 className="text-white font-medium">{work.title}</h4>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      <span className="text-emerald-400">類似点：</span>
                      {work.similarity}
                    </p>
                    <div>
                      <span className="text-sm text-yellow-400">応用できる要素：</span>
                      <ul className="mt-1 space-y-1">
                        {work.applicableElements.map((elem, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-slate-500">・</span>
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
                      className="flex-shrink-0 p-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">参考実績が見つかりませんでした。</p>
        )}
      </div>

      {/* ギャラリーサイト */}
      {references.gallerySites && references.gallerySites.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            ギャラリーサイトからの参考
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {references.gallerySites.map((site, index) => (
              <a
                key={index}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                    {site.source}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-slate-500 group-hover:text-white transition"
                  />
                </div>
                <h4 className="text-white font-medium mb-1">{site.title}</h4>
                <p className="text-sm text-slate-400">{site.similarity}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

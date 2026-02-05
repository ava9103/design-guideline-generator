'use client';

import { useMemo } from 'react';

interface Position {
  x: number; // -100 to 100
  y: number; // -100 to 100
}

interface Competitor {
  name: string;
  x: number;
  y: number;
}

interface PositioningMapProps {
  xAxis: {
    label: string;
    leftLabel: string;
    rightLabel: string;
  };
  yAxis: {
    label: string;
    topLabel: string;
    bottomLabel: string;
  };
  selfPosition: Position;
  competitors: Competitor[];
  selfName?: string;
}

export function PositioningMap({
  xAxis,
  yAxis,
  selfPosition,
  competitors,
  selfName = '自社',
}: PositioningMapProps) {
  // 座標を-100~100から0~100%に変換
  const toPercentage = (value: number) => ((value + 100) / 200) * 100;

  const selfPos = useMemo(
    () => ({
      left: `${toPercentage(selfPosition.x)}%`,
      top: `${100 - toPercentage(selfPosition.y)}%`,
    }),
    [selfPosition]
  );

  const competitorPositions = useMemo(
    () =>
      competitors.map((c) => ({
        ...c,
        left: `${toPercentage(c.x)}%`,
        top: `${100 - toPercentage(c.y)}%`,
      })),
    [competitors]
  );

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        ポジショニングマップ
      </h3>
      
      <div className="relative bg-slate-50 rounded-lg border border-slate-200 p-4">
        {/* Y軸ラベル（上） */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-medium text-slate-600">
          {yAxis.topLabel}
        </div>
        
        {/* Y軸ラベル（下） */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-medium text-slate-600">
          {yAxis.bottomLabel}
        </div>
        
        {/* X軸ラベル（左） */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 writing-mode-vertical">
          {xAxis.leftLabel}
        </div>
        
        {/* X軸ラベル（右） */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 writing-mode-vertical">
          {xAxis.rightLabel}
        </div>

        {/* グラフエリア */}
        <div className="relative mx-8 my-8 aspect-square max-w-md mx-auto">
          {/* グリッド背景 */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* 縦横の中心線 */}
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="#cbd5e1"
              strokeWidth="0.5"
            />
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="#cbd5e1"
              strokeWidth="0.5"
            />
            
            {/* グリッド線 */}
            {[25, 75].map((pos) => (
              <g key={pos}>
                <line
                  x1={pos}
                  y1="0"
                  x2={pos}
                  y2="100"
                  stroke="#e2e8f0"
                  strokeWidth="0.3"
                  strokeDasharray="2,2"
                />
                <line
                  x1="0"
                  y1={pos}
                  x2="100"
                  y2={pos}
                  stroke="#e2e8f0"
                  strokeWidth="0.3"
                  strokeDasharray="2,2"
                />
              </g>
            ))}
          </svg>

          {/* 競合マーカー */}
          {competitorPositions.map((comp, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: comp.left, top: comp.top }}
            >
              <div className="relative">
                {/* マーカー */}
                <div className="w-4 h-4 rounded-full bg-slate-400 border-2 border-white shadow-md" />
                
                {/* ラベル */}
                <div className="absolute left-1/2 -translate-x-1/2 top-5 whitespace-nowrap">
                  <span className="text-xs text-slate-600 bg-white px-1 py-0.5 rounded shadow-sm">
                    {comp.name}
                  </span>
                </div>
                
                {/* ホバー時の詳細 */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {comp.name}
                    <br />
                    X: {comp.x}, Y: {comp.y}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 自社マーカー */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: selfPos.left, top: selfPos.top }}
          >
            <div className="relative">
              {/* マーカー（大きめ、アクセントカラー） */}
              <div className="w-6 h-6 rounded-full bg-emerald-500 border-3 border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              
              {/* ラベル */}
              <div className="absolute left-1/2 -translate-x-1/2 top-7 whitespace-nowrap">
                <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-0.5 rounded shadow-sm border border-emerald-200">
                  {selfName}
                </span>
              </div>
              
              {/* ホバー時の詳細 */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-emerald-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {selfName}
                  <br />
                  X: {selfPosition.x}, Y: {selfPosition.y}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 軸ラベル（タイトル） */}
        <div className="flex justify-center gap-8 mt-4 text-xs text-slate-500">
          <div>
            <span className="font-medium">X軸:</span> {xAxis.label}
          </div>
          <div>
            <span className="font-medium">Y軸:</span> {yAxis.label}
          </div>
        </div>
      </div>

      {/* 凡例 */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow" />
          <span className="text-slate-600">{selfName}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-400 border-2 border-white shadow" />
          <span className="text-slate-600">競合</span>
        </div>
      </div>
    </div>
  );
}

export const SYSTEM_PROMPT = `あなたは、競合調査結果とクライアントのサービス特性をもとに、
**実務で即活用できるデザインガイドライン**を体系的に設計する専門エージェントです。

デザインにおける「調和」と「差別化」を両立させ、以下の3層構造で戦略的なガイドラインを提供します。

---

## 役割定義

このエージェントは、競合調査結果とクライアントのサービス特性をもとに、デザインガイドラインを生成します。
特に以下の点を重視してください：

1. **具体性の徹底**：「ゴシック体」ではなく「Noto Sans JP Medium」、「明るい色」ではなく「#3B82F6」など具体的に
2. **心理的根拠の明示**：すべての選択に「なぜそれを選ぶのか」の心理効果を付記

---

## 3層構造

### 第1層：デザインで達成すべきゴール
- 競合調査結果を踏まえた差別化ポイント（3-5項目）
- ユーザーに感じてもらうべき印象キーワード（5-7個）
- 各キーワードの根拠（自社の強み、顧客ニーズ、競合との差別化）
- **競合差別化マップ**：競合との位置関係を2軸で視覚化

### 第2層：デザインコンセプトの提言
- コンセプトステートメント（1-2文で核となる価値を表現）
- デザイン原則（4-5項目）
- 本LPの位置づけ（どういう性質のものか）
- デザイン禁止事項（コンセプトと矛盾する表現）

### 第3層：デザインガイドライン
- **フォント種類**：具体的なフォント名（游ゴシック Medium、Noto Sans JP等）とウェイト
- **フォントサイズ**：PC/スマホ別の具体的なpx値、ジャンプ率
- **配色**：メイン/サブ/アクセントのHEX値と使用比率（60-30-10ルール）
- **イラスト**：スタイル、トーン、色数、NG例
- **写真**：トーン、被写体、構図、NG例
- **レイアウト**：グリッド、余白、レスポンシブ対応
- **UIコンポーネント**：ボタン、フォーム、カードのスタイル

---

## カラーシステムの原則（60-30-10ルール）

配色は以下の3層構造で設計してください：

| レイヤー | 比率 | 用途 | 心理効果 |
|---------|------|------|----------|
| **サブカラー** | 60% | 背景・余白 | 安定感・信頼感を醸成 |
| **メインカラー** | 30% | ブランド表現・見出し | ブランドアイデンティティの核 |
| **アクションカラー** | 10% | CTA・重要数値 | 行動喚起・視線誘導 |

**業種別カラー推奨：**
- 保険・金融：ブルー（信頼）×ゴールド（上質）×オレンジ（行動喚起）
- SaaS・テック：ディープブルー（専門性）×グレー（洗練）×グリーン（成長）
- 教育・スクール：スカイブルー（知性）×ホワイト（清潔）×オレンジ（希望）
- 医療・ヘルスケア：メディカルブルー（清潔）×アイスブルー（安心）×ティール（癒し）

---

## タイポグラフィの原則

### ジャンプ率（視覚的強弱）
| レベル | H1/本文比 | 推奨業種 | 効果 |
|--------|----------|----------|------|
| 高 | 2.5:1以上 | SaaS・EC・スタートアップ | スクロール率15%向上 |
| 中 | 2.0:1 | 保険・金融・教育 | 信頼感と可読性のバランス |
| 低 | 1.7:1 | 医療・法律・高級ブランド | 落ち着いた専門的な印象 |

### 業種別フォント選定
- **明朝体系**：信頼・品格・高級感（保険・金融・不動産・法律）
  - 推奨：游明朝、Noto Serif JP、Shippori Mincho
- **ゴシック体**：モダン・洗練・先進性（SaaS・テック・EC）
  - 推奨：游ゴシック、Noto Sans JP、BIZ UDGothic
- **丸ゴシック**：親しみやすさ・安心感（教育・子供向け・女性向け）
  - 推奨：Zen Maru Gothic、Kosugi Maru

### サイズルール
- **スマホ本文**：16px以上を厳守（16px未満は離脱率23%上昇）
- **行間**：日本語本文は1.7-1.8倍
- **数字強調**：48-72px（PC）/ 32-56px（SP）で実績データを目立たせる

---

## 出力原則（厳守）

1. **具体性**：
   - 色は必ずHEX値で指定（例：#003D7A）
   - フォントは正式名称とウェイト（例：Noto Sans JP Medium）
   - サイズは具体的なpx値（例：16px、24-32px）

2. **心理的根拠の明示**：
   - すべての選択に「なぜ」を付記
   - CVRへの影響を可能な限り数値で示す

3. **ブランド固有の設計**：
   - 業界の一般的な色ではなく、このブランド固有の色を導き出す
   - サービス概要・差別化ポイント・コンセプトから色を選定
   - 競合との差別化を意識した配色

4. **実務での使いやすさ**：
   - デザイナーがすぐに実装できる形式
   - Google Fonts/Adobe Fonts のURLを可能な限り記載
   - 「やること」と「やらないこと」の両方を明示

5. **日本市場への最適化**：
   - 日本語フォントの特性を考慮
   - 日本のLP/Webデザイントレンドを反映

---

## 品質ルール（必須）

1. **重複禁止**：各項目のreason（理由）は、それぞれ異なる内容に
2. **定型文の回避**：テンプレート的な文の繰り返しを避ける
3. **禁止用語**：「サイト分析」は使用禁止。「サービス」「ブランド」「LP」を使用
4. **論理的な説明**：ターゲット心理、業界特性、競合差別化、心理効果から説明
5. **文体**：すべて「ですます」調で記述

---

## 品質チェックリスト

出力前に以下を確認してください：

□ すべての色にHEX値が指定されているか
□ すべてのフォントに具体的な名称とウェイトがあるか
□ すべてのサイズにpx値（または範囲）があるか
□ 心理的根拠が各選択に付記されているか
□ NG例（やらないこと）が明示されているか
□ 競合との差別化が明確か
`;

export const LAYER1_GOALS_PROMPT = `
以下の分析結果をもとに、デザインで達成すべきゴールを定義してください。

【自社サービス情報】
URL: {targetUrl}
タイトル: {targetTitle}
説明: {targetDescription}
業界: {industry}
サービスタイプ: {serviceType}
コンバージョン目標: {conversionGoal}
競合優位性: {competitiveAdvantage}

【ターゲットユーザー】
ペルソナ: {personaName}
年齢層: {personaAge}
職業: {personaOccupation}
ゴール: {personaGoals}
ペインポイント: {personaPainPoints}
価値観: {personaValues}

【競合分析】
{competitorSummary}

【デザイントレンド】
業界の当たり前: {conventions}
差別化の機会: {opportunities}
避けるべきパターン: {antiPatterns}

【出力形式】
以下のJSON形式で出力してください：

{
  "differentiationPoints": [
    {
      "title": "差別化ポイントのタイトル（簡潔に1行で）"
    }
  ],
  "impressionKeywords": ["キーワード1", "キーワード2", "キーワード3", "キーワード4", "キーワード5"],
  "summary": "このLPデザインは「[キーワード1] × [キーワード2] × [キーワード3]」という印象を通じて、「[ターゲット層]が[どう感じ]、[どう行動する]か」を促すことをゴールとします"
}

【品質要件】

■ differentiationPointsについて：
- 3-5項目を記述
- タイトルは簡潔に1行で表現（長い説明は不要）

■ impressionKeywordsについて：
- 5-7個のキーワードを選定
- 「信頼性」「親しみやすさ」「先進性」など、デザインで表現可能なキーワード

JSONのみを出力してください。
`;

export const LAYER2_CONCEPT_PROMPT = `
以下のデザインゴールを達成するための、デザインコンセプトを提案してください。

【デザインゴール】
差別化ポイント: {differentiationPoints}
印象キーワード: {impressionKeywords}

【サービス情報】
サービス名/タイトル: {targetTitle}
業界: {industry}
ターゲット: {targetAudience}
コンバージョン目標: {conversionGoal}

【競合のデザイントーン】
{competitorDesignTones}

【出力形式】
以下のJSON形式で出力してください：

{
  "statement": "コンセプトステートメント（1-2文で核となる価値と表現方法を記述）",
  "principles": [
    {
      "title": "原則のタイトル（簡潔に1行で、例：派手な演出より静かな説得力）"
    }
  ],
  "positioning": "本LPの位置づけ（1文で簡潔に）",
  "prohibitions": [
    {
      "item": "禁止事項（簡潔に、例：過度な煽り文句の連発）"
    }
  ]
}

【品質要件】
■ principlesについて：
- 4-5項目を記述
- タイトルは簡潔に1行で（長い説明は不要）

■ prohibitionsについて：
- 3-4項目を記述
- 簡潔に禁止事項のみ記載

JSONのみを出力してください。
`;

export const LAYER3_GUIDELINES_PROMPT = `
以下のデザインコンセプトを具現化するための、具体的なデザインガイドラインを作成してください。

【サービス・ブランド情報】
サービス名: {serviceName}
サービス概要: {serviceDescription}
差別化ポイント: {differentiationPoints}

【デザインコンセプト】
ステートメント: {conceptStatement}
原則: {conceptPrinciples}
位置づけ: {positioning}

【印象キーワード】
{impressionKeywords}

【業界・ターゲット情報】
業界: {industry}
ターゲット: {targetAudience}
競合のデザイン傾向: {competitorDesigns}

{industryPreset}

【CVR向上のための設計原則】
以下の知見を踏まえて、心理的根拠付きでデザインを選定してください：

■ カラー設計（重要）
- **このブランド固有の色を設計してください**：業界の一般的な色ではなく、上記のサービス概要・差別化ポイント・コンセプトから導き出される固有の色を選定してください
- 色選定の根拠として「このブランドの特徴」「ターゲットの心理」「差別化ポイント」を必ず含めてください
- 60-30-10ルール: サブ60%・メイン30%・アクション10%
- CTAボタンは背景との対比を明確に（コントラスト比4.5:1以上）

■ タイポグラフィ設計
- スマホ本文は16px以上を厳守（16px未満は離脱率23%上昇）
- ジャンプ率（H1と本文のサイズ比）は2:1以上を推奨（スクロール率15%向上）
- 日本語本文の行間は1.7-1.8倍

■ 業種別フォント選定
- 保険・金融・不動産: 明朝体系（信頼・品格）
- SaaS・テック: ゴシック体（先進性・洗練）
- 教育・子供向け: 丸ゴシック（親しみやすさ）

【出力形式】
以下のJSON形式で、実務で即使用できる具体的なガイドラインを出力してください。
すべての選択に「心理的根拠」「CVRへの影響」を含めてください：

{
  "typography": {
    "mainFont": {
      "japanese": {
        "name": "游ゴシック Medium または Noto Sans JP または ヒラギノ角ゴ W6 など具体的なフォント名",
        "reason": "選定理由（心理効果・CVRへの影響を含む）",
        "weights": [
          {"use": "H1（メインキャッチ）", "weight": "Bold / 700"},
          {"use": "H2（セクション見出し）", "weight": "Medium / 500"}
        ],
        "googleFontsUrl": "Google Fontsで利用可能な場合のURL",
        "adobeFontsUrl": "Adobe Fontsで利用可能な場合のURL"
      },
      "western": {
        "name": "欧文フォント名",
        "reason": "選定理由",
        "googleFontsUrl": "URL"
      }
    },
    "subFont": {
      "japanese": {
        "name": "本文用フォント名",
        "reason": "選定理由",
        "googleFontsUrl": "URL"
      },
      "western": {
        "name": "欧文フォント名",
        "reason": "選定理由"
      }
    },
    "numberFont": {
      "name": "数字強調用フォント",
      "reason": "選定理由"
    },
    "sizeSystem": [
      {"element": "H1（大見出し）", "pc": "36-48px", "sp": "24-32px", "lineHeight": "1.2-1.3", "usage": "メインメッセージ"},
      {"element": "H2（中見出し）", "pc": "26-32px", "sp": "20-24px", "lineHeight": "1.3-1.4", "usage": "セクション見出し"},
      {"element": "本文", "pc": "16-17px", "sp": "16px", "lineHeight": "1.7-1.8", "usage": "通常テキスト"},
      {"element": "数値強調", "pc": "48-72px", "sp": "32-48px", "lineHeight": "1.0-1.2", "usage": "実績データ"}
    ],
    "jumpRatio": {
      "level": "high または medium または low",
      "h1ToBody": 2.5,
      "h2ToBody": 1.8,
      "description": "視覚的強弱の方針説明",
      "rationale": "この業界・ターゲットになぜこのジャンプ率が適切かの根拠"
    },
    "industryContext": {
      "industry": "業界名",
      "fontStyle": "mincho または gothic または maru-gothic または mixed",
      "psychologicalEffect": "このフォントスタイルが与える心理効果",
      "cvrImpact": "CVRへの影響（データがあれば）"
    }
  },
  "color": {
    "mainColor": {
      "name": "色の名前（例：ディープブルー）",
      "hex": "#003D7A",
      "brandReason": "このブランド/サービスにこの色を選んだ具体的理由（差別化ポイント、コンセプトとの関連）",
      "psychologicalEffect": "この色が与える心理効果と無意識への働きかけ",
      "usage": ["使用箇所1", "使用箇所2"],
      "ratio": "30%"
    },
    "subColor": {
      "name": "色の名前",
      "hex": "#F5F5F5",
      "brandReason": "このブランドにこの色を選んだ理由",
      "psychologicalEffect": "心理効果",
      "usage": ["使用箇所"],
      "ratio": "60%"
    },
    "accentColor": {
      "name": "色の名前",
      "hex": "#D97706",
      "brandReason": "このブランドのCTAにこの色を選んだ理由",
      "psychologicalEffect": "行動喚起の心理メカニズム",
      "usage": ["CTA", "重要数値"],
      "ratio": "10%"
    },
    "textColors": {
      "primary": "#333333",
      "secondary": "#666666",
      "tertiary": "#999999",
      "inverse": "#FFFFFF"
    },
    "colorSystemRationale": "このブランド固有の配色システムを選んだ理由（サービス特徴・差別化ポイント・コンセプトとの関連を含む）"
  },
  "visual": {
    "photo": {
      "tone": "推奨トーン（例：やや落ち着いた明度）",
      "brightness": "明るさ（例：中〜やや暗め）",
      "saturation": "彩度（例：低〜中彩度）",
      "colorTemperature": "色温度（例：ニュートラル〜やや暖色）",
      "subjects": ["推奨被写体1", "推奨被写体2"],
      "composition": ["構図のガイド1", "ガイド2"],
      "ngExamples": ["避けるべき写真1", "避けるべき写真2"]
    },
    "illustration": {
      "style": "イラストスタイル（例：シンプルな線画、フラットイラスト）",
      "tone": "トーン（例：落ち着いた、親しみやすい）",
      "colorCount": "色数（例：2-3色以内）",
      "lineWeight": "線の太さ（例：均一で細め）",
      "examples": ["具体的なイラスト例1", "例2"],
      "ngExamples": ["避けるべきイラスト1", "例2"]
    }
  },
  "layout": {
    "grid": {
      "columns": 12,
      "gutter": "24px",
      "margin": "5%"
    },
    "spacing": {
      "unit": "8px",
      "sectionGap": "80-120px",
      "elementGap": "24-40px"
    },
    "maxWidth": "1200px",
    "responsiveBreakpoints": [
      {"name": "desktop", "minWidth": "1200px", "description": "デスクトップ"},
      {"name": "tablet", "minWidth": "768px", "description": "タブレット"},
      {"name": "mobile", "minWidth": "0px", "description": "モバイル"}
    ]
  },
  "ui": {
    "buttons": {
      "primary": {
        "backgroundColor": "#D97706",
        "textColor": "#FFFFFF",
        "borderRadius": "8px",
        "padding": "16px 32px",
        "fontSize": "16px",
        "hoverEffect": "明度を10%下げる",
        "psychologicalRationale": "このCTAデザインが行動を促す理由"
      },
      "secondary": {
        "backgroundColor": "transparent",
        "textColor": "#003D7A",
        "borderRadius": "8px",
        "padding": "14px 28px",
        "fontSize": "14px",
        "hoverEffect": "背景色を薄くする"
      }
    },
    "ctaRecommendations": [
      {
        "recommendation": "CTA改善提案",
        "evidence": "根拠となるデータや心理原則",
        "expectedImpact": "期待される効果"
      }
    ]
  }
}

JSONのみを出力してください。
`;

export const REFERENCES_PROMPT = `
以下のデザインコンセプトに近い参考実例を提案してください。

【デザインコンセプト】
印象キーワード: {impressionKeywords}
コンセプト: {conceptStatement}
業界: {industry}

【ポストスケイプの過去実績情報】
（https://conversion-labo.jp/works/ より）
{worksData}

【競合のデザイン】
{competitorDesigns}

【出力形式】
以下のJSON形式で出力してください：

{
  "postscapeWorks": [
    {
      "title": "案件名（上記の実績情報から選択）",
      "url": "URL（わかる場合）",
      "similarity": "今回のコンセプトとの類似点",
      "applicableElements": ["応用できる要素1", "要素2"]
    }
  ],
  "gallerySites": [
    {
      "title": "参考サイト名",
      "url": "URL",
      "source": "SANKOU! または LPアーカイブ または I/O 3000 など",
      "similarity": "類似点",
      "applicableElements": ["応用できる要素"]
    }
  ]
}

JSONのみを出力してください。
`;

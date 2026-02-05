export const SYSTEM_PROMPT = `あなたは、競合調査結果とクライアントのサービス特性をもとに、
実務で即活用できるデザインガイドラインを体系的に設計する専門エージェントです。

デザインにおける「調和」と「差別化」を両立させ、以下の3層構造で戦略的なガイドラインを提供します:

## 第1層：デザインで達成すべきゴール
- 競合調査結果を踏まえた差別化ポイント
- ユーザーに感じてもらうべき印象キーワード（5-7個）
  例）信頼性 / 先進性 / 利便性 / 清潔感 / 堅実 / 誠実
- 各キーワードの根拠（自社の強み、顧客ニーズ、競合との差別化）

## 第2層：デザインコンセプトの提言
- コンセプトステートメント（1-2文で核となる価値を表現）
- デザイン原則（3-5項目）
- 本LPの位置づけ（どういう性質のものか）
- デザイン禁止事項（コンセプトと矛盾する表現）

## 第3層：デザインガイドライン
- フォント種類：具体的なフォント名（游ゴシック、Noto Sans JP等）
- フォントサイズ：PC/スマホ別の具体的なpx値
- 配色：メイン/サブ/アクセントのHEX値と使用比率（60-30-10ルール）
- イラストイメージ例：スタイル、トーン、具体的な説明
- 写真イメージ例：トーン、被写体、構図のガイド

## カラーシステムの原則（60-30-10ルール）
配色は以下の3層構造で設計してください：
- **サブカラー（60%）**: 背景・余白に使用。安定感・信頼感を醸成
- **メインカラー（30%）**: ブランドカラー。ヘッダー・フッター・セクション背景
- **アクションカラー（10%）**: CTA・重要数値・リンク。行動喚起に使用

また、「エモーショナルカラー」として、ユーザーの無意識に働きかける色を検討してください。
例）保険業界：ブルー（信頼）×ゴールド（上質）×オレンジ（行動喚起）

## タイポグラフィの原則
- **ジャンプ率**: 見出しと本文のサイズ比を意識（2:1以上でスクロール率15%向上）
- **業種別フォント選定**:
  - 明朝体系: 信頼・品格・高級感（保険・金融・不動産）
  - ゴシック体: モダン・洗練・先進性（SaaS・テック）
  - 丸ゴシック: 親しみやすさ・安心感（教育・子供向け）
- **モバイル本文サイズ**: 16px（24pt）未満は離脱率23%上昇

## CVR（コンバージョン率）向上の知見
すべてのデザイン選択に「なぜこの色/フォントが効くのか」の心理的根拠を明示してください。
例）「オレンジCTAを採用 → 理由: 緊急性を煽らず前向きなアクションを促す。同条件ABテストでCVR 1.8%→2.4%改善」

## 出力原則
1. **具体性**：「ゴシック体」ではなく「游ゴシック Medium」など具体的に
2. **心理的根拠の明示**：すべての選択に「なぜそれを選ぶのか」の心理効果を付記
3. **CVRへの影響**：デザイン選択がコンバージョンにどう影響するかを説明
4. **実務での使いやすさ**：デザイナーがすぐに実装できる形式
5. **競合との差別化**：「競合がやっていること」と「自社がやるべきこと」を対比
6. **日本のLP/Webデザインに適した提案**：日本語フォント、日本市場のトレンドを考慮
7. **文体**：すべての説明文・理由・根拠は「ですます」調で記述してください（例：「〜です」「〜します」「〜になります」）

## 品質ルール（必須）
1. **重複禁止**：各項目のreason（理由）や説明文は、それぞれ異なる内容にしてください。同じ言い回しや類似表現の繰り返しは厳禁です
2. **定型文の回避**：「〜することで、〜できる」のようなテンプレート的な文を繰り返さないでください。各説明は具体的かつユニークに
3. **禁止用語**：「サイト分析」という言葉は内部処理用語のため、出力に含めないでください。代わりに「サービス」「商品」「ブランド」「LP」など文脈に適した言葉を使用してください
4. **論理的な説明**：各理由は、ターゲットユーザー、業界特性、競合との差別化、心理効果など異なる観点から論理的に説明してください
`;

export const LAYER1_GOALS_PROMPT = `
以下の分析結果をもとに、デザインで達成すべきゴールを定義してください。

【自社サイト分析】
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
      "title": "差別化ポイントのタイトル",
      "reason": "この差別化が有効な理由（競合との比較を含む）"
    }
  ],
  "impressionKeywords": ["キーワード1", "キーワード2", "キーワード3", "キーワード4", "キーワード5"],
  "keywordDetails": [
    {
      "keyword": "キーワード1",
      "reasons": [
        "このキーワードを選んだ理由1（自社の強みとの関連）",
        "このキーワードを選んだ理由2（顧客ニーズとの関連）",
        "このキーワードを選んだ理由3（競合との差別化）"
      ]
    }
  ]
}

【keywordDetailsの品質要件】
- 各キーワードの3つのreasonsは、それぞれ**完全に異なる観点**から説明してください
- 「〜することで、〜できる」のような同じ文型を繰り返さないでください
- 「サイト分析」という言葉は使用禁止です。「サービス」「商品」「ブランド」などを使ってください
- 各reasonは具体的な根拠やデータに基づいた説明にしてください
- キーワード間でも説明が類似しないよう、各キーワード固有の理由を記述してください

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
      "title": "原則のタイトル（例：派手な演出より、静かな説得力）",
      "reason": "この原則を採用する理由"
    }
  ],
  "positioning": "本LPの位置づけ（例：本LPは「売るための広告」ではなく、合理的な判断を促す説明資料のWeb化を目指す）",
  "prohibitions": [
    {
      "item": "禁止事項（例：過度な煽り文句の連発）",
      "reason": "禁止する理由"
    }
  ]
}

【品質要件】
■ principlesについて：
- 各原則のreasonは、それぞれ**異なる観点**（ターゲット心理、業界慣習、競合差別化、CVR向上など）から説明してください
- 同じ言い回しや類似表現を繰り返さないでください
- 「サービスの魅力を伝える」「ユーザーに訴求する」など、具体的なサービス/商品に言及した理由にしてください

■ prohibitionsについて：
- 各禁止事項のreasonは、**具体的な悪影響**を説明してください（例：離脱率上昇、信頼性低下、ブランドイメージ毀損など）
- 「サイト分析」という言葉は使用禁止です。「サービス内容」「商品の価値」「ブランドメッセージ」などを使ってください
- 各reasonは重複しない、ユニークな内容にしてください

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
- エモーショナルカラーで無意識に働きかける

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
    "emotionalColor": {
      "name": "エモーショナルカラー名（例：セーフティグリーン）",
      "hex": "#10B981",
      "purpose": "どのような感情・連想を喚起するか",
      "mechanism": "心理メカニズムの説明",
      "usage": ["使用箇所"]
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

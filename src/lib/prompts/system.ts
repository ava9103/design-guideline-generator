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
- 配色：メイン/サブ/アクセントのHEX値と使用比率
- イラストイメージ例：スタイル、トーン、具体的な説明
- 写真イメージ例：トーン、被写体、構図のガイド

## 出力原則
1. **具体性**：「ゴシック体」ではなく「游ゴシック Medium」など具体的に
2. **理由の明示**：すべての選択に「なぜそれを選ぶのか」を付記
3. **実務での使いやすさ**：デザイナーがすぐに実装できる形式
4. **競合との差別化**：「競合がやっていること」と「自社がやるべきこと」を対比
5. **日本のLP/Webデザインに適した提案**：日本語フォント、日本市場のトレンドを考慮
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

JSONのみを出力してください。
`;

export const LAYER3_GUIDELINES_PROMPT = `
以下のデザインコンセプトを具現化するための、具体的なデザインガイドラインを作成してください。

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

【出力形式】
以下のJSON形式で、実務で即使用できる具体的なガイドラインを出力してください：

{
  "typography": {
    "mainFont": {
      "japanese": {
        "name": "游ゴシック Medium または Noto Sans JP または ヒラギノ角ゴ W6 など具体的なフォント名",
        "reason": "選定理由",
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
      {"element": "本文", "pc": "16px", "sp": "16px", "lineHeight": "1.7-1.8", "usage": "通常テキスト"},
      {"element": "数値強調", "pc": "48-72px", "sp": "32-48px", "lineHeight": "1.0-1.2", "usage": "実績データ"}
    ]
  },
  "color": {
    "mainColor": {
      "name": "色の名前（例：ディープブルー）",
      "hex": "#003D7A",
      "psychologicalEffect": "この色が与える心理効果",
      "usage": ["使用箇所1", "使用箇所2"],
      "ratio": "30%"
    },
    "subColor": {
      "name": "色の名前",
      "hex": "#F5F5F5",
      "psychologicalEffect": "心理効果",
      "usage": ["使用箇所"],
      "ratio": "60%"
    },
    "accentColor": {
      "name": "色の名前",
      "hex": "#D97706",
      "psychologicalEffect": "心理効果",
      "usage": ["CTA", "重要数値"],
      "ratio": "10%"
    },
    "textColors": {
      "primary": "#333333",
      "secondary": "#666666",
      "tertiary": "#999999",
      "inverse": "#FFFFFF"
    }
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
        "hoverEffect": "明度を10%下げる"
      },
      "secondary": {
        "backgroundColor": "transparent",
        "textColor": "#003D7A",
        "borderRadius": "8px",
        "padding": "14px 28px",
        "fontSize": "14px",
        "hoverEffect": "背景色を薄くする"
      }
    }
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

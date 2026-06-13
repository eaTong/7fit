/**
 * CodeDisplay — 代码展示组件（共享）
 *
 * 功能：
 * - 显示代码片段，含基础语法高亮
 * - 半透明科技感背景 + 霓虹边框
 * - 行号显示
 *
 * 语法高亮（手动正则解析，无外部依赖）：
 * - 关键字: #FF4500
 * - 字符串: #00FF88
 * - 注释: #666888
 * - 数字: #00CCFF
 * - 函数名: #FFD700
 * - 括号/符号: #888899
 */

import type { CSSProperties } from "react";

interface CodeDisplayProps {
  code: string;
  language?: string;
  fontSize?: number;
  showLineNumbers?: boolean;
  /** 最大高度，超出内部滚动 */
  maxHeight?: number;
  /** 去掉容器背景和边框（用于 ShotContent 嵌入）*/
  plain?: boolean;
  style?: CSSProperties;
}

type TokenType = "keyword" | "string" | "comment" | "number" | "function" | "punctuation" | "plain";

interface Token {
  type: TokenType;
  text: string;
}

/** 简单语法高亮解析 */
function tokenize(code: string, language: string): Token[][] {
  const lines = code.split("\n");
  const keywords = new Set([
    "const", "let", "var", "function", "return", "if", "else", "for", "while",
    "class", "extends", "import", "export", "from", "default", "async", "await",
    "try", "catch", "throw", "new", "this", "super", "typeof", "instanceof",
    "interface", "type", "enum", "implements", "private", "public", "protected",
    "static", "readonly", "abstract", "declare", "namespace", "module",
  ]);

  return lines.map((line) => {
    const tokens: Token[] = [];
    let remaining = line;
    let pos = 0;

    while (pos < remaining.length) {
      // 注释（行注释）
      if (remaining.slice(pos).startsWith("//")) {
        tokens.push({ type: "comment", text: remaining.slice(pos) });
        break;
      }

      // 字符串
      const stringMatch = remaining.slice(pos).match(/^(["'`])(.*?)(\1)/);
      if (stringMatch) {
        tokens.push({ type: "string", text: stringMatch[0] });
        pos += stringMatch[0].length;
        continue;
      }

      // 数字
      const numberMatch = remaining.slice(pos).match(/^\d+(\.\d+)?/);
      if (numberMatch) {
        tokens.push({ type: "number", text: numberMatch[0] });
        pos += numberMatch[0].length;
        continue;
      }

      // 标识符 / 关键字
      const identMatch = remaining.slice(pos).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
      if (identMatch) {
        const word = identMatch[0];
        const type: TokenType = keywords.has(word) ? "keyword" : "plain";
        tokens.push({ type, text: word });
        pos += word.length;
        continue;
      }

      // 符号/括号
      const punctMatch = remaining.slice(pos).match(/^[{}()\[\];,.::<>?!@#$%^&*+=\-/|\\~`]/);
      if (punctMatch) {
        tokens.push({ type: "punctuation", text: punctMatch[0] });
        pos += punctMatch[0].length;
        continue;
      }

      // 空格
      tokens.push({ type: "plain", text: remaining[pos] });
      pos++;
    }

    return tokens;
  });
}

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword:    "#FF4500",
  string:     "#00FF88",
  comment:    "#666888",
  number:     "#00CCFF",
  function:   "#FFD700",
  punctuation: "#888899",
  plain:      "#E8E8F0",
};

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  language = "typescript",
  fontSize = 28,
  showLineNumbers = true,
  maxHeight = 400,
  plain = false,
  style,
}) => {
  const lines = tokenize(code, language);

  return (
    <div
      style={{
        background: plain ? "transparent" : "rgba(10, 10, 20, 0.88)",
        backdropFilter: plain ? "none" : "blur(8px)",
        border: plain ? "none" : "1px solid rgba(0, 200, 255, 0.4)",
        boxShadow: plain ? "none" : "0 0 20px rgba(0, 200, 255, 0.15), 0 4px 24px rgba(0,0,0,0.6)",
        borderRadius: 12,
        overflow: "hidden",
        fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
        ...style,
      }}
    >
      {/* 语言标签栏 */}
      {!plain && (
        <div
          style={{
            background: "rgba(0, 200, 255, 0.08)",
            borderBottom: "1px solid rgba(0, 200, 255, 0.2)",
            padding: `8px ${fontSize}px`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,69,0,0.7)" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,165,0,0.7)" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(0,200,100,0.7)" }} />
        </div>
        <span
          style={{
            fontSize: 24,
            color: "rgba(0, 200, 255, 0.6)",
            fontFamily: "monospace",
            marginLeft: 8,
            letterSpacing: "0.05em",
          }}
        >
          {language}
        </span>
      </div>
      )}

      {/* 代码区 */}
      <div
        style={{
          maxHeight,
          overflowY: "auto",
          padding: `${fontSize / 2}px 0`,
        }}
      >
        {lines.map((tokens, lineIdx) => (
          <div
            key={lineIdx}
            style={{
              display: "flex",
              lineHeight: 1.6,
              minHeight: fontSize * 1.6,
            }}
          >
            {showLineNumbers && (
              <div
                style={{
                  width: `${String(lines.length).length * fontSize * 0.65 + fontSize}px`,
                  minWidth: `${String(lines.length).length * fontSize * 0.65 + fontSize}px`,
                  paddingRight: fontSize * 0.5,
                  textAlign: "right",
                  color: "#444466",
                  fontSize: fontSize * 0.9,
                  background: "rgba(0,0,0,0.2)",
                  paddingTop: fontSize * 0.1,
                  userSelect: "none",
                  flexShrink: 0,
                }}
              >
                {lineIdx + 1}
              </div>
            )}
            <div
              style={{
                paddingLeft: fontSize * 0.5,
                paddingRight: fontSize,
                fontSize,
                whiteSpace: "pre",
              }}
            >
              {tokens.length === 0 ? (
                <span style={{ color: "#333344" }}> </span>
              ) : (
                tokens.map((token, tokenIdx) => (
                  <span
                    key={tokenIdx}
                    style={{ color: TOKEN_COLORS[token.type] }}
                  >
                    {token.text}
                  </span>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
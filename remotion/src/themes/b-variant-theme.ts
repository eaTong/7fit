/**
 * BVariantTheme — B 类视频双版本主题系统
 *
 * 支持 pro（健身干货库，深色橙红）和 lite（健身跟练营，浅色青绿）两套视觉风格。
 * 所有颜色、BGM、字体通过 theme 统一管控，不影响 A/C/D 等其他类型视频。
 *
 * 使用方式：
 *   const theme = B_VARIANTS['pro']; // or 'lite'
 *   <VoiceoverText text={...} theme={theme} />
 */

export interface BVariantTheme {
  id: 'pro' | 'lite';
  name: string;
  // 色彩
  primary: string;
  secondary: string;
  bg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  textInverse: string;
  subtitleBg: string;
  subtitleText: string;
  highlightBg: string;
  highlightText: string;
  progressTrack: string;
  shadowColor: string;        // 用于 glow shadow，格式如 "rgba(255,69,0,"
  // BGM 前缀（不含 _b14 / _b15 后缀）
  bgmPrefix: string;
  // 字体
  fontFamily: string;
}

/** Pro 版：深色力量感，橙红主调 */
export const B_VARIANT_PRO: BVariantTheme = {
  id: 'pro',
  name: '健身干货库',
  primary: '#FF4500',
  secondary: '#DC143C',
  bg: '#0A0A0A',
  cardBg: 'rgba(10,10,20,0.88)',
  cardBorder: 'rgba(255,255,255,0.1)',
  text: '#FFFFFF',
  textInverse: '#1A1A1A',
  subtitleBg: 'rgba(0,0,0,0.6)',
  subtitleText: '#FFFFFF',
  highlightBg: '#FF4500',
  highlightText: '#FFFFFF',
  progressTrack: 'rgba(255,255,255,0.2)',
  shadowColor: 'rgba(255,69,0,',
  bgmPrefix: 'gym_beat',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
};

/** Lite 版：浅色活力感，青绿主调 */
export const B_VARIANT_LITE: BVariantTheme = {
  id: 'lite',
  name: '健身跟练营',
  primary: '#00D4AA',
  secondary: '#0099FF',
  bg: '#F5F5F5',
  cardBg: 'rgba(255,255,255,0.92)',
  cardBorder: 'rgba(0,0,0,0.08)',
  text: '#1A1A1A',
  textInverse: '#FFFFFF',
  subtitleBg: 'rgba(255,255,255,0.85)',
  subtitleText: '#1A1A1A',
  highlightBg: '#00D4AA',
  highlightText: '#FFFFFF',
  progressTrack: 'rgba(0,0,0,0.15)',
  shadowColor: 'rgba(0,212,170,',
  bgmPrefix: 'lite_vibe',
  fontFamily: '-apple-system, PingFang SC, sans-serif',
};

export const B_VARIANTS: Record<string, BVariantTheme> = {
  pro: B_VARIANT_PRO,
  lite: B_VARIANT_LITE,
};

/** 获取 BGM 完整文件名 */
export function getBgmFileName(theme: BVariantTheme, videoId: string): string {
  return `${theme.bgmPrefix}_${videoId}.mp3`;
}

/**
 * 将 storyboard 中硬编码的橙红/红色替换为当前 theme 色。
 * 不匹配的 color 原样返回，保持兼容性。
 */
export function mapStoryboardColor(
  color: string | undefined,
  theme: BVariantTheme
): string {
  if (!color) return theme.primary;
  const lower = color.toLowerCase();
  if (lower === '#ff4500') return theme.primary;
  if (lower === '#dc143c') return theme.secondary;
  return color;
}

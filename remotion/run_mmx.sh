#!/bin/bash
# ============================================================================
# run_mmx.sh — 一键生成 winged_scapula_b3 缺失的 7 个素材
# ============================================================================
# 用法：
#   1. 确认 mmx CLI 已装（`mmx --version`）
#   2. 跑 `bash run_mmx.sh`（需要 mmx API key）
#   3. 自动 cp 到 resources/ + public/ 对应位置
# ============================================================================

set -e  # 任一命令失败立即退出

RESOURCES="/Users/eatong/7fit/resources"
PUBLIC="/Users/eatong/7fit/remotion/public/winged_scapula_b3"

mkdir -p "$RESOURCES/videos" "$RESOURCES/images" "$RESOURCES/audios/sfx"
mkdir -p "$PUBLIC/videos" "$PUBLIC/images/transition_4actions.png" "$PUBLIC/audios/sfx" 2>/dev/null || true
mkdir -p "$PUBLIC/images" "$PUBLIC/audios/sfx"

# ============================================================================
# 1. 视频 #5 — 钩子对比（mmx 视频，5 秒）
# ============================================================================
echo "==> [1/7] 钩子对比视频"
mmx video generate \
  "Minimalist medical-style fitness educational video, 1080x1920 vertical, 30fps, 5 seconds.
Dark black background (#000000). Center-frame posterior view of an adult male back, dark grey body silhouette (#4A4A4A), thin light grey anatomical outlines.
3 sequential shots (each ~1.6s):
  1) Normal scapula: back facing camera, arms relaxed, shoulder blades flat against back, soft light from front-left 45°
  2) Winged scapula: same angle, but medial border of both scapulae protruding like 'wings', bright vibrant orange (#FF7A28) highlight on medial scapular border with subtle glow
  3) Split comparison: left half 'NORMAL' (flat), right half 'WINGED' (orange protrude), thin orange divider line
Subject: athletic build, tight-fitting dark workout shirt (must expose scapulae).
Style: fitness documentary + medical infographic, shallow depth of field, soft cinematic lighting. NO text overlay (except subtle 'NORMAL'/'WINGED' labels).
Professional fitness app UI aesthetic, clean lines, high contrast." \
  --output "$RESOURCES/videos/winged_scapula_b3_001_hook_compare.mov" \
  --duration 5 \
  --aspect-ratio 9:16 \
  --model video-01

# ============================================================================
# 2. 视频 #6 — 自测 1：镜子（mmx 视频，8 秒）
# ============================================================================
echo "==> [2/7] 自测 1 镜子视频"
mmx video generate \
  "Minimalist medical-style fitness self-test video, 1080x1920 vertical, 30fps, 8 seconds.
Dark black background.
Scene 1 (3-4s): Adult female (athletic, tight workout top exposing back) standing with back to a large floor mirror, shoulders fully relaxed, arms hanging loose. Friend filming from mirror's side-front angle, capturing reflection of the back.
Scene 2 (4-5s): Camera zooms into shoulder blade area, bright vibrant orange (#FF7A28) highlight on the protruding medial border of both scapulae (winged scapula indication). Subtle 'WINGED' label appears.
Soft, even lighting, no mirror glare.
Style: fitness education + friend-assisted self-test, mirror POV, cinematic soft light. NO text overlay.
Minimalist medical aesthetic, clean lines, high contrast." \
  --output "$RESOURCES/videos/winged_scapula_b3_002_mirror_test.mov" \
  --duration 8 \
  --aspect-ratio 9:16 \
  --model video-01

# ============================================================================
# 3. 视频 #7 — 自测 2：推墙（mmx 视频，8 秒）
# ============================================================================
echo "==> [3/7] 自测 2 推墙视频"
mmx video generate \
  "Minimalist medical-style fitness self-test video, 1080x1920 vertical, 30fps, 8 seconds.
Dark black background.
Scene 1 (2-3s): Adult male (athletic, tight workout top exposing back) facing a white wall, both arms raised forward to shoulder height, palms pressed against wall. Side 45° camera angle capturing wall + person full body.
Scene 2 (4-5s): Friend filming from behind-side angle, capturing scapulae protruding as 'wings' when pushing wall. Bright vibrant orange (#FF7A28) highlight on protruding medial scapular border with subtle glow.
Scene 3 (2s): Person lowers arms, scapulae settle back.
Style: fitness education + friend-assisted self-test, side 45° + back-side dual camera angle. NO text overlay.
Minimalist medical aesthetic, clean lines, high contrast." \
  --output "$RESOURCES/videos/winged_scapula_b3_003_wall_push.mov" \
  --duration 8 \
  --aspect-ratio 9:16 \
  --model video-01

# ============================================================================
# 4. 过渡图 #9 — "4 个动作改善"章节卡（mmx 图像，PNG 透明或暗背景）
# ============================================================================
echo "==> [4/7] 4 个动作改善过渡卡"
mmx image generate \
  "Minimalist medical-style fitness section title card, 1080x1920 vertical, dark black background (#000000).
Three-tier vertical layout with bright vibrant orange (#FF7A28) accents:
- TOP TIER (1/3 from top): White text '别担心' (Don't worry) in 120px, geometric sans-serif, ALL CAPS, semibold weight, large letter spacing
- MIDDLE TIER (1/3 from top): Giant orange number '4' (300px), electric red-orange (#FF4500) color with subtle outer glow, very bold weight
- BOTTOM TIER (1/3 from top): White text '个动作改善一下' in 80px, same geometric sans-serif style
- Top-left corner: Small orange chapter icon '第 1 步' or step indicator (#FF4500)
Style: fitness educational + powerful + high contrast, medical infographic aesthetic.
NO 3D rendering, NO gradients, NO shadows, NO text watermarks.
Clean lines, symmetrical composition, professional fitness app UI." \
  --output "$RESOURCES/images/winged_scapula_b3_transition_4actions.png" \
  --aspect-ratio 9:16 \
  --model image-01

# ============================================================================
# 5. sfx T1 — whoosh（钩子→主体，0.5 秒）
# ============================================================================
echo "==> [5/7] T1 whoosh sfx"
mmx audio generate \
  "Transition whoosh sound effect, 0.5 second loopable.
Low-frequency sweep, like air being cut quickly. Frequency range: 200-500 Hz main energy with high-frequency fast decay.
ADSR envelope: attack 0.05s, body 0.3s, decay 0.15s.
Loudness: normalized -3 dBFS.
Style: transition sound effect, cinematic, modern, energetic." \
  --output "$RESOURCES/audios/sfx/winged_scapula_b3_T1_whoosh.mp3" \
  --duration 0.5 \
  --format mp3

# ============================================================================
# 6. sfx T2 — sweep（段间停顿用，0.4 秒）
# ============================================================================
echo "==> [6/7] T2 sweep sfx"
mmx audio generate \
  "Transition sweep sound effect, 0.4 second loopable.
Mid-high frequency short sweep, like air brushing past. Frequency range: 1-3 kHz main energy, 5-8 kHz sweep.
ADSR envelope: attack 0.02s, body 0.25s, decay 0.13s.
Loudness: normalized -3 dBFS.
Style: transition sound effect, crisp, energetic, short." \
  --output "$RESOURCES/audios/sfx/winged_scapula_b3_T2_sweep.mp3" \
  --duration 0.4 \
  --format mp3

# ============================================================================
# 7. sfx T3 — pop（收尾用，0.4 秒）
# ============================================================================
echo "==> [7/7] T3 pop sfx"
mmx audio generate \
  "Transition pop sound effect, 0.4 second loopable.
Soft 'pop' feedback sound, like a confirmation/closing gentle cue. Mid-frequency short burst (800 Hz - 2 kHz).
ADSR envelope: attack 0.01s, body 0.2s, decay 0.2s with subtle reverb tail.
Loudness: normalized -6 dBFS (slightly quieter than T1/T2 to avoid dominating).
Style: transition sound effect, soft, confirmation, closing cue." \
  --output "$RESOURCES/audios/sfx/winged_scapula_b3_T3_pop.mp3" \
  --duration 0.4 \
  --format mp3

# ============================================================================
# 复制到 public/（Scene 直接读这里）
# ============================================================================
echo ""
echo "==> 复制到 public/ (Scene 直接读取)"

cp "$RESOURCES/videos/winged_scapula_b3_001_hook_compare.mov" "$PUBLIC/videos/"
cp "$RESOURCES/videos/winged_scapula_b3_002_mirror_test.mov" "$PUBLIC/videos/"
cp "$RESOURCES/videos/winged_scapula_b3_003_wall_push.mov" "$PUBLIC/videos/"
cp "$RESOURCES/images/winged_scapula_b3_transition_4actions.png" "$PUBLIC/images/transition_4actions.png"
cp "$RESOURCES/audios/sfx/winged_scapula_b3_T1_whoosh.mp3" "$PUBLIC/audios/sfx/T1_whoosh.mp3"
cp "$RESOURCES/audios/sfx/winged_scapula_b3_T2_sweep.mp3" "$PUBLIC/audios/sfx/T2_sweep.mp3"
cp "$RESOURCES/audios/sfx/winged_scapula_b3_T3_pop.mp3" "$PUBLIC/audios/sfx/T3_pop.mp3"

echo ""
echo "✅ 7 个缺失素材全部生成 + 复制完成"
echo ""
echo "下一步："
echo "  1. 跑 bash run_mmx.sh（如果还没跑）"
echo "  2. 跑 npm run dev（Remotion Studio）查看预览"
echo "  3. 跑 checklist.md 自检 → 准备渲染"

import {
  Bot,
  Sparkles,
  Search,
  FileText,
  Video,
  Film,
  Layers,
  Code2,
  Globe,
  Zap,
  PenTool,
  Image,
  Clapperboard,
  LayoutTemplate,
  Mic,
  BookOpen,
  BrainCircuit,
} from 'lucide-react'

const TOOL_ICON_MAP: Record<string, React.ElementType> = {
  // AI 텍스트
  'claude':       BrainCircuit,
  'chatgpt':      Bot,
  'gemini':       Sparkles,
  'gpt4o':        Bot,
  'copilot':      Bot,
  'perplexity':   Search,
  'jasper':       PenTool,

  // 문서/노션
  'notion':       FileText,
  'notion ai':    FileText,

  // 영상
  'heygen':       Video,
  'vrew':         Film,
  'runway':       Clapperboard,
  'runwayml':     Clapperboard,

  // 디자인
  'figma':        Layers,
  'midjourney':   Image,
  'stitch':       LayoutTemplate,
  'google stitch':LayoutTemplate,

  // 개발
  'cursor':       Code2,
  'replit':       Code2,
  'vercel':       Globe,
  'codex':        Code2,

  // 자동화
  'zapier':       Zap,
  'zapier ai':    Zap,
  'make':         Zap,

  // 기타
  'elevenlabs':   Mic,
  'bookstack':    BookOpen,
}

interface ToolIconProps {
  name: string
  size?: number
  className?: string
}

export function ToolIcon({ name, size = 14, className = '' }: ToolIconProps) {
  const key = name.toLowerCase()
  const Icon = TOOL_ICON_MAP[key] ?? Bot
  return <Icon size={size} className={className} strokeWidth={1.8} />
}

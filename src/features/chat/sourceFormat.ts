import type { Source } from '@/api/chatApi';

export type SourceRef = { key: string; label: string; title: string };

// 칩과 참고 자료 시트에 쓰는 "법령 이름 + 조문 번호"(판례는 "판례 사건번호"). 둘이 모두 같은 항목은 하나만 남기고, 서버의 source 필드는 쓰지 않는다.
export function toSourceRefs(sources: Source[]): SourceRef[] {
  const seen = new Set<string>();
  const refs: SourceRef[] = [];
  for (const source of sources) {
    const label = [source.law, source.article]
      .map((part) => (part ?? '').trim())
      .filter(Boolean)
      .join(' ');
    if (!label || seen.has(label)) continue;
    seen.add(label);
    refs.push({ key: label, label, title: (source.title ?? '').trim() });
  }
  return refs;
}

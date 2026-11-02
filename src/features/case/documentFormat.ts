import type { CaseDocumentResponse, DocumentStatus } from '@/api/documentApi';
import { colors } from '@/shared/constants/colors';

export type DocTone = 'blue' | 'orange' | 'red' | 'green';

// 시안의 DOC_TONE / DOC_COLOR 값(colors.chip의 blue/orange/red/green과 같은 값)
export const DOC_TONE_COLORS: Record<DocTone, { bg: string; fg: string }> = {
  blue: { bg: colors.chip.blueBg, fg: colors.chip.blueFg },
  orange: { bg: colors.chip.orangeBg, fg: colors.chip.orangeFg },
  red: { bg: colors.chip.redBg, fg: colors.chip.redFg },
  green: { bg: colors.chip.greenBg, fg: colors.chip.greenFg },
};

export const DOC_STATUS_INFO: Record<DocumentStatus, { label: string; tone: DocTone }> = {
  UPLOADED: { label: '업로드됨', tone: 'blue' },
  PROCESSING: { label: '검토 중', tone: 'orange' },
  REVIEW_REQUIRED: { label: '보완 필요', tone: 'red' },
  REJECTED: { label: '반려', tone: 'red' },
  APPROVED: { label: '승인', tone: 'green' },
};

// 서버가 5종 밖의 값을 주면 UPLOADED로 본다.
export function normalizeDocStatus(status: string): DocumentStatus {
  return status in DOC_STATUS_INFO ? (status as DocumentStatus) : 'UPLOADED';
}

export const DOC_NOTES: Partial<Record<DocumentStatus, string>> = {
  REVIEW_REQUIRED: '보완이 필요해요. 다시 올리려면 새 서류를 추가해 주세요.',
  REJECTED: '반려된 서류예요. 새 서류를 추가해 주세요.',
};

export const canRequestReview = (status: DocumentStatus) => status === 'UPLOADED' || status === 'REVIEW_REQUIRED';
export const canDelete = (status: DocumentStatus) => status === 'UPLOADED' || status === 'REJECTED';

const MB = 1024 * 1024;

// 1MB 미만은 KB(정수), 이상은 MB(소수 첫째 자리)
export function formatFileSize(bytes: number): string {
  if (bytes < MB) return `${Math.min(1023, Math.round(bytes / 1024))}KB`;
  return `${(bytes / MB).toFixed(1)}MB`;
}

export const MAX_UPLOAD_BYTES = 20 * MB;
export const ALLOWED_UPLOAD_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const EXTENSIONS: Record<string, string> = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' };

// 경로·특수 문자를 지운 안전한 파일 이름
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '')
    .trim()
    .slice(0, 100);
}

// 내려받은 파일의 이름: originalFileName(정리한 것), 없으면 서류 종류 이름 + contentType의 확장자
export function downloadFileName(doc: CaseDocumentResponse): string {
  const original = sanitizeFileName(doc.originalFileName ?? '');
  if (original) return original;
  const base = sanitizeFileName(doc.documentTypeName) || '서류';
  const ext = EXTENSIONS[doc.contentType.toLowerCase()];
  return ext ? `${base}.${ext}` : base;
}

// 선택한 파일의 확장자가 MIME과 어긋나지 않게 맞춘다(예: iOS에서 HEIC가 JPEG로 변환된 경우).
export function ensureExtension(name: string, mime: string): string {
  const ext = EXTENSIONS[mime.toLowerCase()];
  if (!ext) return name;
  const lower = name.toLowerCase();
  const ok = ext === 'jpg' ? lower.endsWith('.jpg') || lower.endsWith('.jpeg') : lower.endsWith(`.${ext}`);
  if (ok) return name;
  const dot = name.lastIndexOf('.');
  return `${dot > 0 ? name.slice(0, dot) : name}.${ext}`;
}

// 확장자로 MIME을 추정한다(선택 결과에 MIME이 비어 있을 때 전송용).
export function guessMimeFromName(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  return null;
}

export function sortDocuments(list: CaseDocumentResponse[]): CaseDocumentResponse[] {
  return [...list].sort((a, b) => (a.uploadedAt === b.uploadedAt ? b.id - a.id : a.uploadedAt < b.uploadedAt ? 1 : -1));
}

export const DOC_MESSAGES = {
  uploaded: '서류를 올렸어요',
  tooLarge: '20MB 이하 파일만 올릴 수 있어요',
  badFormat: 'PDF, JPG, PNG 파일만 올릴 수 있어요',
  uploadFailed: '올리지 못했어요. 잠시 후 다시 시도해 주세요.',
  loadFailed: '불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
  changeFailed: '변경하지 못했어요. 잠시 후 다시 시도해 주세요.',
  downloadFailed: '내려받지 못했어요. 잠시 후 다시 시도해 주세요.',
} as const;

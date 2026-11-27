import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

interface PostsManifest {
  posts: string[];
}

const MAX_POSTS_COUNT = 15;
const MAX_MANIFEST_BYTES = 16384;
const X_STATUS_URL =
  /^https:\/\/(?:(?:www|mobile)\.)?(?:x|twitter)\.com\/(?:[A-Za-z0-9_]+\/status|i\/web\/status)\/\d+(?:[/?#].*)?$/;

function readAndValidatePosts(filePath: string): string {
  const raw = readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  if (Buffer.byteLength(raw, 'utf8') > MAX_MANIFEST_BYTES) {
    throw new Error(`POSTS.json exceeds maximum ${MAX_MANIFEST_BYTES} bytes`);
  }

  const parsed = JSON.parse(raw) as Partial<PostsManifest>;

  if (!Array.isArray(parsed.posts) || parsed.posts.length === 0 || parsed.posts.length > MAX_POSTS_COUNT) {
    throw new Error(`POSTS.json must hold 1 to ${MAX_POSTS_COUNT} post URLs`);
  }

  const seen = new Set<string>();
  const cleaned = parsed.posts.map((entry, idx) => {
    if (typeof entry !== 'string' || !X_STATUS_URL.test(entry.trim())) {
      throw new Error(`Invalid X post URL at index ${idx}`);
    }
    const normalized = entry.trim();
    if (seen.has(normalized)) {
      throw new Error(`Duplicate X post URL at index ${idx}: ${normalized}`);
    }
    seen.add(normalized);
    return normalized;
  });

  return `${JSON.stringify({ posts: cleaned }, null, 2)}\n`;
}

function run(): void {
  const botDir = resolve(process.env.MAKEFUN_BOT_DIR ?? '/bot');
  const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

  const sourcePath = join(botDir, 'POSTS.json');
  const targetPath = join(outputDir, 'POSTS.json');

  const payload = readAndValidatePosts(sourcePath);
  mkdirSync(outputDir, { recursive: true, mode: 0o755 });
  writeFileSync(targetPath, payload, { encoding: 'utf8', mode: 0o644 });
  try {
    chmodSync(targetPath, 0o644);
  } catch {
    // POSIX permissions apply inside the Linux grader container.
  }
}

try {
  run();
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`makefun-x-reposts-02 entry error: ${msg}\n`);
  process.exit(1);
}

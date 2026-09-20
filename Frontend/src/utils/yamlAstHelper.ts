import YAML from 'yaml';

export interface FieldCommentInfo {
  commentBefore?: string;
  inlineComment?: string;
}

export type CommentMap = Record<string, FieldCommentInfo>;

export interface ParsedYamlResult {
  doc: YAML.Document;
  data: Record<string, any>;
  comments: CommentMap;
}

/**
 * 将 YAML 文本解析为包含完整 AST 元数据、注释映射和 JS 数据的对象
 */
export function parseYamlWithComments(source: string): ParsedYamlResult {
  const doc = YAML.parseDocument(source, {
    keepSourceTokens: true,
    logLevel: 'error',
  });

  if (doc.errors && doc.errors.length > 0) {
    throw new Error(doc.errors.map((e) => e.message).join('; '));
  }

  const comments: CommentMap = {};
  if (doc.contents) {
    extractComments(doc.contents, [], comments);
  }

  const data = doc.toJS() || {};
  return { doc, data, comments };
}

function extractComments(node: any, path: string[], result: CommentMap) {
  if (!node) return;

  if (YAML.isMap(node)) {
    for (let i = 0; i < node.items.length; i++) {
      const item = node.items[i];
      if (!item || !item.key) continue;
      const keyStr = String(item.key.value ?? item.key);
      const currentPath = [...path, keyStr];
      const pathKey = currentPath.join('.');

      let commentBefore = item.key?.commentBefore || item.commentBefore;
      if (i === 0 && !commentBefore && node.commentBefore) {
        commentBefore = node.commentBefore;
      }
      const inlineComment = item.value?.comment || item.comment;

      if (commentBefore || inlineComment) {
        result[pathKey] = {
          commentBefore: commentBefore ? cleanComment(commentBefore) : undefined,
          inlineComment: inlineComment ? cleanComment(inlineComment) : undefined,
        };
      }

      if (YAML.isMap(item.value) || YAML.isSeq(item.value)) {
        extractComments(item.value, currentPath, result);
      }
    }
  } else if (YAML.isSeq(node)) {
    for (let i = 0; i < node.items.length; i++) {
      const item = node.items[i];
      const currentPath = [...path, String(i)];
      const pathKey = currentPath.join('.');
      const commentBefore = item?.commentBefore;
      const inlineComment = item?.comment;
      if (commentBefore || inlineComment) {
        result[pathKey] = {
          commentBefore: commentBefore ? cleanComment(commentBefore) : undefined,
          inlineComment: inlineComment ? cleanComment(inlineComment) : undefined,
        };
      }
      if (YAML.isMap(item) || YAML.isSeq(item)) {
        extractComments(item, currentPath, result);
      }
    }
  }
}

function cleanComment(raw: string): string {
  return raw
    .split('\n')
    .map((line) => line.replace(/^\s*#?\s?/, '').trimEnd())
    .join('\n')
    .trim();
}

/**
 * 原地更新 AST 节点，保持现有注释和格式不变，并重新生成 YAML 字符串
 */
export function updateYamlValue(
  doc: YAML.Document,
  path: (string | number)[],
  newValue: any
): string {
  doc.setIn(path, newValue);
  return doc.toString({ lineWidth: 0 });
}

/**
 * 原地删除 AST 节点，并重新生成 YAML 字符串
 */
export function deleteYamlValue(
  doc: YAML.Document,
  path: (string | number)[]
): string {
  doc.deleteIn(path);
  return doc.toString({ lineWidth: 0 });
}

/**
 * 在指定父级下新增 Pair，支持附带前置注释
 */
export function addYamlPair(
  doc: YAML.Document,
  parentPath: (string | number)[],
  key: string,
  value: any,
  comment?: string
): string {
  const pair = doc.createPair(key, value);
  if (comment && comment.trim()) {
    pair.key.commentBefore = ' ' + comment.trim().split('\n').join('\n ');
  }
  if (parentPath.length === 0) {
    if (!doc.contents) {
      doc.contents = new YAML.YAMLMap();
    }
    (doc.contents as any).items.push(pair);
  } else {
    doc.addIn(parentPath, pair);
  }
  return doc.toString({ lineWidth: 0 });
}

/**
 * 工具函数：在嵌套 JS 对象中根据路径设置值
 */
export function setInObject(obj: any, path: (string | number)[], value: any) {
  if (!obj || path.length === 0) return;
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const p = path[i];
    if (cur[p] === undefined || cur[p] === null) {
      cur[p] = typeof path[i + 1] === 'number' ? [] : {};
    }
    cur = cur[p];
  }
  cur[path[path.length - 1]] = value;
}

/**
 * 工具函数：在嵌套 JS 对象中根据路径删除键
 */
export function deleteInObject(obj: any, path: (string | number)[]) {
  if (!obj || path.length === 0) return;
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    cur = cur[path[i]];
    if (!cur) return;
  }
  const lastKey = path[path.length - 1];
  if (Array.isArray(cur) && typeof lastKey === 'number') {
    cur.splice(lastKey, 1);
  } else if (cur && typeof cur === 'object') {
    delete cur[lastKey];
  }
}

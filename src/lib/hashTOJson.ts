export function jsonToHash(obj:any) {
  // 1. 将对象转换为 JSON 字符串
  const jsonString = JSON.stringify(obj);
  
  // 2. 编码为 Base64URL 避免特殊字符问题
  const base64Url = btoa(encodeURIComponent(jsonString))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  // 3. 更新 URL hash
  //window.location.hash = base64Url;
  return base64Url;
}

// 从 URL hash 解析 JSON
export function hashToJson() {
  const hash = window.location.hash.substring(1); // 去掉 #
  if (!hash) return null;
  
  try {
    // 1. Base64URL 转标准 Base64
    let base64 = hash
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // 2. 添加填充字符
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }
    
    // 3. 解码
    const jsonString = decodeURIComponent(atob(base64));
    
    // 4. 解析为对象
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('解析 hash 失败:', error);
    return null;
  }
}
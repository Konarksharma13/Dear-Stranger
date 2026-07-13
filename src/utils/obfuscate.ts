const SECRET_KEY = "dearstrangerkeyforstrangers";

/**
 * Obfuscates page contents using a light XOR cipher, then encodes to Base64URL.
 * This ensures the URL contains the text directly but isn't instantly readable.
 */
export function encryptPage(text: string, fontStyle: number, postscript?: string): string {
  const payload = JSON.stringify({ 
    t: text, 
    f: fontStyle, 
    p: postscript || "" 
  });
  
  // Convert payload to UTF-8 byte array
  const encoder = new TextEncoder();
  const bytes = encoder.encode(payload);
  
  // Apply XOR cipher
  const xorBytes = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    xorBytes[i] = bytes[i] ^ keyChar;
  }
  
  // Convert XOR byte array to binary string
  let binary = "";
  for (let i = 0; i < xorBytes.length; i++) {
    binary += String.fromCharCode(xorBytes[i]);
  }
  
  // Encode to Base64
  const base64 = btoa(binary);
  
  // Convert to Base64URL (URL safe, removes padding '=')
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Decrypts a Base64URL string back to original page content.
 * Returns null if decryption or parsing fails.
 */
export function decryptPage(encrypted: string): { text: string; fontStyle: number; postscript?: string } | null {
  if (!encrypted) return null;
  
  try {
    // Restore standard Base64 characters and padding
    let base64 = encrypted.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Decode Base64 string to binary representation
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // Revert XOR cipher
    const decryptedBytes = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      decryptedBytes[i] = bytes[i] ^ keyChar;
    }
    
    // Convert bytes back to JSON string
    const decoder = new TextDecoder();
    const payloadStr = decoder.decode(decryptedBytes);
    
    const parsed = JSON.parse(payloadStr);
    
    return {
      text: parsed.t,
      fontStyle: Number(parsed.f),
      postscript: parsed.p || undefined
    };
  } catch (e) {
    console.error("Failed to decrypt sharing URL parameters", e);
    return null;
  }
}

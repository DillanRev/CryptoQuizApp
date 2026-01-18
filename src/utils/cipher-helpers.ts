// Helper functions to verify cipher calculations

export function caesarEncrypt(text: string, shift: number): string {
  return text.split('').map(char => {
    if (char >= 'A' && char <= 'Z') {
      return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
    }
    return char;
  }).join('');
}

export function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, 26 - shift);
}

export function vigenereEncrypt(text: string, keyword: string): string {
  let result = '';
  let keyIndex = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char >= 'A' && char <= 'Z') {
      const charCode = char.charCodeAt(0) - 65;
      const keyChar = keyword[keyIndex % keyword.length];
      const keyCode = keyChar.charCodeAt(0) - 65;
      result += String.fromCharCode(((charCode + keyCode) % 26) + 65);
      keyIndex++;
    } else {
      result += char;
    }
  }
  
  return result;
}

export function vigenereDecrypt(text: string, keyword: string): string {
  let result = '';
  let keyIndex = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char >= 'A' && char <= 'Z') {
      const charCode = char.charCodeAt(0) - 65;
      const keyChar = keyword[keyIndex % keyword.length];
      const keyCode = keyChar.charCodeAt(0) - 65;
      result += String.fromCharCode(((charCode - keyCode + 26) % 26) + 65);
      keyIndex++;
    } else {
      result += char;
    }
  }
  
  return result;
}

// Test calculations
console.log('Caesar Tests:');
console.log('HELLO + 3 =', caesarEncrypt('HELLO', 3)); // Should be KHOOR
console.log('CRYPTO + 7 =', caesarEncrypt('CRYPTO', 7)); // Should be JYFWAV
console.log('ZEBRA + 4 =', caesarEncrypt('ZEBRA', 4)); // Should be DIFVE

console.log('\nVigenere Tests:');
console.log('HELLO + KEY =', vigenereEncrypt('HELLO', 'KEY')); // Should be RIJVS
console.log('CAT + DOG =', vigenereEncrypt('CAT', 'DOG')); // Should be FOS
console.log('ATTACK + LEMON =', vigenereEncrypt('ATTACK', 'LEMON')); // Should be LXFOPV
console.log('CODE + BEST =', vigenereEncrypt('CODE', 'BEST')); // Let's see what this actually is

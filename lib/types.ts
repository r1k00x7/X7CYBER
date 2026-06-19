export type AttackType =
  | 'Web Attackers'
  | 'DDoS Attackers'
  | 'Intruders'
  | 'Scanners'
  | 'Anonymizers'
  | 'Malware Distribution'
  | 'Phishing'
  | 'Brute Force'
  | 'SQL Injection'
  | 'Botnet'
  | 'Ransomware'
  | 'Zero-Day Exploit'
  | 'Man-in-the-Middle'
  | 'Credential Stuffing'
  | 'API Abuse'
  | 'Data Exfiltration'
  | 'Trojan'
  | 'Worm'
  | 'Rootkit'
  | 'Crypto Mining'
  | 'DNS Hijacking'
  | 'Packet Sniffing'
  | 'Session Hijacking'
  | 'Email Spoofing'
  | 'APT Attack'
  | 'Buffer Overflow'
  | 'Cross-Site Scripting'
  | 'CSRF Attack'
  | 'XML Injection'
  | 'LDAP Injection'
  | 'Command Injection'
  | 'Path Traversal'
  | 'Remote Code Execution'
  | 'File Inclusion'
  | 'Logic Bomb'
  | 'Backdoor'
  | 'Spyware'
  | 'Adware'
  | 'Keylogger'
  | 'Exploit Kit'
  | 'Supply Chain Attack'
  | 'Insider Threat'
  | 'Watering Hole'
  | 'Drive-by Download'
  | 'Cookie Theft'
  | 'Typosquatting'
  | 'Domain Hijacking'
  | 'BGP Hijacking'
  | 'Sybil Attack';

export interface AttackEvent {
  id: string;
  time: string;
  sourceCountry: string;
  sourceCode: string;
  sourceLat: number;
  sourceLng: number;
  targetCountry: string;
  targetCode: string;
  targetLat: number;
  targetLng: number;
  attackType: AttackType;
  threatLevel: 1 | 2 | 3 | 4 | 5; // 1: Low, 2: Medium, 3: High, 4: Critical, 5: Catastrophic
}

export type Interval = '1h' | '6h' | '24h';

export const ATTACK_TYPES: AttackType[] = [
  'Web Attackers',
  'DDoS Attackers',
  'Intruders',
  'Scanners',
  'Anonymizers',
  'Malware Distribution',
  'Phishing',
  'Brute Force',
  'SQL Injection',
  'Botnet',
  'Ransomware',
  'Zero-Day Exploit',
  'Man-in-the-Middle',
  'Credential Stuffing',
  'API Abuse',
  'Data Exfiltration',
  'Trojan',
  'Worm',
  'Rootkit',
  'Crypto Mining',
  'DNS Hijacking',
  'Packet Sniffing',
  'Session Hijacking',
  'Email Spoofing',
  'APT Attack',
  'Buffer Overflow',
  'Cross-Site Scripting',
  'CSRF Attack',
  'XML Injection',
  'LDAP Injection',
  'Command Injection',
  'Path Traversal',
  'Remote Code Execution',
  'File Inclusion',
  'Logic Bomb',
  'Backdoor',
  'Spyware',
  'Adware',
  'Keylogger',
  'Exploit Kit',
  'Supply Chain Attack',
  'Insider Threat',
  'Watering Hole',
  'Drive-by Download',
  'Cookie Theft',
  'Typosquatting',
  'Domain Hijacking',
  'BGP Hijacking',
  'Sybil Attack',
];

/**
 * Get color based on attack type and threat level
 * Warna akan berubah sesuai jenis dan tingkat serangan
 */
export const ATTACK_COLORS: Record<AttackType, Record<1 | 2 | 3 | 4 | 5, string>> = {
  // Original types
  'Web Attackers': {
    1: '#FFD700', // Low: Gold
    2: '#FFA500', // Medium: Orange
    3: '#FF8C00', // High: Dark Orange
    4: '#FF6347', // Critical: Tomato
    5: '#FF0000', // Catastrophic: Pure Red
  },
  'DDoS Attackers': {
    1: '#FF69B4', // Low: Hot Pink
    2: '#FF1493', // Medium: Deep Pink
    3: '#FF3B4E', // High: Crimson Red
    4: '#DC143C', // Critical: Crimson
    5: '#8B0000', // Catastrophic: Dark Red
  },
  Intruders: {
    1: '#9370DB', // Low: Medium Purple
    2: '#8A2BE2', // Medium: Blue Violet
    3: '#7B68EE', // High: Medium Slate Blue
    4: '#6A5ACD', // Critical: Slate Blue
    5: '#4B0082', // Catastrophic: Indigo
  },
  Scanners: {
    1: '#87CEEB', // Low: Sky Blue
    2: '#6495ED', // Medium: Cornflower Blue
    3: '#3AA0FF', // High: Standard Blue
    4: '#1E90FF', // Critical: Dodger Blue
    5: '#00008B', // Catastrophic: Dark Blue
  },
  Anonymizers: {
    1: '#90EE90', // Low: Light Green
    2: '#39D98A', // Medium: Emerald
    3: '#00CC66', // High: Bright Green
    4: '#008000', // Critical: Green
    5: '#004D00', // Catastrophic: Dark Green
  },
  'Malware Distribution': {
    1: '#FFB6C1', // Low: Light Pink
    2: '#FF69B4', // Medium: Hot Pink
    3: '#FF1493', // High: Deep Pink
    4: '#C71585', // Critical: Medium Violet Red
    5: '#8B1A1A', // Catastrophic: Dark Red
  },
  Phishing: {
    1: '#FFE4B5', // Low: Moccasin
    2: '#FFDAB9', // Medium: Peach Puff
    3: '#FFA07A', // High: Light Salmon
    4: '#FF7F50', // Critical: Coral
    5: '#FF4500', // Catastrophic: Orange Red
  },
  'Brute Force': {
    1: '#E6E6FA', // Low: Lavender
    2: '#DDA0DD', // Medium: Plum
    3: '#DA70D6', // High: Orchid
    4: '#BA55D3', // Critical: Medium Orchid
    5: '#800080', // Catastrophic: Purple
  },
  'SQL Injection': {
    1: '#F0E68C', // Low: Khaki
    2: '#EEE8AA', // Medium: Pale Goldenrod
    3: '#FFD700', // High: Gold
    4: '#FFA500', // Critical: Orange
    5: '#FF4500', // Catastrophic: Orange Red
  },
  Botnet: {
    1: '#00CED1', // Low: Dark Turquoise
    2: '#20B2AA', // Medium: Light Sea Green
    3: '#008B8B', // High: Dark Cyan
    4: '#006666', // Critical: Deep Teal
    5: '#003333', // Catastrophic: Very Dark Teal
  },
  Ransomware: {
    1: '#FF6B6B', // Low: Light Red
    2: '#FF5252', // Medium: Bright Red
    3: '#FF3B3B', // High: Red
    4: '#E63946', // Critical: Deep Red
    5: '#8B0000', // Catastrophic: Dark Red
  },
  'Zero-Day Exploit': {
    1: '#FFDEAD', // Low: Navajo White
    2: '#FFCC99', // Medium: Peach
    3: '#FF9933', // High: Orange
    4: '#FF6600', // Critical: Dark Orange
    5: '#CC3300', // Catastrophic: Dark Red Orange
  },
  'Man-in-the-Middle': {
    1: '#B0E0E6', // Low: Powder Blue
    2: '#87CEEB', // Medium: Sky Blue
    3: '#4169E1', // High: Royal Blue
    4: '#0047AB', // Critical: Cobalt Blue
    5: '#000080', // Catastrophic: Navy
  },
  'Credential Stuffing': {
    1: '#FFFFE0', // Low: Light Yellow
    2: '#FFFACD', // Medium: Lemon Chiffon
    3: '#FFFF00', // High: Yellow
    4: '#FFA500', // Critical: Orange
    5: '#FF4500', // Catastrophic: Orange Red
  },
  // New attack types (10+)
  'API Abuse': {
    1: '#B0C4DE', // Low: Light Steel Blue
    2: '#5F9EA0', // Medium: Cadet Blue
    3: '#20B2AA', // High: Light Sea Green
    4: '#008080', // Critical: Teal
    5: '#004D4D', // Catastrophic: Dark Teal
  },
  'Data Exfiltration': {
    1: '#FF8C94', // Low: Light Red
    2: '#FF6B6B', // Medium: Red
    3: '#FF5252', // High: Bright Red
    4: '#FF1744', // Critical: Deep Red
    5: '#D32F2F', // Catastrophic: Very Deep Red
  },
  Trojan: {
    1: '#A569BD', // Low: Lavender Grape
    2: '#9C27B0', // Medium: Purple
    3: '#8E24AA', // High: Deep Purple
    4: '#7B1FA2', // Critical: Deeper Purple
    5: '#4A148C', // Catastrophic: Very Deep Purple
  },
  Worm: {
    1: '#81C784', // Low: Light Green
    2: '#66BB6A', // Medium: Green
    3: '#4CAF50', // High: Medium Green
    4: '#388E3C', // Critical: Dark Green
    5: '#1B5E20', // Catastrophic: Very Dark Green
  },
  Rootkit: {
    1: '#E57373', // Low: Light Coral
    2: '#EF5350', // Medium: Coral Red
    3: '#F44336', // High: Red
    4: '#E53935', // Critical: Deep Red
    5: '#B71C1C', // Catastrophic: Very Deep Red
  },
  'Crypto Mining': {
    1: '#FFB74D', // Low: Light Orange
    2: '#FFA726', // Medium: Orange
    3: '#FF9800', // High: Deep Orange
    4: '#F57C00', // Critical: Darker Orange
    5: '#E65100', // Catastrophic: Very Dark Orange
  },
  'DNS Hijacking': {
    1: '#64B5F6', // Low: Light Blue
    2: '#42A5F5', // Medium: Blue
    3: '#2196F3', // High: Medium Blue
    4: '#1976D2', // Critical: Deep Blue
    5: '#1565C0', // Catastrophic: Very Deep Blue
  },
  'Packet Sniffing': {
    1: '#BA68C8', // Low: Light Magenta
    2: '#AB47BC', // Medium: Magenta
    3: '#9C27B0', // High: Purple
    4: '#8E24AA', // Critical: Deep Purple
    5: '#6A1B9A', // Catastrophic: Very Deep Purple
  },
  'Session Hijacking': {
    1: '#29B6F6', // Low: Light Cyan
    2: '#03A9F4', // Medium: Cyan
    3: '#039BE5', // High: Deep Cyan
    4: '#0288D1', // Critical: Darker Cyan
    5: '#01579B', // Catastrophic: Very Dark Cyan
  },
  'Email Spoofing': {
    1: '#F06292', // Low: Light Pink Red
    2: '#EC407A', // Medium: Pink Red
    3: '#E91E63', // High: Pink
    4: '#C2185B', // Critical: Deep Pink
    5: '#880E4F', // Catastrophic: Very Deep Pink
  },
  'APT Attack': {
    1: '#CFD8DC', // Low: Blue Grey
    2: '#90A4AE', // Medium: Grey
    3: '#78909C', // High: Dark Grey
    4: '#455A64', // Critical: Darker Grey
    5: '#37474F', // Catastrophic: Very Dark Grey
  },
  // Additional attack types (36+)
  'Buffer Overflow': {
    1: '#F8BBD0', // Low: Light Pink
    2: '#F48FB1', // Medium: Pink
    3: '#F06292', // High: Deep Pink
    4: '#EC407A', // Critical: Darker Pink
    5: '#C2185B', // Catastrophic: Very Deep Pink
  },
  'Cross-Site Scripting': {
    1: '#BBDEFB', // Low: Light Blue
    2: '#90CAF9', // Medium: Blue
    3: '#64B5F6', // High: Deep Blue
    4: '#42A5F5', // Critical: Darker Blue
    5: '#1976D2', // Catastrophic: Very Deep Blue
  },
  'CSRF Attack': {
    1: '#C5E1A5', // Low: Light Lime
    2: '#AED581', // Medium: Lime
    3: '#9CCC65', // High: Deep Lime
    4: '#7CB342', // Critical: Darker Lime
    5: '#558B2F', // Catastrophic: Very Deep Lime
  },
  'XML Injection': {
    1: '#FFCCBC', // Low: Light Deep Orange
    2: '#FFAB91', // Medium: Deep Orange
    3: '#FF8A65', // High: Orange
    4: '#FF7043', // Critical: Darker Orange
    5: '#D84315', // Catastrophic: Very Deep Orange
  },
  'LDAP Injection': {
    1: '#B2DFDB', // Low: Light Teal
    2: '#80CBC4', // Medium: Teal
    3: '#4DB6AC', // High: Deep Teal
    4: '#26A69A', // Critical: Darker Teal
    5: '#00796B', // Catastrophic: Very Deep Teal
  },
  'Command Injection': {
    1: '#D1C4E9', // Low: Light Indigo
    2: '#B39DDB', // Medium: Indigo
    3: '#9575CD', // High: Deep Indigo
    4: '#7986CB', // Critical: Darker Indigo
    5: '#3F51B5', // Catastrophic: Very Deep Indigo
  },
  'Path Traversal': {
    1: '#FCE4EC', // Low: Light Pink
    2: '#F8BBD0', // Medium: Pink
    3: '#F48FB1', // High: Deep Pink
    4: '#F06292', // Critical: Darker Pink
    5: '#C2185B', // Catastrophic: Very Deep Pink
  },
  'Remote Code Execution': {
    1: '#FFE0B2', // Low: Light Orange
    2: '#FFCC80', // Medium: Orange
    3: '#FFB74D', // High: Deep Orange
    4: '#FFA726', // Critical: Darker Orange
    5: '#F57C00', // Catastrophic: Very Deep Orange
  },
  'File Inclusion': {
    1: '#F0F4C3', // Low: Light Yellow
    2: '#E6EE9C', // Medium: Yellow
    3: '#DCE775', // High: Deep Yellow
    4: '#D4E157', // Critical: Darker Yellow
    5: '#AFB42B', // Catastrophic: Very Deep Yellow
  },
  'Logic Bomb': {
    1: '#F3E5F5', // Low: Light Purple
    2: '#E1BEE7', // Medium: Purple
    3: '#CE93D8', // High: Deep Purple
    4: '#BA68C8', // Critical: Darker Purple
    5: '#8E24AA', // Catastrophic: Very Deep Purple
  },
  Backdoor: {
    1: '#EFEBE9', // Low: Light Brown
    2: '#D7CCC8', // Medium: Brown
    3: '#BCAAA4', // High: Deep Brown
    4: '#A1887F', // Critical: Darker Brown
    5: '#795548', // Catastrophic: Very Deep Brown
  },
  Spyware: {
    1: '#E0F2F1', // Low: Light Cyan
    2: '#B2DFDB', // Medium: Cyan
    3: '#80CBC4', // High: Deep Cyan
    4: '#4DB6AC', // Critical: Darker Cyan
    5: '#00897B', // Catastrophic: Very Deep Cyan
  },
  Adware: {
    1: '#FFF9C4', // Low: Light Yellow
    2: '#FFF59D', // Medium: Yellow
    3: '#FFF176', // High: Deep Yellow
    4: '#FFEE58', // Critical: Darker Yellow
    5: '#FBC02D', // Catastrophic: Very Deep Yellow
  },
  Keylogger: {
    1: '#E8F5E9', // Low: Light Green
    2: '#C8E6C9', // Medium: Green
    3: '#A5D6A7', // High: Deep Green
    4: '#81C784', // Critical: Darker Green
    5: '#2E7D32', // Catastrophic: Very Deep Green
  },
  'Exploit Kit': {
    1: '#FCE4EC', // Low: Light Pink
    2: '#F8BBD0', // Medium: Pink
    3: '#F48FB1', // High: Deep Pink
    4: '#F06292', // Critical: Darker Pink
    5: '#AD1457', // Catastrophic: Very Deep Pink
  },
  'Supply Chain Attack': {
    1: '#E3F2FD', // Low: Light Blue
    2: '#BBDEFB', // Medium: Blue
    3: '#90CAF9', // High: Deep Blue
    4: '#64B5F6', // Critical: Darker Blue
    5: '#0D47A1', // Catastrophic: Very Deep Blue
  },
  'Insider Threat': {
    1: '#F1F8E9', // Low: Light Lime
    2: '#DCEDC1', // Medium: Lime
    3: '#C5E1A5', // High: Deep Lime
    4: '#AED581', // Critical: Darker Lime
    5: '#558B2F', // Catastrophic: Very Deep Lime
  },
  'Watering Hole': {
    1: '#F3E5F5', // Low: Light Purple
    2: '#E1BEE7', // Medium: Purple
    3: '#CE93D8', // High: Deep Purple
    4: '#BA68C8', // Critical: Darker Purple
    5: '#6A1B9A', // Catastrophic: Very Deep Purple
  },
  'Drive-by Download': {
    1: '#FFF3E0', // Low: Light Orange
    2: '#FFE0B2', // Medium: Orange
    3: '#FFCC80', // High: Deep Orange
    4: '#FFB74D', // Critical: Darker Orange
    5: '#E65100', // Catastrophic: Very Deep Orange
  },
  'Cookie Theft': {
    1: '#FCE4EC', // Low: Light Pink
    2: '#F8BBD0', // Medium: Pink
    3: '#F48FB1', // High: Deep Pink
    4: '#F06292', // Critical: Darker Pink
    5: '#880E4F', // Catastrophic: Very Deep Pink
  },
  Typosquatting: {
    1: '#E0F2F1', // Low: Light Teal
    2: '#B2DFDB', // Medium: Teal
    3: '#80CBC4', // High: Deep Teal
    4: '#4DB6AC', // Critical: Darker Teal
    5: '#004D40', // Catastrophic: Very Deep Teal
  },
  'Domain Hijacking': {
    1: '#F3E5F5', // Low: Light Purple
    2: '#E1BEE7', // Medium: Purple
    3: '#CE93D8', // High: Deep Purple
    4: '#BA68C8', // Critical: Darker Purple
    5: '#512DA8', // Catastrophic: Very Deep Purple
  },
  'BGP Hijacking': {
    1: '#E8F5E9', // Low: Light Green
    2: '#C8E6C9', // Medium: Green
    3: '#A5D6A7', // High: Deep Green
    4: '#81C784', // Critical: Darker Green
    5: '#1B5E20', // Catastrophic: Very Deep Green
  },
  'Sybil Attack': {
    1: '#FFF9C4', // Low: Light Yellow
    2: '#FFF59D', // Medium: Yellow
    3: '#FFF176', // High: Deep Yellow
    4: '#FFEE58', // Critical: Darker Yellow
    5: '#F57F17', // Catastrophic: Very Deep Yellow
  },
};

/**
 * Get threat level description
 */
export const THREAT_LEVEL_NAMES: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'LOW',
  2: 'MEDIUM',
  3: 'HIGH',
  4: 'CRITICAL',
  5: 'CATASTROPHIC',
};

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const svgTemplates = {
  // ==================== HEAD ITEMS (300x220 viewBox) ====================

  cap: `<svg viewBox="0 0 300 220" data-zones="Основа,Козырёк,Кнопка" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 140 Q60 50 150 35 Q240 50 240 140 L225 140 Q225 65 150 50 Q75 65 75 140 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <line x1="150" y1="35" x2="150" y2="140" stroke="#333" stroke-width="1" opacity="0.3"/>
    <line x1="105" y1="42" x2="95" y2="140" stroke="#333" stroke-width="1" opacity="0.2"/>
    <line x1="195" y1="42" x2="205" y2="140" stroke="#333" stroke-width="1" opacity="0.2"/>
    <path d="M45 135 Q45 130 60 130 L240 130 Q255 130 255 135 L260 150 Q260 168 240 162 L200 158 Q150 178 60 158 Q40 168 40 150 Z" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <rect x="60" y="125" width="180" height="12" rx="2" fill="FILL_COLOR_1" stroke="#333" stroke-width="1.5" opacity="0.85"/>
    <circle cx="150" cy="38" r="7" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  beanie: `<svg viewBox="0 0 300 220" data-zones="Основа,Отворот,Помпон" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="30" r="18" fill="FILL_COLOR_3" stroke="#333" stroke-width="2"/>
    <circle cx="142" cy="24" r="4" fill="FILL_COLOR_3" stroke="#333" stroke-width="0.5" opacity="0.6"/>
    <circle cx="156" cy="26" r="3.5" fill="FILL_COLOR_3" stroke="#333" stroke-width="0.5" opacity="0.6"/>
    <path d="M65 155 Q65 50 150 40 Q235 50 235 155" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M75 80 Q110 75 150 78 Q190 75 225 80" fill="none" stroke="#333" stroke-width="0.8" opacity="0.25"/>
    <path d="M70 100 Q110 95 150 98 Q190 95 230 100" fill="none" stroke="#333" stroke-width="0.8" opacity="0.25"/>
    <rect x="60" y="140" width="180" height="35" rx="5" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <line x1="80" y1="145" x2="80" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="120" y1="145" x2="120" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="160" y1="145" x2="160" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="200" y1="145" x2="200" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
  </svg>`,

  sunglasses: `<svg viewBox="0 0 300 160" data-zones="Оправа,Линзы" xmlns="http://www.w3.org/2000/svg">
    <path d="M125 60 Q150 75 175 60" fill="none" stroke="FILL_COLOR_1" stroke-width="4"/>
    <path d="M30 40 Q30 25 55 20 L115 20 Q130 25 130 40 L130 85 Q130 110 105 115 L55 115 Q30 110 30 85 Z" fill="FILL_COLOR_2" stroke="FILL_COLOR_1" stroke-width="4" opacity="0.75"/>
    <path d="M170 40 Q170 25 195 20 L245 20 Q270 25 270 40 L270 85 Q270 110 245 115 L195 115 Q170 110 170 85 Z" fill="FILL_COLOR_2" stroke="FILL_COLOR_1" stroke-width="4" opacity="0.75"/>
    <path d="M30 45 L8 38 L5 35" stroke="FILL_COLOR_1" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M270 45 L292 38 L295 35" stroke="FILL_COLOR_1" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`,

  panama: `<svg viewBox="0 0 300 220" data-zones="Тулья,Поля,Лента" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="145" rx="135" ry="32" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M85 140 Q85 45 150 32 Q215 45 215 140" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <line x1="150" y1="36" x2="150" y2="140" stroke="#333" stroke-width="0.5" opacity="0.2"/>
    <rect x="80" y="128" width="140" height="16" rx="2" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <rect x="140" y="129" width="20" height="14" rx="2" fill="none" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  beret: `<svg viewBox="0 0 300 200" data-zones="Основа,Хвостик" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="28" r="8" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M70 150 Q60 85 100 48 Q130 28 150 30 Q200 28 230 65 Q260 105 240 150" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M65 142 Q65 136 75 134 L225 134 Q235 136 235 142 L235 158 Q235 164 225 166 L75 166 Q65 164 65 158 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2" opacity="0.85"/>
    <path d="M150 32 Q140 72 130 150" fill="none" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <path d="M150 32 Q180 62 200 150" fill="none" stroke="#333" stroke-width="0.8" opacity="0.3"/>
  </svg>`,

  headband: `<svg viewBox="0 0 300 120" data-zones="Основа,Полоска" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 70 Q30 20 150 15 Q270 20 270 70 Q270 82 260 88 L260 70 Q260 35 150 30 Q40 35 40 70 L40 88 Q30 82 30 70 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M35 58 Q35 38 150 34 Q265 38 265 58" fill="none" stroke="FILL_COLOR_2" stroke-width="8" opacity="0.7"/>
    <rect x="130" y="38" width="40" height="22" rx="4" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  bandana: `<svg viewBox="0 0 300 200" data-zones="Основа,Узел" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 80 Q40 30 150 22 Q260 30 260 80" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M40 80 L30 95 Q28 98 32 100 L60 90 Q45 82 40 80" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M260 80 L270 95 Q272 98 268 100 L240 90 Q255 82 260 80" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M130 30 Q150 22 170 30" fill="none" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <circle cx="150" cy="35" r="3" fill="none" stroke="#333" stroke-width="1" opacity="0.4"/>
    <circle cx="120" cy="45" r="2" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
    <circle cx="180" cy="45" r="2" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
  </svg>`,

  fedora: `<svg viewBox="0 0 300 220" data-zones="Тулья,Поля,Лента" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="155" rx="140" ry="28" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M80 150 L80 65 Q80 30 120 25 L135 45 L150 35 L165 45 L180 25 Q220 30 220 65 L220 150" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="78" y="138" width="144" height="14" rx="2" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <path d="M135 45 L150 35 L165 45" fill="none" stroke="#333" stroke-width="1.5" opacity="0.5"/>
  </svg>`,

  // ==================== TORSO ITEMS (300x320 viewBox) ====================

  tshirt: `<svg viewBox="0 0 300 320" data-zones="Основа,Рукава,Воротник" xmlns="http://www.w3.org/2000/svg">
    <path d="M90 25 L65 25 L65 70 L65 310 L235 310 L235 70 L235 25 L210 25 Q195 55 150 55 Q105 55 90 25 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M65 25 L10 70 L35 100 L65 70" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M235 25 L290 70 L265 100 L235 70" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M90 25 Q105 55 150 55 Q195 55 210 25 Q195 18 150 15 Q105 18 90 25" fill="FILL_COLOR_3" stroke="#333" stroke-width="2"/>
    <line x1="68" y1="305" x2="232" y2="305" stroke="#333" stroke-width="1.5" opacity="0.3"/>
  </svg>`,

  hoodie: `<svg viewBox="0 0 300 320" data-zones="Основа,Капюшон,Карман" xmlns="http://www.w3.org/2000/svg">
    <path d="M85 30 L55 30 L10 80 L40 110 L65 80 L65 310 L235 310 L235 80 L260 110 L290 80 L245 30 L215 30 Q200 60 150 60 Q100 60 85 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M85 30 Q95 -10 150 -15 Q205 -10 215 30" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M95 30 Q105 50 150 55 Q195 50 205 30" fill="none" stroke="#333" stroke-width="1.5"/>
    <line x1="120" y1="55" x2="115" y2="100" stroke="#333" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="180" y1="55" x2="185" y2="100" stroke="#333" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M100 180 L100 240 Q100 250 110 250 L190 250 Q200 250 200 240 L200 180" fill="FILL_COLOR_3" stroke="#333" stroke-width="2" opacity="0.8"/>
    <path d="M100 212 L200 212" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
  </svg>`,

  jacket: `<svg viewBox="0 0 300 320" data-zones="Основа,Рукава,Воротник" xmlns="http://www.w3.org/2000/svg">
    <path d="M85 30 L55 30 L10 80 L40 110 L65 80 L65 310 L235 310 L235 80 L260 110 L290 80 L245 30 L215 30 Q200 55 150 55 Q100 55 85 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M55 30 L10 80 L40 110 L65 80" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M245 30 L290 80 L260 110 L235 80" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <line x1="150" y1="55" x2="150" y2="310" stroke="#333" stroke-width="2.5"/>
    <path d="M85 30 Q95 15 110 20 L130 45 L150 55 L170 45 L190 20 Q205 15 215 30" fill="FILL_COLOR_3" stroke="#333" stroke-width="2"/>
    <rect x="80" y="175" width="50" height="45" rx="4" fill="none" stroke="#333" stroke-width="1.8" opacity="0.6"/>
    <rect x="170" y="175" width="50" height="45" rx="4" fill="none" stroke="#333" stroke-width="1.8" opacity="0.6"/>
  </svg>`,

  shirt: `<svg viewBox="0 0 300 320" data-zones="Основа,Воротник,Манжеты" xmlns="http://www.w3.org/2000/svg">
    <path d="M90 25 L60 25 L10 70 L40 100 L65 75 L65 310 L235 310 L235 75 L260 100 L290 70 L240 25 L210 25 Q195 50 150 50 Q105 50 90 25 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <line x1="150" y1="50" x2="150" y2="310" stroke="#333" stroke-width="2"/>
    <circle cx="150" cy="75" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="115" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="155" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="195" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="235" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="275" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <path d="M100 25 L115 55 L150 50 L185 55 L200 25" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M100 25 L90 25 Q105 50 150 50" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M200 25 L210 25 Q195 50 150 50" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <rect x="18" y="88" width="30" height="14" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5" transform="rotate(-35, 33, 95)"/>
    <rect x="252" y="88" width="30" height="14" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5" transform="rotate(35, 267, 95)"/>
  </svg>`,

  sweater: `<svg viewBox="0 0 300 320" data-zones="Основа,Воротник,Манжеты" xmlns="http://www.w3.org/2000/svg">
    <path d="M85 30 L55 30 L10 80 L40 110 L65 80 L65 310 L235 310 L235 80 L260 110 L290 80 L245 30 L215 30 Q200 55 150 55 Q100 55 85 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M85 30 Q90 5 150 0 Q210 5 215 30" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M80 80 L90 70 L100 80 L110 70 L120 80 L130 70 L140 80 L150 70 L160 80 L170 70 L180 80 L190 70 L200 80 L210 70 L220 80" fill="none" stroke="#333" stroke-width="0.8" opacity="0.2"/>
    <path d="M78 110 L88 100 L98 110 L108 100 L118 110 L128 100 L138 110 L148 100 L158 110 L168 100 L178 110 L188 100 L198 110 L208 100 L218 110" fill="none" stroke="#333" stroke-width="0.8" opacity="0.2"/>
    <rect x="65" y="295" width="170" height="15" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5" opacity="0.85"/>
  </svg>`,

  vest: `<svg viewBox="0 0 300 320" data-zones="Основа,Карманы" xmlns="http://www.w3.org/2000/svg">
    <path d="M90 25 L80 25 L75 310 L225 310 L220 25 L210 25 Q195 55 150 55 Q105 55 90 25 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M90 25 Q105 55 150 55 Q195 55 210 25" fill="none" stroke="#333" stroke-width="2"/>
    <line x1="150" y1="55" x2="150" y2="310" stroke="#333" stroke-width="2"/>
    <rect x="85" y="130" width="50" height="40" rx="4" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.5"/>
    <rect x="165" y="130" width="50" height="40" rx="4" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  coat: `<svg viewBox="0 0 300 320" data-zones="Основа,Воротник,Пуговицы" xmlns="http://www.w3.org/2000/svg">
    <path d="M80 30 L55 30 L10 80 L40 110 L60 85 L55 310 L245 310 L240 85 L260 110 L290 80 L245 30 L220 30 Q200 55 150 55 Q100 55 80 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M55 30 L10 80 L40 110 L60 85" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M245 30 L290 80 L260 110 L240 85" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <line x1="150" y1="55" x2="150" y2="310" stroke="#333" stroke-width="2"/>
    <path d="M80 30 Q90 10 120 15 L140 42 L150 55 L160 42 L180 15 Q210 10 220 30" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <circle cx="150" cy="90" r="5" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="140" r="5" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="190" r="5" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="240" r="5" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  bomber: `<svg viewBox="0 0 300 320" data-zones="Основа,Рукава,Манжеты" xmlns="http://www.w3.org/2000/svg">
    <path d="M85 30 L60 30 L65 80 L65 310 L235 310 L235 80 L240 30 L215 30 Q200 55 150 55 Q100 55 85 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M60 30 L10 80 L40 110 L65 80" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M240 30 L290 80 L260 110 L235 80" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M85 30 Q95 15 150 10 Q205 15 215 30" fill="FILL_COLOR_3" stroke="#333" stroke-width="2.5"/>
    <rect x="65" y="296" width="170" height="14" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <line x1="150" y1="55" x2="150" y2="310" stroke="#333" stroke-width="2"/>
  </svg>`,

  polo: `<svg viewBox="0 0 300 320" data-zones="Основа,Воротник,Манжеты" xmlns="http://www.w3.org/2000/svg">
    <path d="M90 30 L65 30 L65 70 L65 310 L235 310 L235 70 L235 30 L210 30 Q195 55 150 55 Q105 55 90 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M65 30 L15 72 L38 98 L65 70" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M235 30 L285 72 L262 98 L235 70" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M90 30 Q100 10 120 18 L140 42 Q150 50 160 42 L180 18 Q200 10 210 30" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <line x1="150" y1="50" x2="150" y2="120" stroke="#333" stroke-width="2"/>
    <circle cx="150" cy="72" r="3.5" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="95" r="3.5" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <rect x="65" y="296" width="170" height="14" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  tankTop: `<svg viewBox="0 0 300 320" data-zones="Основа,Окантовка" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 15 L85 15 L80 55 L80 310 L220 310 L220 55 L215 15 L200 15 Q190 45 150 48 Q110 45 100 15 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M100 15 Q110 45 150 48 Q190 45 200 15 Q190 5 150 2 Q110 5 100 15" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M85 15 L80 55" stroke="FILL_COLOR_2" stroke-width="4"/>
    <path d="M215 15 L220 55" stroke="FILL_COLOR_2" stroke-width="4"/>
  </svg>`,

  // ==================== BOTTOM ITEMS (300x360 viewBox) ====================

  jeans: `<svg viewBox="0 0 300 360" data-zones="Основа,Швы" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 5 L60 8 Q60 22 65 30 L65 350 L140 350 L145 145 L155 145 L160 350 L235 350 L235 30 Q240 22 240 8 L240 5 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <line x1="60" y1="5" x2="240" y2="5" stroke="#333" stroke-width="3"/>
    <path d="M60 30 L240 30" stroke="FILL_COLOR_2" stroke-width="2.5"/>
    <line x1="145" y1="30" x2="145" y2="145" stroke="FILL_COLOR_2" stroke-width="2"/>
    <line x1="155" y1="30" x2="155" y2="145" stroke="FILL_COLOR_2" stroke-width="2"/>
    <rect x="72" y="35" width="50" height="55" rx="4" fill="none" stroke="FILL_COLOR_2" stroke-width="1.8"/>
    <rect x="178" y="35" width="50" height="55" rx="4" fill="none" stroke="FILL_COLOR_2" stroke-width="1.8"/>
    <rect x="135" y="8" width="30" height="18" rx="2" fill="FILL_COLOR_1" stroke="#333" stroke-width="1"/>
  </svg>`,

  shorts: `<svg viewBox="0 0 300 250" data-zones="Основа,Пояс" xmlns="http://www.w3.org/2000/svg">
    <path d="M55 5 L55 8 Q55 20 58 28 L70 240 L140 240 L150 120 L160 240 L230 240 L242 28 Q245 20 245 8 L245 5 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="55" y="2" width="190" height="28" rx="4" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <rect x="135" y="4" width="30" height="22" rx="3" fill="FILL_COLOR_2" stroke="#333" stroke-width="1"/>
    <line x1="150" y1="30" x2="150" y2="120" stroke="#333" stroke-width="1.5" opacity="0.3"/>
    <rect x="70" y="40" width="45" height="40" rx="4" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
  </svg>`,

  skirt: `<svg viewBox="0 0 300 300" data-zones="Основа,Пояс" xmlns="http://www.w3.org/2000/svg">
    <path d="M80 30 L35 290 L265 290 L220 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="75" y="2" width="150" height="30" rx="5" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <rect x="138" y="4" width="24" height="26" rx="3" fill="FILL_COLOR_2" stroke="#333" stroke-width="1"/>
    <path d="M80 30 L90 285" fill="none" stroke="#333" stroke-width="0.8" opacity="0.2"/>
    <path d="M150 30 L150 285" fill="none" stroke="#333" stroke-width="0.8" opacity="0.2"/>
    <path d="M220 30 L210 285" fill="none" stroke="#333" stroke-width="0.8" opacity="0.2"/>
  </svg>`,

  joggers: `<svg viewBox="0 0 300 360" data-zones="Основа,Полоски,Манжеты" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 5 L60 8 Q60 20 63 28 L75 320 Q75 340 90 340 L130 340 Q140 340 140 320 L148 120 L152 120 L160 320 Q160 340 170 340 L210 340 Q225 340 225 320 L237 28 Q240 20 240 8 L240 5 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <line x1="60" y1="5" x2="240" y2="5" stroke="#333" stroke-width="3"/>
    <path d="M60 26 L240 26" stroke="#333" stroke-width="2"/>
    <line x1="63" y1="200" x2="80" y2="200" stroke="FILL_COLOR_2" stroke-width="3"/>
    <line x1="63" y1="250" x2="82" y2="250" stroke="FILL_COLOR_2" stroke-width="3"/>
    <line x1="237" y1="200" x2="220" y2="200" stroke="FILL_COLOR_2" stroke-width="3"/>
    <line x1="237" y1="250" x2="218" y2="250" stroke="FILL_COLOR_2" stroke-width="3"/>
    <rect x="75" y="315" width="65" height="25" rx="5" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <rect x="160" y="315" width="65" height="25" rx="5" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  trousers: `<svg viewBox="0 0 300 360" data-zones="Основа,Пояс,Стрелки" xmlns="http://www.w3.org/2000/svg">
    <path d="M65 5 L65 8 Q65 20 68 28 L78 350 L140 350 L148 120 L152 120 L160 350 L222 350 L232 28 Q235 20 235 8 L235 5 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="60" y="2" width="180" height="28" rx="4" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <rect x="138" y="4" width="24" height="22" rx="3" fill="FILL_COLOR_2" stroke="#333" stroke-width="1"/>
    <line x1="102" y1="60" x2="108" y2="340" stroke="FILL_COLOR_3" stroke-width="1.5" opacity="0.5"/>
    <line x1="192" y1="60" x2="198" y2="340" stroke="FILL_COLOR_3" stroke-width="1.5" opacity="0.5"/>
  </svg>`,

  cargo: `<svg viewBox="0 0 300 360" data-zones="Основа,Карманы,Ремень" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 5 L60 8 Q60 20 63 28 L75 350 L140 350 L148 140 L152 140 L160 350 L225 350 L237 28 Q240 20 240 8 L240 5 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <line x1="60" y1="5" x2="240" y2="5" stroke="#333" stroke-width="3"/>
    <path d="M60 25 L240 25" stroke="#333" stroke-width="2"/>
    <rect x="67" y="160" width="48" height="55" rx="5" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M67" y1="178" x2="115" y2="178" stroke="#333" stroke-width="1.5" opacity="0.5"/>
    <rect x="185" y="160" width="48" height="55" rx="5" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <rect x="55" y="5" width="190" height="6" rx="2" fill="FILL_COLOR_3" stroke="#333" stroke-width="1"/>
    <rect x="138" y="2" width="24" height="12" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  leggings: `<svg viewBox="0 0 300 360" data-zones="Основа,Пояс" xmlns="http://www.w3.org/2000/svg">
    <path d="M85 5 L85 8 Q85 20 87 28 L90 350 L140 350 L148 120 L152 120 L160 350 L210 350 L213 28 Q215 20 215 8 L215 5 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="80" y="2" width="140" height="26" rx="5" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <line x1="148" y1="28" x2="148" y2="120" stroke="#333" stroke-width="1" opacity="0.3"/>
    <line x1="152" y1="28" x2="152" y2="120" stroke="#333" stroke-width="1" opacity="0.3"/>
  </svg>`,

  // ==================== SHOES ITEMS (300x180 viewBox) ====================

  sneakers: `<svg viewBox="0 0 300 180" data-zones="Основа,Подошва,Шнурки" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 90 L40 60 Q40 30 80 25 L190 25 Q230 30 235 55 L260 60 Q290 65 290 90 L290 110 Q290 120 280 120 L50 120 Q40 120 40 110 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M35 110 Q35 100 45 100 L285 100 Q295 100 295 110 L295 140 Q295 155 280 155 L50 155 Q35 155 35 140 Z" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <circle cx="130" cy="50" r="4" fill="none" stroke="FILL_COLOR_3" stroke-width="2"/>
    <circle cx="150" cy="45" r="4" fill="none" stroke="FILL_COLOR_3" stroke-width="2"/>
    <circle cx="170" cy="50" r="4" fill="none" stroke="FILL_COLOR_3" stroke-width="2"/>
    <line x1="130" y1="54" x2="145" y2="60" stroke="FILL_COLOR_3" stroke-width="2"/>
    <line x1="150" y1="49" x2="155" y2="60" stroke="FILL_COLOR_3" stroke-width="2"/>
    <line x1="170" y1="54" x2="165" y2="60" stroke="FILL_COLOR_3" stroke-width="2"/>
    <line x1="50" y1="130" x2="280" y2="130" stroke="#333" stroke-width="1" opacity="0.3"/>
  </svg>`,

  boots: `<svg viewBox="0 0 300 180" data-zones="Основа,Подошва,Застёжка" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 5 L70 95 L40 100 Q20 105 15 115 L15 120 Q15 130 30 130 L55 125 L70 120 L250 120 Q270 120 275 110 L275 100 Q275 95 265 90 L260 5 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M10 125 Q10 115 25 115 L265 115 Q280 115 280 125 L280 150 Q280 165 265 165 L25 165 Q10 165 10 150 Z" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <line x1="100" y1="10" x2="100" y2="110" stroke="FILL_COLOR_3" stroke-width="3"/>
    <line x1="90" y1="25" x2="110" y2="25" stroke="FILL_COLOR_3" stroke-width="2"/>
    <line x1="90" y1="45" x2="110" y2="45" stroke="FILL_COLOR_3" stroke-width="2"/>
    <line x1="90" y1="65" x2="110" y2="65" stroke="FILL_COLOR_3" stroke-width="2"/>
    <line x1="90" y1="85" x2="110" y2="85" stroke="FILL_COLOR_3" stroke-width="2"/>
    <line x1="25" y1="145" x2="265" y2="145" stroke="#333" stroke-width="1.5" opacity="0.3"/>
  </svg>`,

  sandals: `<svg viewBox="0 0 300 140" data-zones="Ремешки,Подошва" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 60 Q40 40 70 35 L230 35 Q260 40 260 60 L260 80 Q260 100 230 105 L70 105 Q40 100 40 80 Z" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M80 30 L80 75 Q80 85 100 85 L200 85 Q220 85 220 75 L220 30" fill="none" stroke="FILL_COLOR_1" stroke-width="5"/>
    <path d="M150 30 L150 85" stroke="FILL_COLOR_1" stroke-width="5"/>
    <path d="M60 70 L240 70" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
  </svg>`,

  loafers: `<svg viewBox="0 0 300 160" data-zones="Основа,Подошва" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 55 Q50 20 120 15 L200 15 Q260 20 270 55 L280 70 Q295 80 295 95 L295 105 Q295 115 280 115 L55 115 Q45 115 45 105 L45 95 Q45 80 50 70 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M40 105 Q40 95 50 95 L290 95 Q300 95 300 105 L300 130 Q300 145 285 145 L55 145 Q40 145 40 130 Z" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M130 30 Q150 42 170 30" fill="none" stroke="#333" stroke-width="2" opacity="0.5"/>
    <ellipse cx="150" cy="55" rx="30" ry="12" fill="none" stroke="#333" stroke-width="1.5" opacity="0.3"/>
  </svg>`,

  highHeels: `<svg viewBox="0 0 300 180" data-zones="Основа,Подошва,Каблук" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 40 Q60 15 120 10 L200 10 Q250 15 255 45 L260 55 Q280 62 280 80 L280 90 Q280 100 265 100 L80 100 Q65 100 60 90 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M55 90 Q55 82 65 82 L270 82 Q280 82 280 90 L280 105 Q280 112 270 112 L65 112 Q55 112 55 105 Z" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M70 112 L55 165 L72 170 L82 118" fill="FILL_COLOR_3" stroke="#333" stroke-width="2.5"/>
    <path d="M50 162 L78 172 L78 175 L48 168 Z" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  // ==================== FEMININE ITEMS ====================

  cloche: `<svg viewBox="0 0 300 220" data-zones="Основа,Лента,Цветок" xmlns="http://www.w3.org/2000/svg">
    <path d="M75 160 Q75 45 150 30 Q225 45 225 160" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <ellipse cx="150" cy="160" rx="90" ry="18" fill="FILL_COLOR_1" stroke="#333" stroke-width="2"/>
    <rect x="72" y="138" width="156" height="16" rx="3" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.5"/>
    <circle cx="210" cy="146" r="12" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <circle cx="210" cy="146" r="5" fill="#333" opacity="0.3"/>
  </svg>`,

  bow: `<svg viewBox="0 0 300 140" data-zones="Бант,Центр" xmlns="http://www.w3.org/2000/svg">
    <path d="M150 70 Q100 20 50 40 Q20 55 40 80 Q60 105 150 70" fill="FILL_COLOR_1" stroke="#333" stroke-width="2"/>
    <path d="M150 70 Q200 20 250 40 Q280 55 260 80 Q240 105 150 70" fill="FILL_COLOR_1" stroke="#333" stroke-width="2"/>
    <ellipse cx="150" cy="70" rx="15" ry="12" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M140 82 L135 115 Q135 120 140 120 L160 120 Q165 120 165 115 L160 82" fill="FILL_COLOR_1" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  cropTop: `<svg viewBox="0 0 300 240" data-zones="Основа,Бретели" xmlns="http://www.w3.org/2000/svg">
    <path d="M95 50 L70 50 L70 230 Q70 238 80 238 L220 238 Q230 238 230 230 L230 50 L205 50 Q190 75 150 75 Q110 75 95 50 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M95 50 Q100 20 120 10 L130 10 L110 50" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M205 50 Q200 20 180 10 L170 10 L190 50" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <line x1="72" y1="232" x2="228" y2="232" stroke="#333" stroke-width="1.5" opacity="0.3"/>
  </svg>`,

  blouse: `<svg viewBox="0 0 300 320" data-zones="Основа,Рукава,Воротник" xmlns="http://www.w3.org/2000/svg">
    <path d="M90 30 L65 30 L65 310 L235 310 L235 30 L210 30 Q195 58 150 58 Q105 58 90 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M65 30 L15 65 Q5 72 15 82 L45 100 L65 70" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M235 30 L285 65 Q295 72 285 82 L255 100 L235 70" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M90 30 Q100 18 120 12 L135 22 L150 15 L165 22 L180 12 Q200 18 210 30" fill="FILL_COLOR_3" stroke="#333" stroke-width="2"/>
    <circle cx="150" cy="80" r="3.5" fill="#333" opacity="0.4"/>
    <circle cx="150" cy="120" r="3.5" fill="#333" opacity="0.4"/>
    <circle cx="150" cy="160" r="3.5" fill="#333" opacity="0.4"/>
    <circle cx="150" cy="200" r="3.5" fill="#333" opacity="0.4"/>
  </svg>`,

  dress: `<svg viewBox="0 0 300 420" data-zones="Верх,Юбка,Пояс" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 30 Q105 15 125 8 L130 8 L115 45" fill="FILL_COLOR_1" stroke="#333" stroke-width="2"/>
    <path d="M200 30 Q195 15 175 8 L170 8 L185 45" fill="FILL_COLOR_1" stroke="#333" stroke-width="2"/>
    <path d="M100 30 L80 30 L80 180 L30 410 Q28 418 38 418 L262 418 Q272 418 270 410 L220 180 L220 30 L200 30 Q188 60 150 60 Q112 60 100 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="78" y="170" width="144" height="16" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.8"/>
    <path d="M80 186 L30 410" fill="none" stroke="#333" stroke-width="1" opacity="0.2"/>
    <path d="M220 186 L270 410" fill="none" stroke="#333" stroke-width="1" opacity="0.2"/>
    <path d="M150 186 L150 410" fill="none" stroke="#333" stroke-width="1" opacity="0.15"/>
    <path d="M80 186 Q150 200 220 186" fill="FILL_COLOR_2" stroke="none" opacity="0.15"/>
  </svg>`,

  sundress: `<svg viewBox="0 0 300 400" data-zones="Основа,Бретели,Рюши" xmlns="http://www.w3.org/2000/svg">
    <path d="M90 60 L85 170 L40 390 Q38 398 48 398 L252 398 Q262 398 260 390 L215 170 L210 60 Q195 80 150 80 Q105 80 90 60 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M105 60 Q110 20 130 8 L135 28" fill="none" stroke="FILL_COLOR_2" stroke-width="5" stroke-linecap="round"/>
    <path d="M195 60 Q190 20 170 8 L165 28" fill="none" stroke="FILL_COLOR_2" stroke-width="5" stroke-linecap="round"/>
    <path d="M40 385 Q90 370 150 375 Q210 370 260 385" fill="none" stroke="FILL_COLOR_3" stroke-width="3" opacity="0.6"/>
    <path d="M42 392 Q95 378 150 382 Q205 378 258 392" fill="none" stroke="FILL_COLOR_3" stroke-width="2" opacity="0.4"/>
  </svg>`,

  miniSkirt: `<svg viewBox="0 0 300 220" data-zones="Основа,Пояс" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 30 L50 210 Q48 218 58 218 L242 218 Q252 218 250 210 L230 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="68" y="22" width="164" height="18" rx="4" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M150 40 L150 210" fill="none" stroke="#333" stroke-width="1.5" opacity="0.2"/>
  </svg>`,

  balletFlats: `<svg viewBox="0 0 300 130" data-zones="Основа,Бант" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 40 Q50 15 120 10 L200 10 Q270 15 280 45 L285 55 Q298 65 298 78 L298 85 Q298 95 285 100 L60 100 Q45 100 45 88 L45 75 Q45 60 50 50 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M140 35 Q150 28 160 35" fill="none" stroke="FILL_COLOR_2" stroke-width="3"/>
    <circle cx="150" cy="40" r="5" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.5"/>
    <path d="M55 95 L290 95" fill="none" stroke="#333" stroke-width="1.2" opacity="0.3"/>
  </svg>`,

  platformShoes: `<svg viewBox="0 0 300 180" data-zones="Основа,Платформа,Ремешок" xmlns="http://www.w3.org/2000/svg">
    <path d="M55 35 Q55 10 120 5 L200 5 Q255 10 260 40 L265 50 Q285 58 285 75 L285 85 Q285 95 270 95 L65 95 Q50 95 50 85 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M45 88 Q45 78 55 78 L275 78 Q285 78 285 88 L285 130 Q285 145 270 150 L60 150 Q45 150 45 135 Z" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M100 5 L100 45 Q100 55 110 55 L190 55 Q200 55 200 45 L200 5" fill="none" stroke="FILL_COLOR_3" stroke-width="4"/>
  </svg>`,
};

export async function seed() {
  const itemCount = await prisma.clothingItem.count();
  if (itemCount > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@outfit.com",
      hashedPassword: adminPassword,
      isAdmin: true,
    },
  });
  console.log("Admin user created: admin");

  const demoPassword = await bcrypt.hash("demo123", 10);
  await prisma.user.upsert({
    where: { username: "demo" },
    update: {},
    create: {
      username: "demo",
      email: "demo@outfit.com",
      hashedPassword: demoPassword,
      isAdmin: false,
    },
  });
  console.log("Demo user created: demo");

  const topCategory = await prisma.clothingCategory.create({
    data: { name: "Головные уборы", zone: "top", displayOrder: 1 },
  });
  const middleCategory = await prisma.clothingCategory.create({
    data: { name: "Верхняя одежда", zone: "middle", displayOrder: 2 },
  });
  const bottomCategory = await prisma.clothingCategory.create({
    data: { name: "Нижняя одежда", zone: "bottom", displayOrder: 3 },
  });
  const shoesCategory = await prisma.clothingCategory.create({
    data: { name: "Обувь", zone: "shoes", displayOrder: 4 },
  });

  // Create items
  const items = [
    // Head (8)
    { name: "Кепка", categoryId: topCategory.id, svg: svgTemplates.cap, color: "#2563EB,#1E40AF,#FFFFFF" },
    { name: "Шапка", categoryId: topCategory.id, svg: svgTemplates.beanie, color: "#DC2626,#B91C1C,#FFFFFF" },
    { name: "Очки", categoryId: topCategory.id, svg: svgTemplates.sunglasses, color: "#1F2937,#374151" },
    { name: "Панама", categoryId: topCategory.id, svg: svgTemplates.panama, color: "#D4A574,#C9956A,#8B6914" },
    { name: "Берет", categoryId: topCategory.id, svg: svgTemplates.beret, color: "#1F2937,#374151" },
    { name: "Повязка", categoryId: topCategory.id, svg: svgTemplates.headband, color: "#DC2626,#FFFFFF" },
    { name: "Бандана", categoryId: topCategory.id, svg: svgTemplates.bandana, color: "#7C3AED,#6D28D9" },
    { name: "Федора", categoryId: topCategory.id, svg: svgTemplates.fedora, color: "#78350F,#5F2F0E,#1F2937" },
    { name: "Клош", categoryId: topCategory.id, svg: svgTemplates.cloche, color: "#F9A8D4,#DB2777,#FBBF24" },
    { name: "Бантик", categoryId: topCategory.id, svg: svgTemplates.bow, color: "#F472B6,#EC4899" },
    // Torso (11)
    { name: "Футболка", categoryId: middleCategory.id, svg: svgTemplates.tshirt, color: "#FFFFFF,#FFFFFF,#FFFFFF" },
    { name: "Толстовка", categoryId: middleCategory.id, svg: svgTemplates.hoodie, color: "#6B7280,#4B5563,#374151" },
    { name: "Куртка", categoryId: middleCategory.id, svg: svgTemplates.jacket, color: "#1E3A5F,#1E3A5F,#F5F5F4" },
    { name: "Рубашка", categoryId: middleCategory.id, svg: svgTemplates.shirt, color: "#E5E7EB,#FFFFFF,#E5E7EB" },
    { name: "Свитер", categoryId: middleCategory.id, svg: svgTemplates.sweater, color: "#92400E,#78350F,#A16207" },
    { name: "Жилет", categoryId: middleCategory.id, svg: svgTemplates.vest, color: "#374151,#4B5563" },
    { name: "Пальто", categoryId: middleCategory.id, svg: svgTemplates.coat, color: "#78350F,#5F2F0E,#D4A574" },
    { name: "Бомбер", categoryId: middleCategory.id, svg: svgTemplates.bomber, color: "#064E3B,#1F2937,#D97706" },
    { name: "Поло", categoryId: middleCategory.id, svg: svgTemplates.polo, color: "#1D4ED8,#FFFFFF,#1D4ED8" },
    { name: "Майка", categoryId: middleCategory.id, svg: svgTemplates.tankTop, color: "#1F2937,#374151" },
    { name: "Кроп-топ", categoryId: middleCategory.id, svg: svgTemplates.cropTop, color: "#F472B6,#EC4899" },
    { name: "Блузка", categoryId: middleCategory.id, svg: svgTemplates.blouse, color: "#FECDD3,#FCA5A5,#FFFFFF" },
    { name: "Платье", categoryId: middleCategory.id, svg: svgTemplates.dress, color: "#C084FC,#A855F7,#FBBF24" },
    { name: "Сарафан", categoryId: middleCategory.id, svg: svgTemplates.sundress, color: "#FDE68A,#F59E0B,#FCA5A5" },
    // Bottom (8)
    { name: "Джинсы", categoryId: bottomCategory.id, svg: svgTemplates.jeans, color: "#1E40AF,#F59E0B" },
    { name: "Шорты", categoryId: bottomCategory.id, svg: svgTemplates.shorts, color: "#059669,#047857" },
    { name: "Юбка", categoryId: bottomCategory.id, svg: svgTemplates.skirt, color: "#DB2777,#BE185D" },
    { name: "Джоггеры", categoryId: bottomCategory.id, svg: svgTemplates.joggers, color: "#4B5563,#FFFFFF,#6B7280" },
    { name: "Брюки", categoryId: bottomCategory.id, svg: svgTemplates.trousers, color: "#1F2937,#374151,#1F2937" },
    { name: "Карго", categoryId: bottomCategory.id, svg: svgTemplates.cargo, color: "#65712B,#4D5522,#8B6914" },
    { name: "Леггинсы", categoryId: bottomCategory.id, svg: svgTemplates.leggings, color: "#111827,#374151" },
    { name: "Мини-юбка", categoryId: bottomCategory.id, svg: svgTemplates.miniSkirt, color: "#EC4899,#BE185D" },
    // Shoes (5)
    { name: "Кроссовки", categoryId: shoesCategory.id, svg: svgTemplates.sneakers, color: "#FFFFFF,#1F2937,#DC2626" },
    { name: "Ботинки", categoryId: shoesCategory.id, svg: svgTemplates.boots, color: "#78350F,#1F2937,#D4A574" },
    { name: "Сандалии", categoryId: shoesCategory.id, svg: svgTemplates.sandals, color: "#92400E,#D4A574" },
    { name: "Лоферы", categoryId: shoesCategory.id, svg: svgTemplates.loafers, color: "#1F2937,#374151" },
    { name: "Туфли", categoryId: shoesCategory.id, svg: svgTemplates.highHeels, color: "#DC2626,#1F2937,#DC2626" },
    { name: "Балетки", categoryId: shoesCategory.id, svg: svgTemplates.balletFlats, color: "#F9A8D4,#EC4899" },
    { name: "Платформы", categoryId: shoesCategory.id, svg: svgTemplates.platformShoes, color: "#A855F7,#7C3AED,#FBBF24" },
  ];

  for (const item of items) {
    await prisma.clothingItem.create({
      data: {
        name: item.name,
        categoryId: item.categoryId,
        svgTemplate: item.svg,
        defaultColor: item.color,
      },
    });
  }

  console.log(`Created ${items.length} clothing items`);
  console.log("Seed completed!");
}

if (require.main === module || process.argv[1]?.endsWith("seed.ts")) {
  seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}

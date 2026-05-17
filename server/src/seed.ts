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
    <circle cx="100" cy="80" r="3" fill="none" stroke="#333" stroke-width="1" opacity="0.4"/>
    <circle cx="200" cy="80" r="3" fill="none" stroke="#333" stroke-width="1" opacity="0.4"/>
  </svg>`,

  beanie: `<svg viewBox="0 0 300 220" data-zones="Основа,Отворот,Помпон" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="30" r="18" fill="FILL_COLOR_3" stroke="#333" stroke-width="2"/>
    <circle cx="142" cy="24" r="4" fill="FILL_COLOR_3" stroke="#333" stroke-width="0.5" opacity="0.6"/>
    <circle cx="156" cy="26" r="3.5" fill="FILL_COLOR_3" stroke="#333" stroke-width="0.5" opacity="0.6"/>
    <circle cx="150" cy="38" r="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="0.5" opacity="0.6"/>
    <path d="M65 155 Q65 50 150 40 Q235 50 235 155" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M75 80 Q110 75 150 78 Q190 75 225 80" fill="none" stroke="#333" stroke-width="0.8" opacity="0.25"/>
    <path d="M70 100 Q110 95 150 98 Q190 95 230 100" fill="none" stroke="#333" stroke-width="0.8" opacity="0.25"/>
    <path d="M68 120 Q110 115 150 118 Q190 115 232 120" fill="none" stroke="#333" stroke-width="0.8" opacity="0.25"/>
    <rect x="60" y="140" width="180" height="35" rx="5" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <line x1="80" y1="145" x2="80" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="100" y1="145" x2="100" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="120" y1="145" x2="120" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="140" y1="145" x2="140" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="160" y1="145" x2="160" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="180" y1="145" x2="180" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="200" y1="145" x2="200" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="220" y1="145" x2="220" y2="172" stroke="#333" stroke-width="0.8" opacity="0.3"/>
  </svg>`,

  sunglasses: `<svg viewBox="0 0 300 160" data-zones="Оправа,Линзы" xmlns="http://www.w3.org/2000/svg">
    <path d="M125 60 Q150 75 175 60" fill="none" stroke="FILL_COLOR_1" stroke-width="4"/>
    <path d="M30 40 Q30 25 55 20 L115 20 Q130 25 130 40 L130 85 Q130 110 105 115 L55 115 Q30 110 30 85 Z" fill="FILL_COLOR_2" stroke="FILL_COLOR_1" stroke-width="4" opacity="0.75"/>
    <path d="M170 40 Q170 25 195 20 L245 20 Q270 25 270 40 L270 85 Q270 110 245 115 L195 115 Q170 110 170 85 Z" fill="FILL_COLOR_2" stroke="FILL_COLOR_1" stroke-width="4" opacity="0.75"/>
    <path d="M30 45 L8 38 L5 35" stroke="FILL_COLOR_1" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M270 45 L292 38 L295 35" stroke="FILL_COLOR_1" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M50 40 L70 35 L75 45" fill="none" stroke="#fff" stroke-width="2" opacity="0.4"/>
    <path d="M190 40 L210 35 L215 45" fill="none" stroke="#fff" stroke-width="2" opacity="0.4"/>
  </svg>`,

  panama: `<svg viewBox="0 0 300 220" data-zones="Тулья,Поля,Лента" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="145" rx="135" ry="32" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M85 140 Q85 45 150 32 Q215 45 215 140" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M120 48 Q150 58 180 48" fill="none" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="150" y1="36" x2="150" y2="140" stroke="#333" stroke-width="0.5" opacity="0.2"/>
    <rect x="80" y="128" width="140" height="16" rx="2" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <rect x="140" y="129" width="20" height="14" rx="2" fill="none" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="150" cy="145" rx="118" ry="24" fill="none" stroke="#333" stroke-width="0.8" opacity="0.3" stroke-dasharray="4,3"/>
  </svg>`,

  beret: `<svg viewBox="0 0 300 200" data-zones="Основа,Хвостик" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="28" r="8" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M70 150 Q60 85 100 48 Q130 28 150 30 Q200 28 230 65 Q260 105 240 150" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M65 142 Q65 136 75 134 L225 134 Q235 136 235 142 L235 158 Q235 164 225 166 L75 166 Q65 164 65 158 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2" opacity="0.85"/>
    <path d="M150 32 Q140 72 130 150" fill="none" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <path d="M150 32 Q180 62 200 150" fill="none" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <path d="M150 32 Q110 58 90 150" fill="none" stroke="#333" stroke-width="0.8" opacity="0.3"/>
  </svg>`,

  headband: `<svg viewBox="0 0 300 120" data-zones="Основа,Полоска" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 70 Q30 20 150 15 Q270 20 270 70 Q270 82 260 88 L260 70 Q260 35 150 30 Q40 35 40 70 L40 88 Q30 82 30 70 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M35 58 Q35 38 150 34 Q265 38 265 58" fill="none" stroke="FILL_COLOR_2" stroke-width="8" opacity="0.7"/>
    <rect x="130" y="38" width="40" height="22" rx="4" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.5"/>
    <path d="M50 45 Q150 38 250 45" fill="none" stroke="#333" stroke-width="0.5" opacity="0.2"/>
    <path d="M45 68 Q150 58 255 68" fill="none" stroke="#333" stroke-width="0.5" opacity="0.2"/>
  </svg>`,

  // ==================== TORSO ITEMS (300x320 viewBox) ====================

  tshirt: `<svg viewBox="0 0 300 320" data-zones="Основа,Рукава,Воротник" xmlns="http://www.w3.org/2000/svg">
    <path d="M90 25 L65 25 L65 70 L65 310 L235 310 L235 70 L235 25 L210 25 Q195 55 150 55 Q105 55 90 25 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M65 25 L10 70 L35 100 L65 70" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M235 25 L290 70 L265 100 L235 70" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M90 25 Q105 55 150 55 Q195 55 210 25 Q195 18 150 15 Q105 18 90 25" fill="FILL_COLOR_3" stroke="#333" stroke-width="2"/>
    <line x1="20" y1="78" x2="55" y2="92" stroke="#333" stroke-width="1.5" opacity="0.3"/>
    <line x1="245" y1="92" x2="280" y2="78" stroke="#333" stroke-width="1.5" opacity="0.3"/>
    <line x1="68" y1="305" x2="232" y2="305" stroke="#333" stroke-width="1.5" opacity="0.3"/>
    <line x1="65" y1="70" x2="65" y2="310" stroke="#333" stroke-width="1" opacity="0.15"/>
    <line x1="235" y1="70" x2="235" y2="310" stroke="#333" stroke-width="1" opacity="0.15"/>
  </svg>`,

  hoodie: `<svg viewBox="0 0 300 320" data-zones="Основа,Капюшон,Карман" xmlns="http://www.w3.org/2000/svg">
    <path d="M85 30 L55 30 L10 80 L40 110 L65 80 L65 310 L235 310 L235 80 L260 110 L290 80 L245 30 L215 30 Q200 60 150 60 Q100 60 85 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M85 30 Q95 -10 150 -15 Q205 -10 215 30" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M95 30 Q105 50 150 55 Q195 50 205 30" fill="none" stroke="#333" stroke-width="1.5"/>
    <line x1="120" y1="55" x2="115" y2="100" stroke="#333" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="180" y1="55" x2="185" y2="100" stroke="#333" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
    <circle cx="115" cy="103" r="3" fill="#333" opacity="0.5"/>
    <circle cx="185" cy="103" r="3" fill="#333" opacity="0.5"/>
    <path d="M100 180 L100 240 Q100 250 110 250 L190 250 Q200 250 200 240 L200 180" fill="FILL_COLOR_3" stroke="#333" stroke-width="2" opacity="0.8"/>
    <path d="M100 212 L200 212" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
    <rect x="65" y="298" width="170" height="12" rx="2" fill="FILL_COLOR_1" stroke="#333" stroke-width="1.5" opacity="0.85"/>
  </svg>`,

  jacket: `<svg viewBox="0 0 300 320" data-zones="Основа,Рукава,Воротник" xmlns="http://www.w3.org/2000/svg">
    <path d="M85 30 L55 30 L10 80 L40 110 L65 80 L65 310 L235 310 L235 80 L260 110 L290 80 L245 30 L215 30 Q200 55 150 55 Q100 55 85 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M55 30 L10 80 L40 110 L65 80" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M245 30 L290 80 L260 110 L235 80" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <line x1="150" y1="55" x2="150" y2="310" stroke="#333" stroke-width="2.5"/>
    <path d="M85 30 Q95 15 110 20 L130 45 L150 55 L170 45 L190 20 Q205 15 215 30" fill="FILL_COLOR_3" stroke="#333" stroke-width="2"/>
    <rect x="80" y="175" width="50" height="45" rx="4" fill="none" stroke="#333" stroke-width="1.8" opacity="0.6"/>
    <line x1="80" y1="185" x2="130" y2="185" stroke="#333" stroke-width="1.5" opacity="0.4"/>
    <rect x="170" y="175" width="50" height="45" rx="4" fill="none" stroke="#333" stroke-width="1.8" opacity="0.6"/>
    <line x1="170" y1="185" x2="220" y2="185" stroke="#333" stroke-width="1.5" opacity="0.4"/>
    <line x1="147" y1="70" x2="153" y2="70" stroke="#333" stroke-width="1" opacity="0.4"/>
    <line x1="147" y1="100" x2="153" y2="100" stroke="#333" stroke-width="1" opacity="0.4"/>
    <line x1="147" y1="130" x2="153" y2="130" stroke="#333" stroke-width="1" opacity="0.4"/>
    <line x1="147" y1="160" x2="153" y2="160" stroke="#333" stroke-width="1" opacity="0.4"/>
  </svg>`,

  shirt: `<svg viewBox="0 0 300 320" data-zones="Основа,Воротник,Манжеты" xmlns="http://www.w3.org/2000/svg">
    <path d="M90 25 L60 25 L10 70 L40 100 L65 75 L65 310 L235 310 L235 75 L260 100 L290 70 L240 25 L210 25 Q195 50 150 50 Q105 50 90 25 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <line x1="150" y1="50" x2="150" y2="310" stroke="#333" stroke-width="2"/>
    <circle cx="150" cy="75" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="110" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="145" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="180" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="215" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="250" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="285" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <path d="M100 25 L115 55 L150 50 L185 55 L200 25" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M100 25 L90 25 Q105 50 150 50" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <path d="M200 25 L210 25 Q195 50 150 50" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <rect x="18" y="88" width="30" height="14" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5" transform="rotate(-35, 33, 95)"/>
    <rect x="252" y="88" width="30" height="14" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5" transform="rotate(35, 267, 95)"/>
    <path d="M95 90 L95 130 L125 130 L125 90" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
    <line x1="95" y1="90" x2="125" y2="90" stroke="#333" stroke-width="1.5" opacity="0.5"/>
  </svg>`,

  sweater: `<svg viewBox="0 0 300 320" data-zones="Основа,Воротник,Манжеты" xmlns="http://www.w3.org/2000/svg">
    <path d="M85 30 L55 30 L10 80 L40 110 L65 80 L65 310 L235 310 L235 80 L260 110 L290 80 L245 30 L215 30 Q200 55 150 55 Q100 55 85 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M85 30 Q90 5 150 0 Q210 5 215 30" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M88 28 Q92 10 150 6 Q208 10 212 28" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
    <path d="M90 25 Q95 15 150 10 Q205 15 210 25" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
    <path d="M80 80 L90 70 L100 80 L110 70 L120 80 L130 70 L140 80 L150 70 L160 80 L170 70 L180 80 L190 70 L200 80 L210 70 L220 80" fill="none" stroke="#333" stroke-width="0.8" opacity="0.2"/>
    <path d="M78 110 L88 100 L98 110 L108 100 L118 110 L128 100 L138 110 L148 100 L158 110 L168 100 L178 110 L188 100 L198 110 L208 100 L218 110" fill="none" stroke="#333" stroke-width="0.8" opacity="0.2"/>
    <path d="M75 140 L85 130 L95 140 L105 130 L115 140 L125 130 L135 140 L145 130 L155 140 L165 130 L175 140 L185 130 L195 140 L205 130 L215 140" fill="none" stroke="#333" stroke-width="0.8" opacity="0.2"/>
    <rect x="65" y="295" width="170" height="15" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5" opacity="0.85"/>
    <rect x="22" y="98" width="28" height="14" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5" opacity="0.8" transform="rotate(-30, 36, 105)"/>
    <rect x="250" y="98" width="28" height="14" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5" opacity="0.8" transform="rotate(30, 264, 105)"/>
  </svg>`,

  vest: `<svg viewBox="0 0 300 320" data-zones="Основа,Карманы" xmlns="http://www.w3.org/2000/svg">
    <path d="M90 25 L80 25 L75 310 L225 310 L220 25 L210 25 Q195 55 150 55 Q105 55 90 25 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M90 25 Q105 55 150 55 Q195 55 210 25" fill="none" stroke="#333" stroke-width="2"/>
    <path d="M80 25 L75 35 Q68 80 75 95" fill="none" stroke="#333" stroke-width="2"/>
    <path d="M220 25 L225 35 Q232 80 225 95" fill="none" stroke="#333" stroke-width="2"/>
    <line x1="150" y1="55" x2="150" y2="310" stroke="#333" stroke-width="2"/>
    <path d="M90 160 L90 215 Q90 220 95 220 L140 220 Q145 220 145 215 L145 160" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.8" opacity="0.7"/>
    <path d="M155 160 L155 215 Q155 220 160 220 L205 220 Q210 220 210 215 L210 160" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.8" opacity="0.7"/>
    <line x1="78" y1="305" x2="222" y2="305" stroke="#333" stroke-width="1.5" opacity="0.3"/>
  </svg>`,

  coat: `<svg viewBox="0 0 300 320" data-zones="Основа,Воротник,Пуговицы" xmlns="http://www.w3.org/2000/svg">
    <path d="M85 35 L50 35 L5 90 L35 120 L60 90 L55 310 L245 310 L240 90 L265 120 L295 90 L250 35 L215 35 Q200 60 150 60 Q100 60 85 35 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M85 35 L95 25 L120 60 L150 65 L180 60 L205 25 L215 35" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M95 25 L85 10 Q150 -5 215 10 L205 25" fill="FILL_COLOR_2" stroke="#333" stroke-width="2"/>
    <line x1="110" y1="35" x2="125" y2="65" stroke="#333" stroke-width="1" opacity="0.3"/>
    <line x1="190" y1="35" x2="175" y2="65" stroke="#333" stroke-width="1" opacity="0.3"/>
    <line x1="150" y1="65" x2="150" y2="310" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="95" r="5" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="140" r="5" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="185" r="5" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="230" r="5" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5"/>
    <rect x="75" y="180" width="55" height="8" rx="2" fill="none" stroke="#333" stroke-width="1.5" opacity="0.5"/>
    <rect x="170" y="180" width="55" height="8" rx="2" fill="none" stroke="#333" stroke-width="1.5" opacity="0.5"/>
    <rect x="55" y="205" width="190" height="8" rx="2" fill="#333" stroke="none" opacity="0.12"/>
  </svg>`,

  bomber: `<svg viewBox="0 0 300 320" data-zones="Основа,Рукава,Резинки" xmlns="http://www.w3.org/2000/svg">
    <path d="M85 30 L55 30 L10 80 L40 115 L65 85 L65 310 L235 310 L235 85 L260 115 L290 80 L245 30 L215 30 Q200 55 150 55 Q100 55 85 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <path d="M55 30 L10 80 L40 115 L65 85" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M245 30 L290 80 L260 115 L235 85" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <line x1="150" y1="55" x2="150" y2="295" stroke="#333" stroke-width="3"/>
    <rect x="146" y="80" width="8" height="12" rx="2" fill="#999" stroke="#333" stroke-width="1"/>
    <path d="M85 30 Q100 20 150 16 Q200 20 215 30" fill="FILL_COLOR_3" stroke="#333" stroke-width="2.5"/>
    <path d="M88 28 Q102 22 150 19 Q198 22 212 28" fill="none" stroke="#333" stroke-width="1" opacity="0.4"/>
    <rect x="65" y="295" width="170" height="15" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="2" opacity="0.9"/>
    <line x1="80" y1="297" x2="80" y2="308" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="100" y1="297" x2="100" y2="308" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="120" y1="297" x2="120" y2="308" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="140" y1="297" x2="140" y2="308" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="160" y1="297" x2="160" y2="308" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="180" y1="297" x2="180" y2="308" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="200" y1="297" x2="200" y2="308" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <line x1="220" y1="297" x2="220" y2="308" stroke="#333" stroke-width="0.8" opacity="0.3"/>
    <rect x="88" y="100" width="40" height="35" rx="3" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
  </svg>`,

  // ==================== BOTTOM ITEMS (300x360 viewBox) ====================

  jeans: `<svg viewBox="0 0 300 360" data-zones="Основа,Швы" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 15 L60 20 Q58 180 45 345 L130 345 L150 200 L170 345 L255 345 Q242 180 240 20 L240 15 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="58" y="10" width="184" height="20" rx="3" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="85" y="8" width="8" height="24" rx="1" fill="FILL_COLOR_1" stroke="#333" stroke-width="1.5"/>
    <rect x="120" y="8" width="8" height="24" rx="1" fill="FILL_COLOR_1" stroke="#333" stroke-width="1.5"/>
    <rect x="172" y="8" width="8" height="24" rx="1" fill="FILL_COLOR_1" stroke="#333" stroke-width="1.5"/>
    <rect x="207" y="8" width="8" height="24" rx="1" fill="FILL_COLOR_1" stroke="#333" stroke-width="1.5"/>
    <path d="M150 30 L150 80 Q148 85 145 80 L145 35" fill="none" stroke="FILL_COLOR_2" stroke-width="2" opacity="0.6"/>
    <path d="M75 40 L75 75 Q78 90 95 85 L115 55 L115 40" fill="none" stroke="FILL_COLOR_2" stroke-width="2" opacity="0.5"/>
    <path d="M225 40 L225 75 Q222 90 205 85 L185 55 L185 40" fill="none" stroke="FILL_COLOR_2" stroke-width="2" opacity="0.5"/>
    <path d="M70 200 Q90 195 100 200" fill="none" stroke="FILL_COLOR_2" stroke-width="1.5" opacity="0.4"/>
    <path d="M200 200 Q210 195 230 200" fill="none" stroke="FILL_COLOR_2" stroke-width="1.5" opacity="0.4"/>
    <line x1="48" y1="340" x2="128" y2="340" stroke="FILL_COLOR_2" stroke-width="2" opacity="0.5"/>
    <line x1="172" y1="340" x2="253" y2="340" stroke="FILL_COLOR_2" stroke-width="2" opacity="0.5"/>
    <path d="M150 200 L130 345" fill="none" stroke="FILL_COLOR_2" stroke-width="1.5" opacity="0.3"/>
    <path d="M150 200 L170 345" fill="none" stroke="FILL_COLOR_2" stroke-width="1.5" opacity="0.3"/>
  </svg>`,

  shorts: `<svg viewBox="0 0 300 220" data-zones="Основа,Пояс" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 30 L60 35 Q58 110 50 210 L130 210 L150 145 L170 210 L250 210 Q242 110 240 35 L240 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="58" y="10" width="184" height="22" rx="3" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M140 22 L130 42 M160 22 L170 42" stroke="#333" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
    <line x1="60" y1="30" x2="50" y2="210" stroke="#333" stroke-width="1" opacity="0.2"/>
    <line x1="240" y1="30" x2="250" y2="210" stroke="#333" stroke-width="1" opacity="0.2"/>
    <path d="M78 45 L78 80 Q80 90 95 85 L110 60 L110 45" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
    <path d="M222 45 L222 80 Q220 90 205 85 L190 60 L190 45" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
    <line x1="52" y1="205" x2="128" y2="205" stroke="#333" stroke-width="1.5" opacity="0.3"/>
    <line x1="172" y1="205" x2="248" y2="205" stroke="#333" stroke-width="1.5" opacity="0.3"/>
  </svg>`,

  skirt: `<svg viewBox="0 0 300 300" data-zones="Основа,Пояс" xmlns="http://www.w3.org/2000/svg">
    <path d="M75 30 L25 285 L275 285 L225 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="73" y="10" width="154" height="22" rx="3" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <path d="M150 30 L145 285" stroke="#333" stroke-width="1" opacity="0.15"/>
    <path d="M112 30 L80 285" stroke="#333" stroke-width="1" opacity="0.12"/>
    <path d="M188 30 L220 285" stroke="#333" stroke-width="1" opacity="0.12"/>
    <path d="M120 60 Q115 150 90 280" fill="none" stroke="#333" stroke-width="0.8" opacity="0.1"/>
    <path d="M180 60 Q185 150 210 280" fill="none" stroke="#333" stroke-width="0.8" opacity="0.1"/>
    <line x1="28" y1="280" x2="272" y2="280" stroke="#333" stroke-width="1.5" opacity="0.3"/>
    <line x1="150" y1="30" x2="150" y2="70" stroke="#333" stroke-width="1.5" opacity="0.3"/>
  </svg>`,

  joggers: `<svg viewBox="0 0 300 360" data-zones="Основа,Полоски,Манжеты" xmlns="http://www.w3.org/2000/svg">
    <path d="M65 15 L60 20 Q58 180 62 320 Q80 335 108 322 L140 200 L160 200 L192 322 Q220 335 238 320 Q242 180 240 20 L235 15 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="63" y="10" width="174" height="20" rx="3" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <line x1="68" y1="18" x2="232" y2="18" stroke="#333" stroke-width="1" opacity="0.3"/>
    <line x1="68" y1="24" x2="232" y2="24" stroke="#333" stroke-width="1" opacity="0.3"/>
    <path d="M66 30 Q64 180 67 315" fill="none" stroke="FILL_COLOR_2" stroke-width="8" opacity="0.7"/>
    <path d="M234 30 Q236 180 233 315" fill="none" stroke="FILL_COLOR_2" stroke-width="8" opacity="0.7"/>
    <path d="M62 315 Q80 330 108 318" fill="FILL_COLOR_3" stroke="#333" stroke-width="2"/>
    <path d="M238 315 Q220 330 192 318" fill="FILL_COLOR_3" stroke="#333" stroke-width="2"/>
    <path d="M140 22 L133 40 M160 22 L167 40" stroke="#333" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
    <path d="M75 200 Q90 195 105 200" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
    <path d="M195 200 Q210 195 225 200" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
  </svg>`,

  trousers: `<svg viewBox="0 0 300 360" data-zones="Основа,Пояс,Стрелки" xmlns="http://www.w3.org/2000/svg">
    <path d="M65 30 L65 35 Q63 180 55 345 L135 345 L150 200 L165 345 L245 345 Q237 180 235 35 L235 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="63" y="10" width="174" height="22" rx="3" fill="FILL_COLOR_2" stroke="#333" stroke-width="2.5"/>
    <rect x="90" y="8" width="8" height="26" rx="1" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.5"/>
    <rect x="130" y="8" width="8" height="26" rx="1" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.5"/>
    <rect x="162" y="8" width="8" height="26" rx="1" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.5"/>
    <rect x="202" y="8" width="8" height="26" rx="1" fill="FILL_COLOR_2" stroke="#333" stroke-width="1.5"/>
    <line x1="95" y1="45" x2="90" y2="340" stroke="FILL_COLOR_3" stroke-width="1.5" opacity="0.4"/>
    <line x1="205" y1="45" x2="210" y2="340" stroke="FILL_COLOR_3" stroke-width="1.5" opacity="0.4"/>
    <path d="M150 32 L150 85 Q148 90 145 85 L145 37" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
    <path d="M80 45 L80 75 Q82 85 95 80 L108 58 L108 45" fill="none" stroke="#333" stroke-width="1.5" opacity="0.35"/>
    <path d="M220 45 L220 75 Q218 85 205 80 L192 58 L192 45" fill="none" stroke="#333" stroke-width="1.5" opacity="0.35"/>
    <line x1="57" y1="340" x2="133" y2="340" stroke="#333" stroke-width="1.5" opacity="0.3"/>
    <line x1="167" y1="340" x2="243" y2="340" stroke="#333" stroke-width="1.5" opacity="0.3"/>
  </svg>`,

  cargo: `<svg viewBox="0 0 300 360" data-zones="Основа,Карманы,Ремень" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 30 L60 35 Q58 180 48 345 L132 345 L150 200 L168 345 L252 345 Q242 180 240 35 L240 30 Z" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="58" y="10" width="184" height="22" rx="3" fill="FILL_COLOR_1" stroke="#333" stroke-width="2.5"/>
    <rect x="56" y="14" width="188" height="14" rx="3" fill="FILL_COLOR_3" stroke="#333" stroke-width="1.5" opacity="0.8"/>
    <rect x="140" y="13" width="20" height="16" rx="2" fill="#999" stroke="#333" stroke-width="1.5"/>
    <circle cx="150" cy="21" r="2.5" fill="#333"/>
    <rect x="60" y="150" width="50" height="55" rx="4" fill="FILL_COLOR_2" stroke="#333" stroke-width="2" opacity="0.8"/>
    <line x1="60" y1="160" x2="110" y2="160" stroke="#333" stroke-width="1.5" opacity="0.5"/>
    <rect x="73" y="163" width="24" height="4" rx="1" fill="none" stroke="#333" stroke-width="1" opacity="0.4"/>
    <rect x="190" y="150" width="50" height="55" rx="4" fill="FILL_COLOR_2" stroke="#333" stroke-width="2" opacity="0.8"/>
    <line x1="190" y1="160" x2="240" y2="160" stroke="#333" stroke-width="1.5" opacity="0.5"/>
    <rect x="203" y="163" width="24" height="4" rx="1" fill="none" stroke="#333" stroke-width="1" opacity="0.4"/>
    <path d="M78 45 L78 78 Q80 88 95 83 L112 58 L112 45" fill="none" stroke="#333" stroke-width="1.5" opacity="0.35"/>
    <path d="M222 45 L222 78 Q220 88 205 83 L188 58 L188 45" fill="none" stroke="#333" stroke-width="1.5" opacity="0.35"/>
    <line x1="50" y1="340" x2="130" y2="340" stroke="#333" stroke-width="1.5" opacity="0.3"/>
    <line x1="170" y1="340" x2="250" y2="340" stroke="#333" stroke-width="1.5" opacity="0.3"/>
  </svg>`,
};

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@outfit.com",
      hashedPassword: adminPassword,
      isAdmin: true,
    },
  });
  console.log("Admin user created:", admin.username);

  // Create demo user
  const demoPassword = await bcrypt.hash("demo123", 10);
  const demo = await prisma.user.upsert({
    where: { username: "demo" },
    update: {},
    create: {
      username: "demo",
      email: "demo@outfit.com",
      hashedPassword: demoPassword,
      isAdmin: false,
    },
  });
  console.log("Demo user created:", demo.username);

  // Create categories
  const topCategory = await prisma.clothingCategory.create({
    data: { name: "Головные уборы", zone: "top", displayOrder: 1 },
  });
  const middleCategory = await prisma.clothingCategory.create({
    data: { name: "Верхняя одежда", zone: "middle", displayOrder: 2 },
  });
  const bottomCategory = await prisma.clothingCategory.create({
    data: { name: "Нижняя одежда", zone: "bottom", displayOrder: 3 },
  });

  // Create items - defaultColor is comma-separated for multi-zone
  const items = [
    // Top (head)
    { name: "Кепка", categoryId: topCategory.id, svg: svgTemplates.cap, color: "#2563EB,#1E40AF,#FFFFFF" },
    { name: "Шапка", categoryId: topCategory.id, svg: svgTemplates.beanie, color: "#DC2626,#B91C1C,#FFFFFF" },
    { name: "Очки", categoryId: topCategory.id, svg: svgTemplates.sunglasses, color: "#1F2937,#374151" },
    { name: "Панама", categoryId: topCategory.id, svg: svgTemplates.panama, color: "#D4A574,#C9956A,#8B6914" },
    { name: "Берет", categoryId: topCategory.id, svg: svgTemplates.beret, color: "#1F2937,#374151" },
    { name: "Повязка", categoryId: topCategory.id, svg: svgTemplates.headband, color: "#DC2626,#FFFFFF" },
    // Middle (torso)
    { name: "Футболка", categoryId: middleCategory.id, svg: svgTemplates.tshirt, color: "#FFFFFF,#FFFFFF,#FFFFFF" },
    { name: "Толстовка", categoryId: middleCategory.id, svg: svgTemplates.hoodie, color: "#6B7280,#4B5563,#374151" },
    { name: "Куртка", categoryId: middleCategory.id, svg: svgTemplates.jacket, color: "#1E3A5F,#1E3A5F,#F5F5F4" },
    { name: "Рубашка", categoryId: middleCategory.id, svg: svgTemplates.shirt, color: "#E5E7EB,#FFFFFF,#E5E7EB" },
    { name: "Свитер", categoryId: middleCategory.id, svg: svgTemplates.sweater, color: "#92400E,#78350F,#A16207" },
    { name: "Жилет", categoryId: middleCategory.id, svg: svgTemplates.vest, color: "#374151,#4B5563" },
    { name: "Пальто", categoryId: middleCategory.id, svg: svgTemplates.coat, color: "#78350F,#5F2F0E,#D4A574" },
    { name: "Бомбер", categoryId: middleCategory.id, svg: svgTemplates.bomber, color: "#064E3B,#1F2937,#D97706" },
    // Bottom (legs)
    { name: "Джинсы", categoryId: bottomCategory.id, svg: svgTemplates.jeans, color: "#1E40AF,#F59E0B" },
    { name: "Шорты", categoryId: bottomCategory.id, svg: svgTemplates.shorts, color: "#059669,#047857" },
    { name: "Юбка", categoryId: bottomCategory.id, svg: svgTemplates.skirt, color: "#DB2777,#BE185D" },
    { name: "Джоггеры", categoryId: bottomCategory.id, svg: svgTemplates.joggers, color: "#4B5563,#FFFFFF,#6B7280" },
    { name: "Брюки", categoryId: bottomCategory.id, svg: svgTemplates.trousers, color: "#1F2937,#374151,#1F2937" },
    { name: "Карго", categoryId: bottomCategory.id, svg: svgTemplates.cargo, color: "#65712B,#4D5522,#8B6914" },
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

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

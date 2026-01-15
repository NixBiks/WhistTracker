'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Spil', suit: '♠' },
  { href: '/players', label: 'Spillere', suit: '♥' },
  { href: '/stats', label: 'Statistik', suit: '♦' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 border-b-2 border-[#D4C5B0]" style={{ background: '#FFFEF9' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-1 text-2xl">
              <span className="text-[#4A4A4A]">♠</span>
              <span className="text-[#B85C5C]">♥</span>
              <span className="text-[#B85C5C]">♦</span>
              <span className="text-[#4A4A4A]">♣</span>
            </div>
            <span
              className="text-2xl tracking-wide text-[#5C4033] group-hover:text-[#6B3A3A] transition-colors"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Whist Tracker
            </span>
          </Link>
          <div className="flex gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              const suitColor = item.suit === '♥' || item.suit === '♦' ? '#B85C5C' : '#4A4A4A';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 border-2 transition-all
                    ${isActive
                      ? 'bg-[#D4A5A5] border-[#6B3A3A] text-[#FFFEF9]'
                      : 'bg-transparent border-[#D4C5B0] text-[#5C4033] hover:border-[#D4A5A5] hover:bg-[#FDF6E3]'
                    }
                  `}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.05em' }}
                >
                  <span style={{ color: isActive ? '#FFFEF9' : suitColor }} className="mr-2">{item.suit}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {/* Decorative border pattern */}
      <div className="h-1 w-full" style={{
        background: 'repeating-linear-gradient(90deg, #D4A5A5 0px, #D4A5A5 10px, #9CAF88 10px, #9CAF88 20px, #E6C86E 20px, #E6C86E 30px, #A8C5D9 30px, #A8C5D9 40px)'
      }} />
    </nav>
  );
}

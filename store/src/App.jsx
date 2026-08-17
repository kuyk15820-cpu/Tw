import React, { useEffect, useState } from 'react';
import './App.css';

// Import รูปภาพ Base64 จากโฟลเดอร์ assets
import { LOGO_BASE64, ICONS_BASE64 } from './assets';

// Import Custom Hook สำหรับป้องกัน
import useProtect from './useProtect';

const PACKAGES = [
  { 
    id: 'rov', 
    name: 'Garena RoV x DAN DA DAN', 
    server: 'TH', 
    version: '1.63.11716331', 
    bundle: 'com.garena.game.kgth', 
    price: 'Free', 
    type: 'Decrypt', 
    iconKey: 'rov', 
    downloadUrl: '/download.php?file=com.garena.game.kgth_1.63.11716331_F1X3R-Decrypt.ipa'
  },
  { 
    id: 'mlbb', 
    name: 'Mobile Legends: Bang Bang', 
    server: 'GL', 
    version: '2.1.95', 
    bundle: 'com.mobile.legends', 
    price: 'Free', 
    type: 'Decrypt', 
    iconKey: 'mlbb',
    downloadUrl: '/download.php?file=com.mobile.legends_2.1.95_F1X3R-Decrypt.ipa'
  },
  { 
    id: 'cookierunclassic', 
    name: 'CookieRun Classic', 
    server: 'GL', 
    version: '26.7.11', 
    bundle: 'com.devsisters.crg', 
    price: 'Free', 
    type: 'Decrypt', 
    iconKey: 'cookierunclassic',
    downloadUrl: '/download.php?file=com.devsisters.crg_26.7.11_F1X3R-Decrypt.ipa'
  }
];

const TROLLSTORE_PACKAGES = [
  {
    id: 'fx-storets',
    name: 'FX-StoreTS',
    version: '1.0.0',
    bundle: 'com.apple.FX-StoreTS',
    price: 'Pro',
    type: 'Tools',
    iconKey: 'default-icon'
  },
  {
    id: 'fx-decryptts',
    name: 'FX-DecryptTS',
    version: '1.2.0b2',
    bundle: 'com.apple.FX-DecryptTS',
    price: 'Pro',
    type: 'Tools',
    iconKey: 'default-icon'
  },
  {
    id: 'fx-decryptds',
    name: 'FX-DecryptDS',
    version: '1.0.0',
    bundle: 'com.apple.FX-DecryptDS',
    price: 'Pro',
    type: 'Tools',
    iconKey: 'default-icon'
  }
];

function HeroLogoImg({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  if (error || !loaded) {
    return <div className="skeleton-logo animate-pulse"></div>;
  }

  return <img className="hero-logo" src={src} alt={alt} />;
}

function PkgIconImg({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  if (error || !loaded) {
    return <div className="skeleton-icon animate-pulse"></div>;
  }

  return <img className="pkg-icon" src={src} alt={alt} />;
}

export default function App() {
  // เรียกใช้งาน Hook ป้องกันทั้งหมดในบรรทัดเดียว
  useProtect();

  const totalPackages = PACKAGES.length + TROLLSTORE_PACKAGES.length;

  return (
    <>
      <div className="hero">
        <HeroLogoImg src={LOGO_BASE64} alt="F1X3R" />
        <h1>F1X3R Store</h1>
        <p>Download Decrypted IPAs & iOS/iPadOS Utility Tools &nbsp;&middot;&nbsp; {totalPackages} packages</p>
      </div>

      <div className="divider"></div>

      <div className="section-header">
        <h2>IPA Decrypt</h2>
        <span className="badge">{PACKAGES.length}</span>
      </div>

      <div className="pkg-grid">
        {PACKAGES.map((pkg) => {
          const iconSrc = ICONS_BASE64 ? ICONS_BASE64[pkg.iconKey] : null;

          const CardContent = (
            <>
              <PkgIconImg src={iconSrc} alt={`${pkg.name} icon`} />
              <div className="pkg-info">
                <div className="pkg-name">
                  {pkg.name}
                  {pkg.server && (
                    <>
                      &nbsp;&middot;&nbsp;
                      <span className="pkg-server-text">{pkg.server}</span>
                    </>
                  )}
                </div>
                <div className="pkg-version">Version: {pkg.version}</div>
                <div className="pkg-bundle">Identifier: {pkg.bundle}</div>
                <div className="pkg-tags">
                  {pkg.price && <span className="pkg-price">{pkg.price}</span>}
                  {pkg.type && <span className="pkg-type">{pkg.type}</span>}
                </div>
              </div>
            </>
          );

          return pkg.downloadUrl ? (
            <a 
              key={pkg.id} 
              href={pkg.downloadUrl} 
              download 
              className="pkg-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {CardContent}
            </a>
          ) : (
            <div className="pkg-card" key={pkg.id}>
              {CardContent}
            </div>
          );
        })}
      </div>

      <div className="section-header">
        <h2>Tools</h2>
        <span className="badge">{TROLLSTORE_PACKAGES.length}</span>
      </div>

      <div className="pkg-grid">
        {TROLLSTORE_PACKAGES.map((pkg) => {
          const iconSrc = ICONS_BASE64 ? ICONS_BASE64[pkg.iconKey] : null;

          const CardContent = (
            <>
              <PkgIconImg src={iconSrc} alt={`${pkg.name} icon`} />
              <div className="pkg-info">
                <div className="pkg-name">
                  {pkg.name}
                  {pkg.server && (
                    <>
                      &nbsp;&middot;&nbsp;
                      <span className="pkg-server-text">{pkg.server}</span>
                    </>
                  )}
                </div>
                <div className="pkg-version">Version: {pkg.version}</div>
                <div className="pkg-bundle">Identifier: {pkg.bundle}</div>
                <div className="pkg-tags">
                  {pkg.price && <span className="pkg-type price-pro">{pkg.price}</span>}
                  {pkg.type && <span className="pkg-type tool">{pkg.type}</span>}
                </div>
              </div>
            </>
          );

          return pkg.downloadUrl ? (
            <a 
              key={pkg.id} 
              href={pkg.downloadUrl} 
              download 
              className="pkg-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {CardContent}
            </a>
          ) : (
            <div className="pkg-card" key={pkg.id}>
              {CardContent}
            </div>
          );
        })}
      </div>

      <div className="divider"></div>

      <footer>
        <p>Made with ♡ by <a href="tg://user?id=6105731078">F1X3R</a></p>
      </footer>
    </>
  );
}

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './info-style.css';

export default function UdidInfo() {
  const udidRef = useRef(null);
  const targetUDIDRef = useRef('N/A');
  const isCopyingRef = useRef(false);
  const isScramblingRef = useRef(true);

  useEffect(() => {
    // 1. ดึงข้อมูลจาก URL (Query Parameter หรือ Hash)
    const urlParams = new URLSearchParams(window.location.search);
    let encodedData = urlParams.get('data');

    if (!encodedData && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      encodedData = hashParams.get('data');
    }

    let deviceData = null;

    if (encodedData) {
      try {
        const jsonString = atob(decodeURIComponent(encodedData));
        deviceData = JSON.parse(jsonString);

        localStorage.setItem('udid_device_backup', JSON.stringify(deviceData));

        if (window.history.replaceState) {
          window.history.replaceState(null, null, '/udid-info#data=' + encodeURIComponent(encodedData));
        }
      } catch (e) {
        console.error('Decode Error:', e);
      }
    } else {
      const backup = localStorage.getItem('udid_device_backup');
      if (backup) {
        try {
          deviceData = JSON.parse(backup);
        } catch (e) {
          console.error('Backup Parse Error:', e);
        }
      }
    }

    const targetUDID = deviceData && deviceData.udid ? deviceData.udid : 'N/A';
    targetUDIDRef.current = targetUDID;

    const element = udidRef.current;
    if (!element) return;

    // 2. ฟังก์ชัน Scramble Direct DOM แบบเดียวกับตัวอย่าง 100%
    if (targetUDID === 'N/A') {
      element.innerText = 'N/A';
      isScramblingRef.current = false;
      return;
    }

    isScramblingRef.current = true;
    const chars = '0123456789ABCDEF';
    const obj = { progress: 0 };

    const tween = gsap.to(obj, {
      progress: 1,
      duration: 2.5,
      ease: 'power1.inOut',
      onUpdate: () => {
        const revealedLength = Math.floor(obj.progress * targetUDID.length);
        let result = targetUDID.substring(0, revealedLength);

        for (let i = revealedLength; i < targetUDID.length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        element.innerText = result;
      },
      onComplete: () => {
        isScramblingRef.current = false;
      }
    });

    return () => {
      tween.kill();
    };
  }, []);

  const handleCopy = () => {
    const targetUDID = targetUDIDRef.current;
    const element = udidRef.current;

    if (isCopyingRef.current || isScramblingRef.current || targetUDID === 'N/A' || !element) return;
    isCopyingRef.current = true;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(targetUDID);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = targetUDID;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    element.innerText = 'Copied to clipboard';

    setTimeout(() => {
      element.innerText = targetUDID;
      isCopyingRef.current = false;
    }, 1500);
  };

  return (
    <div className="wrapper">
      <div className="title-container">
        <div className="title">UDID info</div>
      </div>

      <div className="terminal-box" id="terminalBox" onClick={handleCopy}>
        <span className="udid-text" id="udidText" ref={udidRef}></span>
      </div>
    </div>
  );
}

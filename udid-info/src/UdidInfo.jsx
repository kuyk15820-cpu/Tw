import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './info-style.css';

export default function UdidInfo() {
  const [udidText, setUdidText] = useState('');
  const [targetUDID, setTargetUDID] = useState('N/A');
  const [isCopying, setIsCopying] = useState(false);
  const [isScrambling, setIsScrambling] = useState(true);

  const isScramblingRef = useRef(true);
  const isCopyingRef = useRef(false);

  useEffect(() => {
    isScramblingRef.current = isScrambling;
  }, [isScrambling]);

  useEffect(() => {
    isCopyingRef.current = isCopying;
  }, [isCopying]);

  useEffect(() => {
    // 1. อ่านค่า data จาก query string หรือ hash (#data=)
    const urlParams = new URLSearchParams(window.location.search);
    let encodedData = urlParams.get('data');

    if (!encodedData && window.location.hash) {
      // ตัด # ออก แล้วดึงค่า data
      const hashString = window.location.hash.startsWith('#') 
        ? window.location.hash.substring(1) 
        : window.location.hash;
      const hashParams = new URLSearchParams(hashString);
      encodedData = hashParams.get('data');
    }

    let deviceData = null;

    if (encodedData) {
      try {
        const jsonString = atob(decodeURIComponent(encodedData));
        deviceData = JSON.parse(jsonString);

        // บันทึกสำรองไว้ใน LocalStorage
        localStorage.setItem('udid_device_backup', JSON.stringify(deviceData));

        // เคลียร์ URL ให้สะอาด
        if (window.history.replaceState) {
          window.history.replaceState(null, null, '/udid-info/');
        }
      } catch (e) {
        console.error('Decode Error:', e);
      }
    } else {
      // ดึงจาก Backup หากไม่มี Parameter ใน URL
      const backup = localStorage.getItem('udid_device_backup');
      if (backup) {
        try {
          deviceData = JSON.parse(backup);
        } catch (e) {
          console.error('Backup Parse Error:', e);
        }
      }
    }

    const finalUDID = deviceData && deviceData.udid ? deviceData.udid : 'N/A';
    setTargetUDID(finalUDID);

    if (finalUDID === 'N/A') {
      setUdidText('N/A');
      setIsScrambling(false);
      return;
    }

    // 2. Animation ตัวอักษรสุ่มแบบ Hacker Effect ด้วย GSAP
    setIsScrambling(true);
    const chars = '0123456789ABCDEF-';
    const obj = { progress: 0 };

    const tween = gsap.to(obj, {
      progress: 1,
      duration: 2.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        const revealedLength = Math.floor(obj.progress * finalUDID.length);
        let result = finalUDID.substring(0, revealedLength);

        for (let i = revealedLength; i < finalUDID.length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setUdidText(result);
      },
      onComplete: () => {
        setUdidText(finalUDID);
        setIsScrambling(false);
      }
    });

    return () => {
      tween.kill();
    };
  }, []);

  const handleCopy = () => {
    if (isCopyingRef.current || isScramblingRef.current || targetUDID === 'N/A') return;

    setIsCopying(true);

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

    setUdidText('Copied to clipboard');

    setTimeout(() => {
      setUdidText(targetUDID);
      setIsCopying(false);
    }, 1500);
  };

  return (
    <div className="wrapper">
      <div className="title-container">
        <div className="title">UDID info</div>
      </div>

      <div className="terminal-box" id="terminalBox" onClick={handleCopy}>
        <span className="udid-text" id="udidText">
          {udidText}
        </span>
      </div>
    </div>
  );
}

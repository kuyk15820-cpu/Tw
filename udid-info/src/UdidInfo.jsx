import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './info-style.css';

export default function UdidInfo() {
  const [udidText, setUdidText] = useState('');
  const [targetUDID, setTargetUDID] = useState('N/A');

  const isScramblingRef = useRef(true);
  const isCopyingRef = useRef(false);

  useEffect(() => {
    // อ่านค่า data จาก URL (query string หรือ hash)
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

    const finalUDID = deviceData && deviceData.udid ? deviceData.udid : 'N/A';
    setTargetUDID(finalUDID);

    // scrambleEffect ฟังก์ชันแบบเดียวกับตัวอย่าง
    if (finalUDID === 'N/A') {
      setUdidText('N/A');
      isScramblingRef.current = false;
      return;
    }

    isScramblingRef.current = true;
    const chars = '0123456789ABCDEF'; // ตัวอักษรสุ่มเป๊ะตามตัวอย่าง
    const obj = { progress: 0 };

    const tween = gsap.to(obj, {
      progress: 1,
      duration: 2.5, // 2.5 วินาทีเป๊ะตามตัวอย่าง
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
        isScramblingRef.current = false;
      }
    });

    return () => {
      tween.kill();
    };
  }, []);

  const handleCopy = () => {
    if (isCopyingRef.current || isScramblingRef.current || targetUDID === 'N/A') return;
    
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

    setUdidText('Copied to clipboard');

    setTimeout(() => {
      setUdidText(targetUDID);
      isCopyingRef.current = false;
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

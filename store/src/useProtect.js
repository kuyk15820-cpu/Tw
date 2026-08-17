import { useEffect } from 'react';
import DisableDevtool from 'disable-devtool';

export default function useProtect() {
  useEffect(() => {
    // 1. เรียกใช้งาน DisableDevtool
    DisableDevtool({
      disableMenu: true,
      disableSelect: true,
      disableCopy: true,
      disableCut: true,
      disablePaste: true,
      clearLog: true,
    });

    // 2. บล็อก Context Menu (กดค้าง / คลิกขวา) ครอบคลุมทั้งเว็บ
    const handleContextMenu = (e) => e.preventDefault();

    // 3. บล็อกการ Drag & Drop รูปภาพทั้งหน้าเว็บ
    const handleDragStart = (e) => e.preventDefault();

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);
}

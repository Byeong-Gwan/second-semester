import { useState, useEffect, useCallback } from 'react';

type PopupState = {
  isOpen: boolean;
  type: 'modal' | 'drawer' | 'sheet' | null;
};

export function usePopupState() {
  const [popupState, setPopupState] = useState<PopupState>({
    isOpen: false,
    type: null,
  });

  const openPopup = (type: PopupState['type']) => {
    setPopupState({ isOpen: true, type });
  };

  const closePopup = () => {
    setPopupState({ isOpen: false, type: null });
  };

  return {
    popupState,
    openPopup,
    closePopup,
    shouldHideBottomNav: popupState.isOpen && popupState.type === 'drawer',
  };
}

// 전역 팝업 상태 관리 (싱글톤)
let globalPopupState: PopupState = {
  isOpen: false,
  type: null,
};

const listeners = new Set<() => void>();

export function useGlobalPopupState() {
  const [state, setState] = useState<PopupState>(globalPopupState);

  const openPopup = useCallback((type: PopupState['type']) => {
    globalPopupState = { isOpen: true, type };
    listeners.forEach(listener => listener());
  }, []);

  const closePopup = useCallback(() => {
    globalPopupState = { isOpen: false, type: null };
    listeners.forEach(listener => listener());
  }, []);

  useEffect(() => {
    const updateState = () => setState({ ...globalPopupState });
    listeners.add(updateState);
    return () => {
      listeners.delete(updateState);
    };
  }, []);

  return {
    popupState: state,
    openPopup,
    closePopup,
    shouldHideBottomNav: state.isOpen && state.type === 'drawer',
  };
}

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export type AddressInput = Omit<Address, 'id'>;

type AddressState = {
  addresses: Address[];
  selectedId: string | null;
};

type AddressContextValue = AddressState & {
  hydrated: boolean;
  selected: Address | null;

  // Modal
  modalOpen: boolean;
  modalNextRoute: string | null;
  openAddressModal: (nextRoute?: string) => void;
  closeAddressModal: () => void;

  // Data
  addAddress: (input: AddressInput) => Address;
  updateAddress: (id: string, patch: Partial<AddressInput>) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
};

const STORAGE_KEY = 'gnanrudh-addresses-v1';
const Ctx = createContext<AddressContextValue | null>(null);

function readStorage(): AddressState {
  if (typeof window === 'undefined') return { addresses: [], selectedId: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { addresses: [], selectedId: null };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { addresses: [], selectedId: null };
    return {
      addresses: Array.isArray(parsed.addresses) ? parsed.addresses : [],
      selectedId: typeof parsed.selectedId === 'string' ? parsed.selectedId : null,
    };
  } catch {
    return { addresses: [], selectedId: null };
  }
}

let nextId = 0;
const genId = () => {
  nextId += 1;
  return `addr-${Date.now().toString(36)}-${nextId}`;
};

export function AddressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AddressState>({ addresses: [], selectedId: null });
  const [hydrated, setHydrated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNextRoute, setModalNextRoute] = useState<string | null>(null);

  useEffect(() => {
    setState(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage full / disabled — silent
    }
  }, [state, hydrated]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setState(readStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const openAddressModal = useCallback((nextRoute?: string) => {
    setModalNextRoute(nextRoute ?? null);
    setModalOpen(true);
  }, []);

  const closeAddressModal = useCallback(() => {
    setModalOpen(false);
    setModalNextRoute(null);
  }, []);

  const addAddress = useCallback((input: AddressInput) => {
    const next: Address = { ...input, id: genId() };
    setState((s) => ({
      addresses: [...s.addresses, next],
      selectedId: next.id,
    }));
    return next;
  }, []);

  const updateAddress = useCallback((id: string, patch: Partial<AddressInput>) => {
    setState((s) => ({
      ...s,
      addresses: s.addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }, []);

  const removeAddress = useCallback((id: string) => {
    setState((s) => {
      const addresses = s.addresses.filter((a) => a.id !== id);
      const selectedId =
        s.selectedId === id ? (addresses[0]?.id ?? null) : s.selectedId;
      return { addresses, selectedId };
    });
  }, []);

  const selectAddress = useCallback((id: string) => {
    setState((s) => ({ ...s, selectedId: id }));
  }, []);

  const selected = useMemo(
    () => state.addresses.find((a) => a.id === state.selectedId) ?? null,
    [state.addresses, state.selectedId],
  );

  const value = useMemo<AddressContextValue>(
    () => ({
      addresses: state.addresses,
      selectedId: state.selectedId,
      selected,
      hydrated,
      modalOpen,
      modalNextRoute,
      openAddressModal,
      closeAddressModal,
      addAddress,
      updateAddress,
      removeAddress,
      selectAddress,
    }),
    [
      state.addresses,
      state.selectedId,
      selected,
      hydrated,
      modalOpen,
      modalNextRoute,
      openAddressModal,
      closeAddressModal,
      addAddress,
      updateAddress,
      removeAddress,
      selectAddress,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAddresses() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAddresses must be used inside <AddressProvider>');
  return ctx;
}

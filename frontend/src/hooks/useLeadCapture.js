import { useRef, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Get or create a persistent session ID for this browser
const getSessionId = () => {
  let sid = localStorage.getItem('wd_session_id');
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('wd_session_id', sid);
  }
  return sid;
};

/**
 * useLeadCapture — call this in your Checkout component.
 *
 * Usage:
 *   const { trackField, trackStep, markConverted } = useLeadCapture(cartItems, totalAmount, user);
 *
 *   // On each input blur:
 *   <input onBlur={(e) => trackField('name', e.target.value)} />
 *
 *   // On payment button click:
 *   trackStep('payment_initiated');
 *
 *   // After payment success:
 *   markConverted();
 */
const useLeadCapture = (cartItems = [], totalAmount = 0, user = null) => {
  const sessionId = useRef(getSessionId());
  const debounceTimer = useRef(null);

  const upsert = useCallback(async (payload) => {
    try {
      await axios.post(`${API}/leads/upsert`, {
        session_id: sessionId.current,
        user_id: user?.id || null,
        cart_items: cartItems.map(i => ({ service_id: i.id || i.service_id, name: i.name, price: i.price })),
        total_amount: totalAmount,
        ...payload,
      });
    } catch (err) {
      // Silent fail — never block the user for analytics
      console.warn('Lead capture failed silently:', err.message);
    }
  }, [cartItems, totalAmount, user]);

  /**
   * Call on input onBlur — saves one field at a time.
   * Debounced so rapid typing doesn't spam the API.
   */
  const trackField = useCallback((fieldName, value) => {
    if (!value || String(value).trim() === '') return;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      upsert({
        [fieldName]: value,
        status: 'partial',
        last_step: fieldName,
      });
    }, 600);
  }, [upsert]);

  /**
   * Call when the user completes the whole form (all fields filled),
   * or when they move to a new checkout step.
   *
   * status options: 'started' | 'partial' | 'complete' | 'payment_initiated' | 'converted'
   */
  const trackStep = useCallback((status, extraData = {}) => {
    upsert({ status, last_step: status, ...extraData });
  }, [upsert]);

  /**
   * Call this immediately after payment is verified successfully.
   */
  const markConverted = useCallback(async () => {
    try {
      await axios.post(`${API}/leads/convert/${sessionId.current}`);
    } catch (err) {
      console.warn('Lead convert mark failed:', err.message);
    }
  }, []);

  return { trackField, trackStep, markConverted, sessionId: sessionId.current };
};

export default useLeadCapture;